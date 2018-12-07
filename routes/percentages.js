const db = require('../models/percentages')
const axios = require('axios')
const cheerio = require('cheerio')
const moment = require('moment')


module.exports = app => {
  app.get('/percentages', (req, res) => {
    db.find({
      effective_date: {$gte: '2018-12-10'},
      indicator:"EXPRESS",
      vendor_name:"FEDEX"
    })
      .then(r => res.json(r))
      .catch(e => console.log(e))
  })

  // app.get('/surfboards/:id', (req, res) => {
  //   db.surfboards.findOne({ where: { id: req.params.id } })
  //     .then(r => res.json(r))
  //     .catch(e => console.log(e))
  // })

  // app.post('/surfboards', (req, res) => {
  //   db.surfboards.create(req.body)
  //     .then(() => res.sendStatus(200))
  //     .catch(e => console.log(e))
  // })

  // app.put('/surfboards/:id', (req, res) => {
  //   db.surfboards.update(req.body, { where: { id: req.params.id } })
  //     .then(() => res.sendStatus(200))
  //     .catch(e => console.log(e))
  // })

  // app.delete('/surfboards/:id', (req, res) => {
  //   db.surfboards.destroy({ where: { id: req.params.id } })
  //     .then(() => res.sendStatus(200))
  //     .catch(e => console.log(e))
  // })

  // app.delete('/surfboards', (req, res) => {
  //   db.surfboards.destroy({ where: {}, truncate: true })
  //     .then(() => res.sendStatus(200))
  //     .catch(e => console.log(e))
  // })
}