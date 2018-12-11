const db = require('../models/percentages')
const axios = require('axios')
const cheerio = require('cheerio')
const moment = require('moment')


module.exports = app => {

  // Pull Data from Database based on Dates
  app.get('/percentages/:custom1-:custom2', (req, res) => {
    db.find({
      effective_date: { $gte: moment(req.params.custom1).format("YYYY-MM-DD"), $lte: moment(req.params.custom2).format('YYYY-MM-DD') },
      vendor_name: "FEDEX"
    })
      .then(r => res.json(r))
      .catch(e => console.log(e))
  })

  // Web Scrapping FedEx Fuel Percentage Data
  app.get('/updatefsc', (req, res) => {
    let data = []
    var recordsUpdateArr = []
    axios.get('https://www.fedex.com/en-us/shipping/fuel-surcharge.html')
      .then(r => {
        // Scrap all of the Data from FedEx Website
        const $ = cheerio.load(r.data)
        $('div.fxg-table-wrapper').children('table').children('tbody').children('tr').each((i, elem) => {
          data.push($(elem).children('td').text())
        })

        // Cleaning the Data
        data = (data[0].split('\n'))
        var start_date = moment(data[0].split('–')[0], "MMM Do YYYY").subtract(1, 'days')
        var end_date = moment(data[0].split('–')[1], "MMM Do YYYY")
        var day_diff = end_date.diff(start_date, 'days')
        
        let percentage_data = [
          {
            name: "EXPRESS",
            value: parseFloat(data[1]) / 100
          },
          {
            name: "GROUND",
            value: parseFloat(data[5]) / 100
          },
          {
            name: "INTL EXPORT",
            value: parseFloat(data[2]) / 100
          },
          {
            name: "INTL IMPORT",
            value: parseFloat(data[3]) / 100
          }
        ]

        // Uploads Data to Mongo db Fuelhistory DB
        for (let i = 0; i < day_diff; i++) {
          let effective_date = start_date.add(1, 'days').format("YYYY-MM-DD")
          for (let j = 0; j < percentage_data.length; j++) {

            // Checks if record is already in DB
            db.find({
              effective_date: effective_date,
              indicator: percentage_data[j].name,
              vendor_name: "FEDEX"
            })
              .then(r => {
                if (r.length === 0) {
                  recordsUpdateArr.push({
                    createdAt: moment().format("YYYY-MM-DD"),
                    updatedAt: moment().format("YYYY-MM-DD"),
                    vendor_name: "FEDEX",
                    effective_date: effective_date,
                    indicator: percentage_data[j].name,
                    percentage: percentage_data[j].value
                  })

                  db.create({
                    createdAt: moment().format("YYYY-MM-DD"),
                    updatedAt: moment().format("YYYY-MM-DD"),
                    vendor_name: "FEDEX",
                    effective_date: effective_date,
                    indicator: percentage_data[j].name,
                    percentage: percentage_data[j].value
                  })
                }
              })
          }
        }
        setTimeout(function () {
          res.json(recordsUpdateArr)
        }, 500)
      })
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

