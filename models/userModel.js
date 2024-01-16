const mongoose = require('mongoose');

const userSchema = mongoose.Schema (
    {
        firstName: {
            type: String,
            required: [true, "Please enter first name"]
        },
        lastName: {
            type: String,
            required: [true, "Please enter Last name"]
        },
        email: {
            type:String,
            required: [true, "Please enter your email"]
        }

    },
    //added to indicate time data was created & updated
    {
        timestamps: true
    }

)

const User = mongoose.model('User', userSchema);

module.exports = User;