var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");
const fs = require("fs");

const fetchURL =
  "https://pcc.g0v.ronny.tw/api/tender?unit_id=3.82.28&job_number=1080829-1";

function fetchData() {
  return fetch(fetchURL);
}

/* GET County page. */
router.get("/", async function (req, res, _next) {
  const results = await fetchData().then((data) => data.json());
  const mapData = fs.readFileSync("./map_data/map_topo.json");

  res.render("county", {
    title: `Social Housing Map`,
    county: req.query.name,
    data: results,
    mapData: mapData,
  });
});

module.exports = router;
