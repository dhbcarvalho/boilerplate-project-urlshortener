require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongo = require("mongodb");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dns = require("dns");
const urlParser = require('urlparser');

// Basic Configuration
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI
mongoose.connect(uri);

const schema = new mongoose.Schema({
  original_url: String,
  short_url: String
});
const Url = mongoose.model('Url', schema);



app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Your first API endpoint bodyurl).host.hostname

app.post('/api/shorturl', function(req, res) {
  const bodyurl = req.body.url;
  let urlRegex = /https:\/\/www.|http:\/\/www./g;
  const something = dns.lookup(req.body.url.replace(urlRegex, ""), (err, address, family) => {
    if (req.body.url === "") {
      res.json({
        error: 'invalid url'
      });
    } 
    else if (!(req.body.url.includes('http'))) {
          res.json({ error: "Invalid URL" })
        } 
        else {
 dns.lookup(urlParser.parse(bodyurl).host.hostname, (error, address) => {
        if (!address) {
          res.json({ error: "Invalid URL1" })
        }else if (req.body.url === "") {
      res.json({
        error: 'invalid url2'
      });
          } else {
          const url = new Url({
            original_url: bodyurl,
            short_url: "1"
          })
          url.save((err, data) => {

            res.json({
              original_url: bodyurl,
              short_url: data.id
            })
          })
        }
      })
    }
  })
});

app.get("/api/shorturl/:id", (req, res) => {
  const id = req.params.id;
  Url.findById(id, (err, data) => {
    if (!data) {
      res.json({ error: "Invalid URL" })
    } else {
      res.redirect(data.original_url)
    }
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

