const request = require('request');

request('https://pcc.g0v.ronny.tw/api', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(body);
  console.log(body.url);
  console.log(body.explanation);
});
