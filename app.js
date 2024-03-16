require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || 8000;

const authRouter = require('./routes/users/auth.routes');

app.listen(port, () => console.log(`Listening on ${port}`));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRouter);
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log(`[Issue]: ${error}`);
  });

app.use((req, res) => {
  res.status(404).render("404", { title: "Page not found" });
});
module.exports = app;
