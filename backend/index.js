'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const config = require('config');
const db = require('./models');
const app = express();
const host = process.env.HOST || config.web.host;
const port = process.env.PORT || config.web.port;
const fs = require('fs');

const filePath = '/home/ubuntu/test.png';

app.use(bodyParser.json());
app.use(fileUpload());

app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); next(); }); 

app.set('port', port);

app.get('/', (req, res) => {
  console.log('**********************8get',fs.createReadStream(filePath).pipe(res))
  //fs.createReadStream(filePath).pipe(res);
});

app.post('/', (req, res) => {
  fs.writeFileSync(filePath, req.files.file.data);
  console.log('*****************',filePath, req.files.file.data)
  res.status(200).json({
    imagePath: 'http://127.0.0.1:7000/'
  });
});

app.listen(port, host, async () => {
  try {
    await db.sequelize.sync();
    await db.init();
    console.log(`Start account server, host: ${host}, port: ${port}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});