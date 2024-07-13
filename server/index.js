const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectedDB");
const router = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const { server, app } = require("./socket/index.js");
const upload = multer();

connectDB();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(upload.none());
app.use(cookieParser());

app.use("/api", router);
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
