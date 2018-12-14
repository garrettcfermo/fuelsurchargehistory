// Current Week
let startDate = moment().startOf('month').format("YYYYMMDD")
let endDate = moment().endOf('month').format("YYYYMMDD")

//Fetch the Fuel History Data from Database
function fuelhistoryData(startDate, endDate) {
  fetch(`/percentages/${startDate}-${endDate}`)
    .then(r => r.json())
    .then(r => {
      r.sort((a, b) => a.effective_date > b.effective_date ? 1 : -1)

      // Looping thru to put together Graph Data
      let dateArr = []
      let expressArr = []
      let expressKeyArr = []
      let groundArr = []
      let groundKeyArr = []
      let exportArr = []
      let exportKeyArr = []
      let importArr = []
      let importKeyArr = []

      r.forEach(elem => {
        if (dateArr.includes(elem.effective_date) === false) {
          dateArr.push(elem.effective_date)
        }

        switch (elem.indicator) {
          case 'EXPRESS':
            expressArr.push(Math.round((elem.percentage * 100) * 100) / 100)
            expressKeyArr.push(elem._id)
            break;
          case 'GROUND':
            groundArr.push(Math.round((elem.percentage * 100) * 100) / 100)
            groundKeyArr.push(elem._id)
            break;
          case 'INTL EXPORT':
            exportArr.push(Math.round((elem.percentage * 100) * 100) / 100)
            exportKeyArr.push(elem._id)
            break;
          case 'INTL IMPORT':
            importArr.push(Math.round((elem.percentage * 100) * 100) / 100)
            importKeyArr.push(elem._id)
            break
        }
      })

      Graph(dateArr, expressArr, groundArr, exportArr, importArr)

      tableCreation(dateArr, expressArr, expressKeyArr, groundArr, groundKeyArr, exportArr, exportKeyArr,
        importArr, importKeyArr)


    })
    .catch(e => console.log(e))
}

fuelhistoryData(startDate, endDate)

//Web Scrap FedEx Fuel Percentage
function updateFSC() {
  fetch(`/updatefsc`)
    .then(r => r.json())
    .then(r => {

      // Sort Data Newest to Oldest
      r.sort((a, b) => a.effective_date < b.effective_date ? 1 : -1)

      // Result Logic/Output
      if (r.length === 0) {

        let updateDate
        if (moment().format("dddd") === "Friday" && moment().format("HH:mm") >= "12:00") {
          updateDate = moment().day(12).format("dddd MM/DD/YYYY")
        } else {
          updateDate = moment().day(5).format("dddd MM/DD/YYYY")
        }

        document.querySelector('.resultInfo').innerHTML =
          `
            Everything is up-to-date! The next avialable update will be on <br><br>
            ${updateDate}, 12:00PM PST <br><br>
            For the Date Range: <br><br>
            ${moment().day(8).format("MM/DD/YYYY")} - ${moment().day(14).format("MM/DD/YYYY")}
             `
      } else {

        let expressCount = 0
        let groundCount = 0
        let exportCount = 0
        let importCount = 0
        r.forEach(elem => {
          switch (elem.indicator) {
            case 'EXPRESS':
              expressCount++
              break;
            case 'GROUND':
              groundCount++
              break;
            case 'INTL EXPORT':
              exportCount++
              break;
            case 'INTL IMPORT':
              importCount++
              break;
          }
        })

        document.querySelector('.resultInfo').innerHTML =
          `
            There were a total of ${r.length} records updated! Please see the update information below: <br><br>
            Date Range: ${moment(r[r.length - 1].effective_date).format("MM/DD/YYYY")} - ${moment(r[0].effective_date).format("MM/DD/YYYY")}<br><br>
            Express: ${expressCount} <br><br>
            Ground: ${groundCount} <br><br>
            Intl Export: ${exportCount} <br><br>
            Intl Import: ${importCount} <br><br>
            `
      }
      fuelhistoryData(startDate, endDate)
    })
    .catch(e => console.log(e))
}

// Cleans the Result Information 
function closeSync() {
  document.querySelector('.resultInfo').innerHTML = ''
}

// Custom Date Filter
function customDate() {
  let customStartDate = moment(document.querySelector('#customStartDate').value).format("YYYYMMDD")
  let customEndDate = moment(document.querySelector('#customEndDate').value).format("YYYYMMDD")
  if (customStartDate > customEndDate || customEndDate === "Invalid date" || customStartDate === "Invalid date") {
    document.querySelector('#invalidDate').innerHTML = `Invalid Date. Please select a correct date range.`
  } else {
    fuelhistoryData(customStartDate, customEndDate)
    document.querySelector('#invalidDate').innerHTML = ''
  }
}

