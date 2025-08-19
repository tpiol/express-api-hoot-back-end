const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Hoot = require("../models/hoot.js");
const router = express.Router();

// POST /hoots
router.post("/", verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const hoot = await Hoot.create(req.body);
        hoot._doc.author = req.user;
        res.status(201).json(hoot);
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
});

// GET /hoots
router.get("/", verifyToken, async (req, res) => {
    try {
        const hoots = await Hoot.find({}).populate("author").sort({ createdAt: "desc" })
        res.status(200).json(hoots);
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
});

// GET / hoots /: hootId
router.get("/:hootId", verifyToken, async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId).populate("author");
        res.status(200).json(hoot);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});


// PUT /hoots/:hootId
router.put("/:hootId", verifyToken, async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId);
        if (!hoot.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }
        const updatedHoot = await Hoot.findByIdAndUpdate(req.params.hootId, req.body, { new: true });

        updatedHoot._doc.author = req.user;

        res.status(200).json(updatedHoot);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

// DELETE /hoots/:hootsId
router.delete("/:hootId", verifyToken, async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId);
        if (!hoot.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }
        const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId);
        res.status(200).json(deletedHoot);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

// POST /hoots/:hootId/comments
router.post("/:hootId/comments", verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const hoot = await Hoot.findById(req.params.hootId);
        hoot.comments.push(req.body);
        await hoot.save();

        const newComment = hoot.comments[hoot.comments.length - 1];

        newComment._doc.author = req.user;

        res.status(201).json(newComment);
        } catch (err) {
        res.status(500).json({ err: err.message });
    }
})


module.exports = router;