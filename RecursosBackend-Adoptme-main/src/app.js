import 'dotenv/config';
import mongoose from 'mongoose';
import app from './expressApp.js';

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Falta MONGODB_URI en el entorno (.env o variable del sistema).');
    process.exit(1);
}

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    })
    .catch((err) => {
        console.error('Error conectando a MongoDB:', err.message);
        process.exit(1);
    });
