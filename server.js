const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')

const app = express()
mongoose.connect('mongodb://localhost/fuelhistorydb', { useNewUrlParser: true })

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())


require('./routes/percentages')(app)

app.listen(process.env.PORT || 3000, _ => console.log('http://localhost:3000'))