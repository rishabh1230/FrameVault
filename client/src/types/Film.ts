export interface Film {
  id: number;
  title: string;
  director: string;
  year: number;
  country: string;
  runtime: number;
  genre: string[];
  description: string;
  image: string;
  criterionNumber?: number;
  awards?: string[];
  cast: string[];
  format: string;
  language: string;
  featured?: boolean;
}

export interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
}