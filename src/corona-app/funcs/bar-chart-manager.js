import * as d3 from 'd3'
import { sliderHorizontal, sliderBottom } from 'd3-simple-slider'
let tempDateTime
export const barchartManager = (data, g, updateDataTime) => {
  const easeCubic = d3.easeCubic
  const w = window.innerWidth - 40

  const x = d3.scaleLinear()
    .range([0, w / 2])
    // .domain([0, d3.max(data, (d) => {
    //   return Number(d.perc)
    // })])
    .domain([0, 30])
  const y = d3.scaleBand()
    .rangeRound([0, 400])
    .padding(0.1)
    .domain(data.map((d) => {
      return d.country
    }))

  // var colorScale = d3.scaleSequential(d3.interpolateRainbow)
  //   .domain([0, data.length])
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
    .domain([0, data.length])

  //* * set bars datum
  var bars = g.selectAll('rect')
    .data(data, function (d) {
      return d.country
    })

  //* * REMOVE
  bars.exit()
    .remove()

  //* * ENTER + MERGE
  bars
    .enter().append('rect')
    .attr('class', 'bar')
    // init
    .attr('x', (d) => {
      return 0
    })
    .attr('y', (d) => {
      return y(d.country)
    })
    .attr('height', y.bandwidth())
    // merge
    .merge(bars)
    // animation
    .transition()
    .ease(easeCubic)
    .duration(1000)
    // animate in
    .attr('fill', (d, i) => {
      return colorScale(i)
    })
    .attr('x', (d) => {
      return 0
    })
    .attr('y', (d) => {
      return y(d.country) * 2 + 5
    })
    .attr('width', (d) => {
      return x(d.perc)
    })
    .attr('height', y.bandwidth() / 2)

  //* * set bars datum
  var texts = g.selectAll('.text1')
    .data(data, function (d) {
      return d.country
    })
    // .attr('dx', function (d) { return 0 })

  //* * REMOVE
  texts.exit()
    .remove()
  //* * ENTER + MERGE
  texts
    .enter().append('text')
    .attr('class', 'text1')
    // init
    // .attr('dx', (d) => {
    //   return 0
    // })
    .attr('dy', (d) => {
      return (y(d.country) + 10) * 2
    })
    .attr('dx', (d) => {
      return 1000// x(d.perc)
    })

    // merge
    .merge(texts)
    // .attr('dy', (d) => {
    //   return y(d.country) + 23
    // })
    // .attr('dx', (d) => {
    //   return x(d.perc)
    // })

    .text((d) => {
      return d.countryName + ' : ' + Math.floor(d.perc) + '%'
    })
    .transition()
    .ease(easeCubic)
    .duration(1000)
    .attr('dy', (d) => {
      return (y(d.country) + 11) * 2
    })
    .attr('dx', (d) => {
      return x(d.perc) + 5
    })

  var dataTime = []
  for (let i = 0; i < data[0].timeline.length; i++) { // data[0].timeline.length; i++) {
    dataTime.push(new Date(data[0].timeline[i].date.replace(/-/g, '/')))
  }
  tempDateTime = dataTime

  // * * set bars datum
  var inputsliders = g.selectAll('.sliders')
    .data(data, function (d) {
      return d.countryName
    })
  //* * REMOVE
  inputsliders.exit()
    .remove()
  //* * ENTER + MERGE
  inputsliders
    .enter()
    .append('svg')
    .attr('class', 'svg-test')
    .attr('width', 1100)
    .attr('height', 200)
    .attr('class', 'sliders')
    .append('g')
    .attr('transform', 'translate(30,10)')
    .each(function (d, i) {
      d3.select(this).call(ttt(d, colorScale(i), updateDataTime))
    })
    .attr('y', (d) => {
      return (y(d.country) + 21) * 2
    })
    .attr('x', (d) => {
      return 100// x(d.perc)
    })

  // merge
    .merge(inputsliders)
    .transition()
    .ease(easeCubic)
    .duration(1000)
    .attr('y', (d) => {
      return (y(d.country) + 12) * 2
    })
    .attr('x', (d) => {
      return -10
    })

  // //* * set bars datum
  // var inputs = g.selectAll('.text2')
  //   .data(data, function (d) {
  //     return d.countryName
  //   })
  // //* * REMOVE
  // inputs.exit()
  //   .remove()
  // //* * ENTER + MERGE
  // inputs
  //   .enter().append('text')
  //   .attr('class', 'text2')
  //   .attr('dy', (d) => {
  //     return (y(d.country) + 31) * 2
  //   })
  //   .attr('dx', (d) => {
  //     return x(d.perc) + 200
  //   })
  // // merge
  //   .merge(inputs)
  //   .text((d) => {
  //     return ': xxxx ----'
  //   })
  //   .transition()
  //   .ease(easeCubic)
  //   .duration(1000)
  //   .attr('dy', (d) => {
  //     return (y(d.country) + 11) * 2
  //   })
  //   .attr('dx', (d) => {
  //     return 0
  //   })
}

function ttt (d, c, updateDataTime) {
  // var datax = [0, 0.005, 0.01, 0.015, 0.02, 0.025]
  // return sliderBottom()
  //   .min(d3.min(datax))
  //   .max(d3.max(datax))
  //   .width(300)
  //   .tickFormat(d3.format('.2%'))
  //   .ticks(5)
  //   .default(0.015)
  //   .on('onchange', val => {
  //     d3.select('p#value-simple').text(d3.format('.2%')(val))
  //   })
  return sliderBottom()
    .min(tempDateTime[0])
    .max(tempDateTime[tempDateTime.length - 1])
    // .step(1000 * 60 * 60 * 24)// * 365)
    .step(1)
    .width(1000)

    .tickFormat(d3.timeFormat('%m-%d'))
    .ticks(5)
    .tickValues(tempDateTime)

    .default([tempDateTime[d.dataInit], tempDateTime[d.dataEnd]])
    .fill((d, i) => {
      return c
    })
    .handle(
      d3.symbol()
        .type(d3.symbolCircle)
        .size(300)
    )
    .on('onchange', (val, w) => {
      d3.select('p#value-time').text(d.country + ' : ' + (val.map(d3.timeFormat('%B %d')).join('-')))
    })
    .on('end', (val, w) => {
      let dateInit = -1
      let dateEnd = -1
      for (let i = 0; i < tempDateTime.length; i++) {
        const dd = tempDateTime[i]
        if (isSameDate(dd, new Date(val[0]))) {
          dateInit = i
        }
        if (isSameDate(dd, new Date(val[1]))) {
          dateEnd = i
        }
      }

      updateDataTime({
        countryInfo: d,
        dateInit,
        dateEnd
      })
    })
}

function isSameDate (dateA, dateB) {
  if (
    (dateA.getFullYear() === dateB.getFullYear()) &&
    (dateA.getMonth() === dateB.getMonth()) &&
    (dateA.getDate() === dateB.getDate())
  ) {
    return true
  }
  return false
}