// Graph Function
function Graph(dateArr, expressArr, groundArr, exportArr, importArr) {
  Chart.defaults.global.defaultFontColor = 'black'
  new Chart(document.getElementById("myChart"), {
    type: 'line',
    legendText: "cross",
    data: {
      labels: dateArr,
      datasets: [{
        data: expressArr,
        label: "Express",
        borderColor: "#86B281",
        backgroundColor: "#86b281",
        fill: false
      }, {
        data: groundArr,
        label: "Ground",
        borderColor: "#bc8d88",
        backgroundColor: "#bc8d88",
        fill: false
      }, {
        data: exportArr,
        label: "Intl Export",
        borderColor: "#9DB3D5",
        backgroundColor: "#9DB3D5",
        fill: false
      }, {
        data: importArr,
        label: "Intl Import",
        borderColor: "#637885",
        backgroundColor: "#637885",
        fill: false
      }]
    },
    options: {
      legend: {
        position: 'bottom',
        markerColor: "circle"
      },
      scales: {
        yAxes: [{
          ticks: {
            callback: function (tick) {
              return tick.toString() + '%';
            }
          }
        }]
      }
    }
  })
}
Graph()

// Table Creation Function
function tableCreation(dateArr, expressArr, expressKeyArr, groundArr, groundKeyArr, exportArr, exportKeyArr,
  importArr, importKeyArr) {

  document.querySelector('.tableInfo').innerHTML = ''

  for (let i = 0; i <= dateArr.length - 1; i++) {
    let listItem = document.createElement('tr')
    listItem.innerHTML =
      `
          <td id="effectiveDate_${i}"class="effectiveDate">${dateArr[i]}</td>
          <td id="express_${i}" value=${expressKeyArr[i]}>${expressArr[i]}%</td>
          <td id="ground_${i}" value=${groundKeyArr[i]}>${groundArr[i]}%</td>
          <td id="export_${i}" value=${exportKeyArr[i]}>${exportArr[i]}%</td>
          <td id="import_${i}" value=${importKeyArr[i]}>${importArr[i]}%</td>
          <td class="edit"> <a value=${i} id="editBtn" class=" waves-effect waves-light btn red lighten-2 modal-trigger" href="#modal2"><i
          value=${i} id="editBtn"  class="material-icons">edit</i></a>
          </td>
        `
    document.querySelector('.tableInfo').appendChild(listItem)
  }
}

// Add a Percentage
function addPercentage() {
  event.preventDefault()
  let newEffectiveDate = document.querySelector("#newEffectiveDate").value
  let newExpressVal = document.querySelector('#newExpress').value
  let newGroundVal = document.querySelector('#newGround').value
  let newExportVal = document.querySelector('#newExport').value
  let newImportVal = document.querySelector('#newImport').value

  console.log(newEffectiveDate)

  if (newEffectiveDate !== "") {
    addOnePercentageDB(newEffectiveDate, "EXPRESS", newExpressVal)
    addOnePercentageDB(newEffectiveDate, "GROUND", newGroundVal)
    addOnePercentageDB(newEffectiveDate, "INTL EXPORT", newExportVal)
    addOnePercentageDB(newEffectiveDate, "INTL IMPORT", newImportVal)
    fuelhistoryData(startDate, endDate)
    document.querySelector('#newInvalidDate').innerHTML = ``
    document.querySelector("#newEffectiveDate").value = ''
    document.querySelector('#newExpress').value = ''
    document.querySelector('#newGround').value = ''
    document.querySelector('#newExport').value = ''
    document.querySelector('#newImport').value = ''
  } else {
    document.querySelector('#newInvalidDate').innerHTML = `Invalid Date. Please select a correct date range.`
  }
}

// Add one percentage to Database
function addOnePercentageDB(effectiveDate, indicator, percentage) {
  fetch('/percentages', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      createdAt: moment().format("YYYY-MM-DD"),
      updatedAt: moment().format("YYYY-MM-DD"),
      vendor_name: "FEDEX",
      effective_date: effectiveDate,
      indicator: indicator,
      percentage: percentage
    })
  }).catch(e => console.log(e))
}

