const express = require('express');
require('dotenv').config();

const adminRoutes = require('./routes/admin/aRoutes');
const userRoutes = require('./routes/user/uRoutes');
const customErrorHandler = require('./middlewares/errorHandler');
const connectDB = require('./config/dbConnection');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use(customErrorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
});