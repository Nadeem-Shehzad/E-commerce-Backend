const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.status(200).json({ message: `Welcome in E-com Apis` });
});
 
app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
});