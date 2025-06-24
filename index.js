import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import imageRoutes from './api/routes/imageRoutes.js';
import videoRoutes from './api/routes/videoRoutes.js';
import webRoutes from './api/routes/webRoutes.js';
import categoryInfoRoutes from "./api/routes/categoryInfoRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/portfolio/categoryInfo', categoryInfoRoutes);
app.use('/portfolio/images', imageRoutes);
app.use('/portfolio/videos', videoRoutes);
app.use('/portfolio/web', webRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

/* 
In vite.config.js, the entry points for each page are already defined by Vite's rollup build. For example, visiting (website-link)/projects.html will load the projects.html file.
The routes defined here using Express will add an additional way to access the html file. Therefore, visiting (website-link)/projects will load the same projects.html file.
*/
app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'projects.html'));
});

app.get('/credits', (req, res) => {
  res.sendFile(path.join(__dirname, 'credits.html'));
});

// Fallback route for any other pages
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Undefined endpoints (Express 5)
app.use('/*splat', (req, res) => {
  const errorMessage = "This API endpoint does not exist";
  res.json({
    error: 'Not found',
    message: errorMessage,
    path: req.originalUrl
  });
  console.log(errorMessage);
});

let conn = null;
const MONGO_URI = process.env.MONGO_URI;

const connectToDatabase = async () => {
  if (conn == null) {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI not found in environment variables');
    }
    conn = mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 100,
      dbName: 'projects',
    }).then(() => mongoose);

    await conn;
  }
  return conn;
};

const handler = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to connect to the database."
    });
  }
};

if (process.env.NODE_ENV !== 'production') {
  connectToDatabase().then(() => {
    console.log("Connected to MongoDB for local development.");
    app.listen(PORT, () => {
      console.log(`API server is listening on port ${PORT}`);
    });
  }).catch(err => {
    console.error('Failed to start development server:', err);
    process.exit(1);
  });
}

export default handler;