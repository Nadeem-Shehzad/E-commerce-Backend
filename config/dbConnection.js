const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.DATABASE_CONNECTION_ADDRESS);
        if (connect) {
            console.log('Database connected: ', connect.connection.name);
        }
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}


module.exports = connectDB;