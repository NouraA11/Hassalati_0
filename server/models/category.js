import mongoose from "mongoose";
const { Schema, ObjectId } = mongoose;

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        icon: {
            type: String,
            default: "ellipsis-h",
        },
        type: {
            type: String,
            required: true,
        },
        typeIndex: {
            type: Number,
            required: true,
        },
        user: {
            type: ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
