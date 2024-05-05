const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = require("./routes/route");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//connect to database mongoose
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err, "error connecting db"));

app.get("/", (req, res) => {
  res.send("server running");
});

app.use(router);

//listen server  on port 5000
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
