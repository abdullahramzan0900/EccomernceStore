const express = require("express");
const bodyparser = require("body-parser");
var mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { CLIENT_RENEG_LIMIT } = require("tls");
const multer = require("multer");

const schema = mongoose.Schema(
  {
    name: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    question: { type: String, require: true },
  },
  { timestamps: true }
);

const ImageSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  Price: {
    type: Number,
    require: true,
  },
  Description: {
    type: String,
    require: true,
  },
  Image: {
    type: String,
    require: true,
  },
});

const ProductDetail = mongoose.model("Products", ImageSchema);

const newusers = mongoose.model("newusers", schema);

exports.resgiterController = async (req, resp) => {
  const { name, password } = req.body;
  console.log(req.body, "SSSS");
  console.log(await bcrypt.hash(password, 10));
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const response = await newusers.create({
      name: name,
      password: hashedPassword,
    });
    resp.json(response);
    console.log("USER SUCCESSFULLY CREATED", response);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "onlineshopify124@gmail.com",
        pass: "yzrqtdcjylkjfetg",
      },
    });

    // set up email data with unicode symbols
    const mailOptions = {
      from: "onlineshopify124@gmail.com",
      to: req.body.name,
      subject: "Registeration Completed Sucessfully",
      text: "Welcome to OnlineShopify!",
      html: "Welcome to OnlineShopify!",
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error, "AAAA");
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};
exports.LoginController = async (req, resp) => {
  const { name, password } = req.body;
  const user = await newusers.findOne({ name }).lean();
  if (!user) {
    return resp.status(400).send({
      status: "NO USER FOUND",
    });
  }
  if (await bcrypt.compare(password, user.password));
  {
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.jwt_secret
    );

    return resp.status(400).send({
      status: "userfound",
      token: token,
    });
  }
};
exports.ForgetPassmail = async (req, resp) => {
  const { name } = req.body;
  console.log(req.body.name);
  email = req.body.name;

  if (req.body.name) {
    function generateRandomNumber() {
      var minm = 100000;
      var maxm = 999999;
      return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    }
    randomnumber = generateRandomNumber();
    randomnumber = randomnumber.toString();
    console.log(randomnumber, "rrrr");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "onlineshopify124@gmail.com",
        pass: "yzrqtdcjylkjfetg",
      },
    });

    // set up email data with unicode symbols
    const mailOptions = {
      from: "onlineshopify124@gmail.com",
      to: req.body.name,
      subject: "Registeration Completed Sucessfully",
      text: randomnumber,
      html: randomnumber,
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error, "AAAA");
      } else {
        console.log("Email sent:" + info.response);
      }
    });
    resp.send({
      status: true,
    });
  } else {
    resp.status(400).send({
      status: "false",
      message: "no-email",
    });
  }
};
exports.ForgetPassword = async (req, resp) => {
  try {
    const { name, randomnum, password } = req.body;

    const user = await newusers.findOne({ name });
    console.log(req.body, "bdy");
    if (!user) {
      resp.send({
        status: false,
        message: "USER NOT FOUND",
      });
      return;
    }
    console.log(password, "password");
    console.log(randomnum, "ssss");
    console.log(randomnumber, "aaa");

    console.log(typeof randomnum);

    if (randomnum !== randomnumber) {
      resp.status(400).send({
        status: false,

        message: "Invalid Verification Code",
      });
    }
    if (email !== req.body.name) {
      resp.status(400).send({
        status: false,
        message: "Please Enter Valid Email",
      });
      return;
    }

    const hashedpass = await bcrypt.hash(password, 10);
    console.log(hashedpass, "aaa");
    const updatedUser = await newusers.findByIdAndUpdate(user._id, {
      password: hashedpass,
    });
    resp.status(200).send({
      status: true,
      message: "password reset sucessfully",
      updatedUser,
    });
  } catch (error) {
    resp.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

exports.ProductInfo = async (req, res) => {
  const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, db) => {
      // console.log(filename,"aaaa");
      db(null, file.originalname);
    },
  });
  console.log(storage,"aaa")
  const upload = multer({
    storage: storage,
  }).single("TestImage");

  upload(req, res, (err) => {
    console.log(req.file.filename, "aaa");
    if (err) {
      console.log(err);
    } else {
      const imageURL = req.protocol +"://" +req.get("host") +"/node/" + req.file.filename;
      console.log(imageURL, "aaa");
      const NewProductDetail = new ProductDetail({
        name: req.body.name,
        Price: req.body.Price,
        Description: req.body.Description,
        Image: imageURL,
        // image: {
        //   data: req.file.filename,
        //   contentType: "image/png",
        // },
      });
      
      console.log(NewProductDetail,"newproductdetail");
      NewProductDetail.save()

        .then(() => {
          res.status(200).send({
           name:req.body.name,
           Price: req.body.Price,
           Description: req.body.Description,
           Image: imageURL,


        })})
        .catch((err) => console.log(err));
        
    }
  });
};
