import mongoose from "mongoose";
const { Schema, ObjectId } = mongoose;

const transactionSchema = new mongoose.Schema(
    {
        value: {
            type: Number,
            trim: true,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        typeIndex: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: Date,
            required: true,
        },
        category: {
            type: ObjectId,
            required: true,
            ref: "Category",
        },
        user: {
            type: ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
