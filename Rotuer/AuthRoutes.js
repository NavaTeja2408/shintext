const express = require("express");
const { signUp, login, logout } = require("../Components/AuthComponents");
const cors = require("cors");

const multer = require("multer");

const router = express.Router();

const corsoption = {
  credentials: true,
  origin: ["http://localhost:3000"],
  optionStatus: 200,
};

router.use(cors(corsoption));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/signup", upload.single("avatar"), signUp);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
