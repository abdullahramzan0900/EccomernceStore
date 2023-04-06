const express = require("express");
var mongoose = require("mongoose");
const cors = require("cors");
const database =  (module.exports = () => {
    const connectionparams = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    console.log( process.env.MONGO_URL);

    try {
      mongoose.connect(
        process.env.MONGO_URL,
        connectionparams
      );
      console.log("Database Sucessfully Connected");
    } catch (error) {
      console.log(error, "error");  

    }
  });
