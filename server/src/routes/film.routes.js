import { Router } from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {
    getAllFilms,
    getFilmById,
    createFilm,
    updateFilm,
    deleteFilm,
} from "../controllers/film.controllers.js";

const router = Router();
router.route("/").get(getAllFilms); 
router.route("/:id").get(getFilmById); 
router.route("/").post(verifyJWT, createFilm); 
router.route("/:id").put(verifyJWT, updateFilm); 
router.route("/:id").delete(verifyJWT, deleteFilm); 
export default router;

