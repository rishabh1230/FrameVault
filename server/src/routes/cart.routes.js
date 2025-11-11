import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {
    getCart,
    addItemToCart,
    updateCartItem,
    removeItemFromCart,
    clearCart,
} from "../controllers/cart.controllers.js";

const router = Router();
router.route("/").get(verifyJWT, getCart);
router.route("/").post(verifyJWT, addItemToCart);
router.route("/").delete(verifyJWT, clearCart); 
router.route("/:itemId").put(verifyJWT, updateCartItem); 
router.route("/:itemId").delete(verifyJWT, removeItemFromCart); 
export default router;

