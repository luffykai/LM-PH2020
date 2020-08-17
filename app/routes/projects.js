var express = require("express");
var router = express.Router();

var fetch = require("node-fetch");

const fetchURL =
  "https://pcc.g0v.ronny.tw/api/tender?unit_id=3.82.28&job_number=1080829-1";

function fetchData() {
  return fetch(fetchURL);
}

/* GET projects page. */
router.get("/", async function (req, res, _next) {
  const results = await fetchData().then((data) => data.json());
  const county = req.query.county;
  const projectID = req.query.project_id;

  // render project.pug file
  res.render("project", {
    title: `Social Housing`,
    county,
    projectID,
    data: results,
  });
});

module.exports = router;
