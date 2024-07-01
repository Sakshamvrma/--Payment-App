const express = require("express");
const app=express();
const dotenv = require("dotenv");
const cors=require('cors')
const mongoose=require('mongoose')
app.use(cors());
dotenv.config({path:'./config.env'});
app.use(express.json());
const userRoutes=require('./routes/UserRoutes')
const accountRoutes=require('./routes/accountRoutes')
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/accounts",accountRoutes)


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is connected successfully!");
  } catch (err) {
    console.log(err);
  }
};

app.get("/", (req, res) => {
  res.json("Server is up and running");
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log("Server is running on port: " + process.env.PORT);
});