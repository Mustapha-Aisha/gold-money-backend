const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        dropDups: true,
    },
    email: {
        required: true,
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        dropDups: true,
        uniqueCaseInsensitive: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;