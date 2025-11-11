import mongoose, { Schema } from "mongoose";

const filmSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    director: {
      type: String,
      required: true,
      trim: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      // Alias for releaseYear for frontend compatibility
    },
    price: { // Price for purchasing/renting
      type: Number,
      required: true,
      min: 0,
    },
    stock: { // Inventory count
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    // Additional fields to match frontend
    country: {
      type: String,
      trim: true,
    },
    runtime: {
      type: Number,
      min: 0,
    },
    genre: [{
      type: String,
      trim: true,
    }],
    image: {
      type: String,
      trim: true,
    },
    criterionNumber: {
      type: Number,
    },
    awards: [{
      type: String,
      trim: true,
    }],
    cast: [{
      type: String,
      trim: true,
    }],
    format: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Set year from releaseYear if not provided
filmSchema.pre('save', function(next) {
  if (!this.year && this.releaseYear) {
    this.year = this.releaseYear;
  }
  next();
});

export const Film = mongoose.model("Film", filmSchema);