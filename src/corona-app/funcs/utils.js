
import * as d3 from 'd3'
const countryCodes = ['IT', 'ES', 'DE', 'NL', 'FR', 'US', 'IR', 'KR', 'CH', 'BE', 'AT', 'GB']
const countryNames = ['Italy', 'Spain', 'Germany', 'Netherlands', 'France', 'US', 'Iran', 'Korea, South', 'Switzerland', 'Belgium', 'Austria', 'United Kingdom']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const URL_ALL_COUNTRY = 'https://coronavirus-tracker-api.herokuapp.com/v2/locations?timelines=1'
const URL_ALL_COUNTRY_LOCAL = './bk-data/all-countries.json'
const URL_UK = 'https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=GB&&timelines=1'
const URL_UK_LOCAL = './bk-data/uk.json'
const URL_UK_ALL = 'https://pomber.github.io/covid19/timeseries.json'

const test1 = ['a', 'b', 'c', 'd', 'e', 'f']
const test2 = ['a']//, 'b']
export const fetchData = async () => {
  // return new Promise((resolve, reject) => {
  const data = await fetchingData(URL_UK_ALL)
  // const dataUK = await fetchingData(URL_UK)
  // data = [...data, ...dataUK]
  const newData = parseAll(data)
  return newData
}

// }
export const fetchingData = (url) => {
  return new Promise((resolve, reject) => {
    window.fetch(url)
      .then(response => {
        return response.json()
      })
      .then(data => {
        resolve((data))
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  })
}

export const compare = (data, startDay) => {
  const returnData = []
  for (let i = 0; i < data.length; i++) {
    const c = data[i]
    const t = c.timeline
    let percSum = 0

    let steps = 0
    for (let i = c.dataInit; i < c.dataEnd; i++) {
      // if (i > startDay) {
      const diff = t[i].confirmed - t[i - 1].confirmed
      // console.log('DIFF :', diff, ' : WAS : ', t[i - 1].confirmed, ' : IS : ', t[i].confirmed)
      const perc = (diff / t[i - 1].confirmed) * 100
      // console.log('PERC ', perc)
      if (!isNaN(perc) && isFinite(perc)) {
        percSum = percSum + perc

        steps++
      }
    }
    // }
    const totPerc = percSum / steps
    returnData.push({
      country: c.country,
      countryName: c.country,
      perc: totPerc,
      timeline: t,
      dataInit: c.dataInit,
      dataEnd: c.dataEnd
    })
  }
  returnData.sort((a, b) => (a.perc > b.perc) ? 1 : -1)

  const c0 = data[0]
  const endDay = c0.timeline.length - 1
  const startDate = new Date(c0.timeline[startDay].date)
  const endDate = new Date(c0.timeline[endDay].date)
  return {
    data: returnData,
    dateInit: c0.timeline[startDay].date,
    dateEnd: c0.timeline[endDay].date,
    dateInitLabel: monthNames[startDate.getMonth()] + ' ' + startDate.getDate(),
    dateEndLabel: monthNames[endDate.getMonth()] + ' ' + endDate.getDate()
  }
}
const parseAll = (data) => {
  const newData = []
  for (const c in data) {
    for (let i = 0; i < countryNames.length; i++) {
      if (countryNames[i] === c) {
        const countryInfo = { latest: {} }
        countryInfo.country = c
        countryInfo.id = Math.random()
        countryInfo.latest.confirmed = data[c][data[c].length - 1].confirmed
        countryInfo.latest.deaths = data[c][data[c].length - 1].deaths
        countryInfo.latest.recovered = data[c][data[c].length - 1].recovered
        countryInfo.timeline = data[c]
        newData.push(countryInfo)
        // countryInfo.minIndex = data[c].map((d, i) => {
        //   if (d.confirmed >= 100) {
        //     countryInfo.minIndex = i
        //   }
        // })
        for (let i = 0; i < data[c].length; i++) {
          const v = data[c][i].confirmed
          if (v >= 100) {
            countryInfo.minIndex = i
            break
          }
        }
      }
    }
  }
  return newData
}
const parseAllCountries = (data) => {
  const newData = []
  for (let i = 0; i < data.length; i++) {
    const country = data[i]
    for (let i = 0; i < countryCodes.length; i++) {
      const countryCode = countryCodes[i]

      if (country.country_code === countryCode) {
        newData.push(country)
      }
    }
  }
  var countryKeys = d3.nest()
    .key(function (d) { return d.country_code })
    .rollup(function (v) {
      const countryInfo = {
        country: '',
        countryCode: '',
        id: -1,
        last_updated: '',
        latest: {
          confirmed: 0,
          deaths: 0,
          recovered: 0
        },
        timelines: {
          confirmed: {
            timeline: []
          },
          deaths: {
            timeline: []
          },
          recovered: {
            timeline: []
          }
        }
      }
      for (let i = 0; i < v.length; i++) {
        const vObj = v[i]
        countryInfo.country = vObj.country
        countryInfo.country_code = vObj.country_code
        countryInfo.id = vObj.id
        countryInfo.last_updated = vObj.last_updated
        countryInfo.latest.confirmed += vObj.latest.confirmed
        countryInfo.latest.deaths += vObj.latest.deaths
        countryInfo.latest.recovered += vObj.latest.recovered

        const confirmedTimeline = Object.keys(vObj.timelines.confirmed.timeline)
        for (let i = 0; i < confirmedTimeline.length; i++) {
          if (countryInfo.timelines.confirmed.timeline[i]) {
            countryInfo.timelines.confirmed.timeline[i].value += vObj.timelines.confirmed.timeline[confirmedTimeline[i]]
          } else {
            countryInfo.timelines.confirmed.timeline.push({
              date: confirmedTimeline[i],
              value: vObj.timelines.confirmed.timeline[confirmedTimeline[i]]
            })
          }
        }

        const deathsTimeline = Object.keys(vObj.timelines.deaths.timeline)
        for (let i = 0; i < deathsTimeline.length; i++) {
          if (countryInfo.timelines.deaths.timeline[i]) {
            countryInfo.timelines.deaths.timeline[i].value += vObj.timelines.deaths.timeline[deathsTimeline[i]]
          } else {
            countryInfo.timelines.deaths.timeline.push({
              date: deathsTimeline[i],
              value: vObj.timelines.deaths.timeline[confirmedTimeline[i]]
            })
          }
        }

        const recoveredTimeline = Object.keys(vObj.timelines.recovered.timeline)
        for (let i = 0; i < recoveredTimeline.length; i++) {
          if (countryInfo.timelines.recovered.timeline[i]) {
            countryInfo.timelines.recovered.timeline[i].value += vObj.timelines.recovered.timeline[recoveredTimeline[i]]
          } else {
            countryInfo.timelines.recovered.timeline.push({
              date: recoveredTimeline[i],
              value: vObj.timelines.recovered.timeline[recoveredTimeline[i]]
            })
          }
        }
      }
      return countryInfo
    })
    .entries(newData)
  return countryKeys
}
const parseUK = (data) => {
  var countryKeys = d3.nest()
    .key(function (d) { return d.country_code })
    .rollup(function (v) {
      for (let i = 0; i < v.length; i++) {
        if (v[i].province === 'United Kingdom') {
          const timelines = {
            confirmed: {
              timeline: []
            },
            deaths: {
              timeline: []
            },
            recovered: {
              timeline: []
            }
          }
          // add here the timeline conversion

          const confirmedTimeline = Object.keys(v[i].timelines.confirmed.timeline)
          const vOjb = v[i]
          for (let i = 0; i < confirmedTimeline.length; i++) {
            if (timelines.confirmed.timeline[i]) {
              timelines.confirmed.timeline[i].value += vOjb.timelines.confirmed.timeline[confirmedTimeline[i]]
            } else {
              timelines.confirmed.timeline.push({
                date: confirmedTimeline[i],
                value: vOjb.timelines.confirmed.timeline[confirmedTimeline[i]]
              })
            }
          }
          vOjb.timelines = timelines
          return vOjb
        }
      }
    })
    .entries(data)

  return countryKeys
}
