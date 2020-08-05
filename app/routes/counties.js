var express = require('express');
var router = express.Router();
var async  = require('express-async-await');
var fetch = require('node-fetch');

const fetchURL = 'https://pcc.g0v.ronny.tw/api/tender?unit_id=3.82.28&job_number=1080829-1';

function fetchData() {
    return fetch(fetchURL);
}

/* GET County page. */
router.get('/', async function(req, res, next) {
  const results = await fetchData().then(data => data.json());
  console.log('results', results );
  res.render('county', { title: `Social Housing Map`, county: req.query.name ,data: results});
});

module.exports = router;