// Edit Button Logic
document.addEventListener('click', e => {
  if (e.target && e.target.id === "editBtn") {
    let editEffectiveDate = document.querySelector(`#effectiveDate_${e.target.getAttribute('value')}`).innerHTML

    let editExpressVal = parseFloat(document.querySelector(`#express_${e.target.getAttribute('value')}`).innerHTML
      .split('%')) / 100
    let editExpressKey = document.querySelector(`#express_${e.target.getAttribute('value')}`).getAttribute(
      'value')

    let editGroundVal = parseFloat(document.querySelector(`#ground_${e.target.getAttribute('value')}`).innerHTML
      .split('%')) / 100
    let editGroundKey = document.querySelector(`#ground_${e.target.getAttribute('value')}`).getAttribute(
      'value')

    let editExportVal = parseFloat(document.querySelector(`#export_${e.target.getAttribute('value')}`).innerHTML
      .split('%')) / 100
    let editExportKey = document.querySelector(`#export_${e.target.getAttribute('value')}`).getAttribute(
      'value')

    let editImportVal = parseFloat(document.querySelector(`#import_${e.target.getAttribute('value')}`).innerHTML
      .split("%")) / 100
    let editImportKey = document.querySelector(`#import_${e.target.getAttribute('value')}`).getAttribute(
      'value')

    document.querySelector('#editInfo').innerHTML =
      `
          <h4>Edit</h4>
          <p style="margin-bottom: 20px;">Please edit the informaton below:</p>
          <p id="editEffectiveDate" style="margin-bottom: 20px;">Effective Date : ${editEffectiveDate}</p>

          <div class="row">
            <form class="col s12">
              <div class="row">
                <div class="input-field col s6">
                  <p>Express</p>
                  <input value=${editExpressVal} data-key=${editExpressKey} id="editExpress" type="text" class="validate">
                </div>
                <div class="input-field col s6">
                  <p>Ground</p>
                  <input value=${editGroundVal} data-key=${editGroundKey} id="editGround" type="text" class="validate">
                </div>
              </div>
              <div class="row">
                <div class="input-field col s6">
                  <p>International Export</p>
                  <input value=${editExportVal} data-key=${editExportKey} id="editExport" type="text" class="validate">
                </div>
                <div class="input-field col s6">
                  <p>International Import</p>
                  <input value=${editImportVal} data-key=${editImportKey} id="editImport" type="text" class="validate">
                </div>
              </div>
            </form>
          </div>
        <div class="center">
          <a href="#!" onClick="saveBTN()"class="modal-close waves-effect waves-green btn green darken-2">Update</a>
          <a href="#!" onClick="deleteBTN()" class="modal-close waves-effect waves-brown btn deep-orange darken-4">Delete</a>
          <a href="#!" class="modal-close waves-effect waves-gray btn blue-grey">Close</a>
        </div>
        `
  }
})

// Update (Save) Btn Logic
function saveBTN() {
  let editExpressVal = document.querySelector("#editExpress").value
  let editExpressKey = document.querySelector("#editExpress").getAttribute('data-key')
  fscUpdate(editExpressKey, editExpressVal)

  let editGroundVal = document.querySelector("#editGround").value
  let editGroundKey = document.querySelector("#editGround").getAttribute('data-key')
  fscUpdate(editGroundKey, editGroundVal)

  let editExportVal = document.querySelector("#editExport").value
  let editExportKey = document.querySelector("#editExport").getAttribute('data-key')
  fscUpdate(editExportKey, editExportVal)

  let editImportVal = document.querySelector("#editImport").value
  let editImportKey = document.querySelector("#editImport").getAttribute('data-key')
  fscUpdate(editImportKey, editImportVal)
}

// Update One Entry to Database
function fscUpdate(id, updatedPercentage) {
  fetch(`/percentage/${id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      percentage: updatedPercentage
    })
  }).then(r => fuelhistoryData(startDate, endDate)).catch(e => console.log(e))
}

// Delete Btn Logic
function deleteBTN() {
  let editExpressKey = document.querySelector("#editExpress").getAttribute('data-key')
  let editGroundKey = document.querySelector("#editGround").getAttribute('data-key')
  let editExportKey = document.querySelector("#editExport").getAttribute('data-key')
  let editImportKey = document.querySelector("#editImport").getAttribute('data-key')
  fscDelete(editExpressKey)
  fscDelete(editGroundKey)
  fscDelete(editExportKey)
  fscDelete(editImportKey)
  fuelhistoryData(startDate, endDate)
}

// Delete a percentage from Database
function fscDelete(id) {
  fetch(`/percentage/${id}`, {
    method: 'DELETE'
  }).catch(e => console.log(e))
}

// Materialize Code to make Modals Work
$(document).ready(function () {
  $('select').material_select();
});
$(document).ready(function () {
  $('.modal').modal()
})