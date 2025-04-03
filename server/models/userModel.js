import mongoose from "mongoose";

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
    return verificationCode;
}

export const User = mongoose.model("User", userSchema);