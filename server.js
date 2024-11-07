require('dotenv').config();
const express = require('express');
const connectDB = require('./database/db')
const authRoutes = require('./Routes/authRoute')
const homeRoutes = require('./Routes/homeRoute')
const adminRoutes = require('./Routes/adminRoute')
const uploadImageRoutes = require('./Routes/imageRoute')

const app = express();
const PORT = process.env.PORT || 3000

connectDB();

//middleware
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", uploadImageRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}` )
})
