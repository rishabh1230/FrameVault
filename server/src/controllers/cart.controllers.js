import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/cart.model.js";
import { Film } from "../models/film.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
export const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId }).populate('items.film');
    if (!cart) {
        cart = new Cart({
            user: userId,
            items: [],
        });
        await cart.save();
    }
    
    const total = cart.calculateTotal();
    
    return res.status(200).json(
        new ApiResponse(200, {
            cart,
            total,
            itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        }, "Cart fetched successfully")
    );
});

export const addItemToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { filmId, quantity = 1 } = req.body;
    
    if (!filmId) {
        throw new ApiError(400, "Film ID is required");
    }
    const film = await Film.findById(filmId);
    if (!film) {
        throw new ApiError(404, "Film not found");
    }
    
    if (film.stock < quantity) {
        throw new ApiError(400, `Insufficient stock. Only ${film.stock} available.`);
    }
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({
            user: userId,
            items: [],
        });
    }
    const existingItemIndex = cart.items.findIndex(
        (item) => item.film.toString() === filmId
    );
    
    if (existingItemIndex !== -1) {
       
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;
        if (film.stock < newQuantity) {
            throw new ApiError(400, `Insufficient stock. Only ${film.stock} available.`);
        }
        
        cart.items[existingItemIndex].quantity = newQuantity;
    } else {
        cart.items.push({
            film: filmId,
            quantity,
            price: film.price,
            title: film.title,
            image: film.image || null,
        });
    }
    
    await cart.save();
    await cart.populate('items.film');
    
    const total = cart.calculateTotal();
    
    return res.status(200).json(
        new ApiResponse(200, {
            cart,
            total,
            itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        }, "Item added to cart successfully")
    );
});
export const updateCartItem = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
        throw new ApiError(400, "Quantity must be at least 1");
    }
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    
    const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === itemId
    );
    
    if (itemIndex === -1) {
        throw new ApiError(404, "Item not found in cart");
    }
    const film = await Film.findById(cart.items[itemIndex].film);
    if (!film) {
        throw new ApiError(404, "Film not found");
    }
    
    if (film.stock < quantity) {
        throw new ApiError(400, `Insufficient stock. Only ${film.stock} available.`);
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.film');
    
    const total = cart.calculateTotal();
    
    return res.status(200).json(
        new ApiResponse(200, {
            cart,
            total,
            itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        }, "Cart item updated successfully")
    );
});
export const removeItemFromCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { itemId } = req.params;
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    
    const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === itemId
    );
    
    if (itemIndex === -1) {
        throw new ApiError(404, "Item not found in cart");
    }
    
    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate('items.film');
    
    const total = cart.calculateTotal();
    
    return res.status(200).json(
        new ApiResponse(200, {
            cart,
            total,
            itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        }, "Item removed from cart successfully")
    );
});

export const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    
    cart.items = [];
    await cart.save();
    
    return res.status(200).json(
        new ApiResponse(200, {
            cart,
            total: 0,
            itemCount: 0,
        }, "Cart cleared successfully")
    );
});

