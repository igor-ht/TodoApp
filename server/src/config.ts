import { configDotenv } from 'dotenv';

configDotenv();

export const PORT = process.env.PORT;

export const ORIGIN = process.env.ORIGIN;

export const DB_URL = process.env.DB_URL;

export const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY as string;

export const REFRESH_TOKEN_KEY = process.env.REFRESH_TOKEN_KEY as string;
