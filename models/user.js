const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
username: {
    type: String,
    required: true
},
password: {
    type: String, 
    required: true,
}
});

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        delete returnedObject.password;
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;