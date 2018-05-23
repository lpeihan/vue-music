const express = require('express');
const axios = require('axios');

const app = express();

const apiRoutes = express.Router();

apiRoutes.get('/disc-list', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data);
  }).catch((e) => {
    console.log(e);
  });
});

app.use('/api', apiRoutes);

app.listen(8301, () => {
  console.log('express listening on port 8301');
});
