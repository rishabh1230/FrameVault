import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema({
    film: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Film",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
});

const cartSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // One cart per user
        },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

cartSchema.methods.calculateTotal = function() {
    return this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
};

export const Cart = mongoose.model("Cart", cartSchema);

