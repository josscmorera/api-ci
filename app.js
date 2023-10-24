const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
const { moongoseConect } = require("./db");
const cors = require("cors");
const debug = require("debug")("app:app");

const tagsRouter = require("./routes/tag");
const usersRouter = require("./routes/user");
const postsRouter = require("./routes/post");
const indexRouter = require("./routes/index");
const reportsRouter = require("./routes/report");
const commentsRouter = require("./routes/comment");
const communityRouter = require("./routes/community");
const { createAdminUser } = require("./helpers/user");

const app = express();
moongoseConect();
createAdminUser();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors()); // enable CORS
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const imgDir = path.join(__dirname, "uploads");

app.use("/uploads", express.static(imgDir));

app.use("/", indexRouter);
app.use("/api/users/", usersRouter);
app.use("/api/tags/", tagsRouter);
app.use("/api/reports/", reportsRouter);
app.use("/api/posts/", postsRouter);
app.use("/api/comments/", commentsRouter);
app.use("/api/communities/", communityRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  req.message = err.message;
  req.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
