const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String,
        unique: [true, 'Email Already Exists'],
    },
    password: {
        type: String
    },
    image: {
        type: String,
        default: ''
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    zipCode: {
        type: String,
        default: ''
    },
    token: {
        type: String,
        default: ''
    }

}, { timestamps: true });


UserSchema.pre('save', function (next) {
    if (this.phoneNumber && !this.phoneNumber.startsWith('+92')) {
        this.phoneNumber = `+92${this.phoneNumber}`
    }
    if (this.isAdmin) {
        this.isBlocked = undefined;
    }
    next();
});


UserSchema.statics.hashedPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};


UserSchema.methods.isPasswordMatched = async function (password) {
    return await bcrypt.compare(password, this.password);
};


UserSchema.statics.findUser = function (email) {
    return this.findOne({ email: email });
};


const userModel = mongoose.model('User', UserSchema);

module.exports = userModel;