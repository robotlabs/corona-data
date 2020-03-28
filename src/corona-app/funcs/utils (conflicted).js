
import * as d3 from 'd3'
const countryCodes = ['IT', 'ES', 'DE', 'NL', 'FR', 'US', 'IR', 'KR', 'CH', 'BE', 'AT']

const URL_ALL_COUNTRY = 'https://coronavirus-tracker-api.herokuapp.com/v2/locations?timelines=1'
const URL_ALL_COUNTRY_LOCAL = './bk-data/all-countries.json'
const URL_UK = 'https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=GB&&timelines=1'
const URL_UK_LOCAL = './bk-data/uk.json'

const test1 = ['a', 'b', 'c', 'd', 'e', 'f']
const test2 = ['a']//, 'b']
export const fetchData = async () => {
  // return new Promise((resolve, reject) => {
  let data = await fetchingData(URL_ALL_COUNTRY, parseAllCountries)
  const dataUK = await fetchingData(URL_UK, parseUK)
  data = [...data, ...dataUK]
  return data
}

// }
export const fetchingData = (url, parse) => {
  return new Promise((resolve, reject) => {
    window.fetch(url)
      .then(response => response.json())
      .then(data => {
        resolve(parse(data.locations))
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  })
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
            timeline: {}
          },
          deaths: {
            timeline: {}
          },
          recovered: {
            timeline: {}
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

        for (const mc in vObj.timelines.confirmed.timeline) {
          if (!countryInfo.timelines.confirmed.timeline[mc]) {
            countryInfo.timelines.confirmed.timeline[mc] = vObj.timelines.confirmed.timeline[mc]
          } else {
            countryInfo.timelines.confirmed.timeline[mc] += vObj.timelines.confirmed.timeline[mc]
          }
        }
        let t
        t = Object.keys(countryInfo.timelines.confirmed.timeline).map((d) => {
          return {
            date: d,
            value: countryInfo.timelines.confirmed.timeline[d]
          }
        })
        countryInfo.timelines.confirmed.timeline = t

        for (const mc in vObj.timelines.deaths.timeline) {
          if (!countryInfo.timelines.deaths.timeline[mc]) {
            countryInfo.timelines.deaths.timeline[mc] = vObj.timelines.deaths.timeline[mc]
          } else {
            countryInfo.timelines.deaths.timeline[mc] += vObj.timelines.deaths.timeline[mc]
          }
        }
        t = Object.keys(countryInfo.timelines.deaths.timeline).map((d) => {
          return {
            date: d,
            value: countryInfo.timelines.deaths.timeline[d]
          }
        })
        countryInfo.timelines.deaths.timeline = t

        for (const mc in vObj.timelines.recovered.timeline) {
          if (!countryInfo.timelines.recovered.timeline[mc]) {
            countryInfo.timelines.recovered.timeline[mc] = vObj.timelines.recovered.timeline[mc]
          } else {
            countryInfo.timelines.recovered.timeline[mc] += vObj.timelines.recovered.timeline[mc]
          }
        }
        t = Object.keys(countryInfo.timelines.recovered.timeline).map((d) => {
          return {
            date: d,
            value: countryInfo.timelines.recovered.timeline[d]
          }
        })
        countryInfo.timelines.recovered.timeline = t
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
          return v[i]
        }
      }
    })
    .entries(data)
  return countryKeys
}
