const express = require("express");
const router = express.Router();

/* GET indicator page. */
router.get("/", async function (req, res, _next) {
  res.render("indicator", {
    title: `OCDS Indicators`,
  });
});

module.exports = router;
