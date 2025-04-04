import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        role: {
            type: String,
            enum: ["User", "Admin"],
            default: "User",
        },
        accountVerified: {
            type: Boolean,
            default: false,
        },
        borrowedBooks: [
            {
                bookId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Borrow",
                },
                returned: {
                    type: Boolean,
                    default: false,
                },
                bookTitle: {
                    type: String,
                },
                borrowedDate: {
                    type: Date,
                },
                dueDate: {
                    type: Date,
                },
            },
        ],
        avatar: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
        verificationCode: {
            type: Number,
        },
        verificationCodeExpires: {
            type: Date,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpire: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);



userSchema.methods.generateVerificationCode = async function () {
    function generateRandomFiveDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigits = Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, 0);
        return parseInt(firstDigit + remainingDigits);
    }
    const verificationCode = generateRandomFiveDigitNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpires = Date.now() + 15*60*1000;
    //await this.save();
    return verificationCode;
};

userSchema.methods.generateToken = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

userSchema.methods.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await this.save({ validateBeforeSave: false });
    return resetToken;
}

export const User = mongoose.model("User", userSchema);