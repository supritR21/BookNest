import { config } from 'dotenv';
config();

import { app } from './app.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
