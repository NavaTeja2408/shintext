const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const router = require("./Rotuer/AuthRoutes.js");
const cloudinary = require("cloudinary").v2;
const cookieParser = require("cookie-parser");
const chatroute = require("./Rotuer/chatRoutes.js");
const { server, io, app } = require("./socket/socket.js");
const path = require("path");

server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());

mongoose
  .connect(
    "mongodb+srv://teja:fKYySRiaCwbiHWWJ@all.rm1ycdv.mongodb.net/?retryWrites=true&w=majority&appName=all"
  )
  .then(() => {
    console.log("Database is connected");
  })
  .catch(() => {
    console.log("Database is not Connected");
  });

cloudinary.config({
  cloud_name: "dojwaepbj",
  api_key: "297732425395887",
  api_secret: "fXO_TccSrbmssrzYDj1U7gZhGeA",
});

server.use("/api/auth", router);
server.use("/api/chat", chatroute);

app.listen(8000, () => {
  console.log("server is running");
});
