const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const path = require("path");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const database=require('./Config/db.js');
require('dotenv').config();
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
const app = express(); //executable form

app.use("/", express.static(path.join(__dirname, "static")));
app.use("/node", express.static(path.join(__dirname, "/uploads")));
app.use(bodyparser.json());
database();

// app.get('/', (req, res) => {
//   res.json({message: "seccesss"})
// })
app.use(cors(corsOptions));
app.use(authRoutes);

 



app.listen(process.env.Port || 5000);
