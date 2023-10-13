require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${__dirname}/public`));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const urls = [];

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  let url = req.body.url.replace(/\/*$/, '');
  let validUrl = new URL(url).hostname;

  console.log(url, validUrl, );

  dns.lookup(validUrl, (err, address, family) => {

    if(err){
      res.json({ error: 'invalid url' });
    } else {
      if(!urls.includes(req.body.url)) {
        urls.push(req.body.url);
      }

      res.json({
        original_url: req.body.url,
        short_url: urls.indexOf(req.body.url) + 1
      });
    }
  });
});

app.get('/api/shorturl/:number', (req, res) => {
  res.redirect(urls[req.params.number - 1])
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
