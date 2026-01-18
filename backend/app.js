import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import streamRoutes from './routes/stream.routes.js';
import videoRoutes from './routes/video.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Welcome to the Videx Backend!');
});

//Stream Routes
app.use('/api/v1/streams', streamRoutes);
app.use('/api/v1/videos', videoRoutes);


export default app;
