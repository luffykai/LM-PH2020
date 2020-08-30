const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const admin = require("firebase-admin");

const serviceAccount = require("../lm-ph2020-firebase-adminsdk.json");
admin.initializeApp(
  {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://lm-ph2020.firebaseio.com",
  },
  "lm-ph2020"
);

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const countyRouter = require("./routes/counties");
const projectRouter = require("./routes/projects");
const indicatorRouter = require("./routes/indicator");
const signinRouter = require("./routes/signin");

const fs = require("fs");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/county", countyRouter);
app.use("/project", projectRouter);
app.use("/indicator", indicatorRouter);
app.use("/signin", signinRouter);

function deleteFile(file) {
  fs.unlink(file, function (err) {
    if (err) {
      console.error(err.toString());
    } else {
      console.warn(file + " deleted");
    }
  });
}
// This is a dummy endpoint where we dump the ${data} you send to the server side
// into a ${filename} that you passed in.
// and eventually triggers a download in the frontend.
// TODO: Maybe consider take an ocdsid and fetch from firebase from the backend
app.post("/download", function (req, res) {
  const fileName = `${req.body.filename}.json`;
  const filePath = `/tmp/${fileName}`;
  fs.writeFileSync(filePath, req.body.data);

  // Let frontend browser know that this is a download file
  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res).once("close", function () {
    stream.destroy(); // makesure stream closed, not close if download aborted.
    fs.unlink(filePath, function (err) {
      if (err) {
        console.error(err.toString());
      } else {
        console.warn(filePath + " deleted");
      }
    });
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
