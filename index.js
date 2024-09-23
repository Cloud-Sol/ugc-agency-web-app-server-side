const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./src/config/db');
const { errorMiddleware } = require('./src/middleware/error');
const authMiddleware = require('./src/middleware/authMiddleware');

dotenv.config();
connectDB();

// =======================================  Middleware  ============================================

const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());

const port = process.env.PORT || 5000;
const api = process.env.API_URL;

// =======================================  Importing Routers  =====================================

const userRoutes = require('./src/routes/userRoutes');
const mediaRoutes = require('./src/routes/mediaRoutes');
const offerRoutes = require('./src/routes/offerRoutes');

// =======================================  Routers  ===============================================

app.use(`${api}/users`, userRoutes);
app.use(`${api}/media`, mediaRoutes);
app.use(`${api}/offers`, offerRoutes);

// =======================================  Creating Server  =======================================
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
