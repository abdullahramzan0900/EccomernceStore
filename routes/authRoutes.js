const express = require("express");
const multer=require('multer')
const {resgiterController,LoginController,ForgetPassmail,ForgetPassword,ProductInfo} = require("../Controller/AuthController");

let randomnumber;
let email;
console.log(resgiterController,"aaa")



const app = (module.exports = express());
app.post("/api/register", resgiterController);
app.post("/api/login", LoginController);
app.post("/forgetpassmail",ForgetPassmail);
app.post("/api/forget-password",ForgetPassword);
app.post("/ProductDetail",ProductInfo);

app.use('/node/uploads', express.static('/node/uploads'));

