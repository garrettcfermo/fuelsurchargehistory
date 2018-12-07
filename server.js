const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const path = require('path')
const axios = require('axios')
const cheerio = require('cheerio')
const moment = require('moment')


const app = express()
mongoose.connect('mongodb://localhost/fuelhistorydb', { useNewUrlParser: true })

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

var db = require("./models/percentages");

app.listen(process.env.PORT || 3000, _ => console.log('http://localhost:3000'))