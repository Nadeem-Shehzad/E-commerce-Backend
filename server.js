const express = require('express');
require('dotenv').config();
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin/productRoutes');
const userRoutes = require('./routes/user/productRoutes');
const cProductRoutes = require('./routes/cProductRoutes');

const customErrorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/dbConnection');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/product', cProductRoutes);
app.use(customErrorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
});