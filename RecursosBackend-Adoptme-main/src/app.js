import mongoose from 'mongoose';
import app from './expressApp.js';

const PORT = process.env.PORT || 8080;
mongoose.connect(`URL DE MONGO`);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
