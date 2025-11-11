import { asyncHandler } from "../utils/asyncHandler.js";
import { Film } from "../models/film.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllFilms = asyncHandler(async (req, res) => {
    const { featured, genre, search, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (featured === 'true') {
        query.featured = true;
    }
    
    if (genre) {
        query.genre = { $in: [genre] };
    }
    
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { director: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const films = await Film.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    
    const total = await Film.countDocuments(query);
    
    return res.status(200).json(
        new ApiResponse(200, {
            films,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit)),
            },
        }, "Films fetched successfully")
    );
});

// Get film by ID
export const getFilmById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const film = await Film.findById(id);
    
    if (!film) {
        throw new ApiError(404, "Film not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, film, "Film fetched successfully")
    );
});
export const createFilm = asyncHandler(async (req, res) => {
    const {
        title,
        director,
        releaseYear,
        year,
        price,
        stock,
        description,
        country,
        runtime,
        genre,
        image,
        criterionNumber,
        awards,
        cast,
        format,
        language,
        featured,
    } = req.body;
    

    const existingFilm = await Film.findOne({ title });
    if (existingFilm) {
        throw new ApiError(400, "Film with this title already exists");
    }
    const filmYear = year || releaseYear;
    
    const film = new Film({
        title,
        director,
        releaseYear: filmYear,
        year: filmYear,
        price,
        stock: stock || 0,
        description,
        country,
        runtime,
        genre: genre || [],
        image,
        criterionNumber,
        awards: awards || [],
        cast: cast || [],
        format,
        language,
        featured: featured || false,
    });
    
    const savedFilm = await film.save();
    
    return res.status(201).json(
        new ApiResponse(201, savedFilm, "Film created successfully")
    );
});
export const updateFilm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.year && !updateData.releaseYear) {
        updateData.releaseYear = updateData.year;
    } else if (updateData.releaseYear && !updateData.year) {
        updateData.year = updateData.releaseYear;
    }
    
    const film = await Film.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    );
    
    if (!film) {
        throw new ApiError(404, "Film not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, film, "Film updated successfully")
    );
});
export const deleteFilm = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    const film = await Film.findByIdAndDelete(id);
    
    if (!film) {
        throw new ApiError(404, "Film not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, null, "Film deleted successfully")
    );
});

