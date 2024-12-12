const express = require('express');
require('dotenv').config();

const adminRoutes = require('./routes/admin/aRoutes');
const userRoutes = require('./routes/user/uRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
});