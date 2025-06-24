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

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

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

if (process.env.NODE_ENV !== 'production') {
    const startServer = () => {
        const MONGO_URI = process.env.MONGO_URI;
        if (!MONGO_URI) {
            console.error('MONGO_URI not found in environment variables');
            console.log('Starting server without MongoDB connection...');
            app.listen(PORT, () => {
                console.log(`API server is listening on port ${PORT} (without MongoDB)`);
            });
            return;
        }
        mongoose.connect(MONGO_URI, {
            maxPoolSize: 100,
            dbName: 'projects',
        })
        .then(async () => {
            console.log("\nConnected to MongoDB");
            console.log("Database Name:", mongoose.connection.db.databaseName);
            const collections = await mongoose.connection.db.listCollections().toArray();
            const collectionNames = collections.map(col => col.name);
            console.log("All Collection Names:", collectionNames.length ? collectionNames.join(", ") : "[ ]");
            app.listen(PORT, () => {
                console.log(`\nAPI server is listening on port ${PORT} with MongoDB connection`);
            });
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
            console.log('Starting server without MongoDB connection...');
            app.listen(PORT, () => {
                console.log(`\nAPI server is listening on port ${PORT} (MongoDB connection failed)`);
            });
        });
    };
    startServer();
} else {
    // For Vercel production environment, connect to MongoDB directly
    const MONGO_URI = process.env.MONGO_URI;
    if (MONGO_URI) {
        mongoose.connect(MONGO_URI, {
            maxPoolSize: 100,
            dbName: 'projects',
        })
        .then(() => {
            console.log("Connected to MongoDB in serverless mode");
        })
        .catch(err => {
            console.error('MongoDB connection error in serverless mode:', err);
        });
    }
}

export default app;