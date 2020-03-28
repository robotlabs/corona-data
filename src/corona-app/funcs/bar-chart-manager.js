import * as d3 from 'd3'
import { sliderHorizontal, sliderBottom } from 'd3-simple-slider'
let tempDateTime
export const barchartManager = (data, g, updateDataTime) => {
  const easeCubic = d3.easeCubic
  const w = window.innerWidth - 40

  const x = d3.scaleLinear()
    .range([0, w])
    // .domain([0, d3.max(data, (d) => {
    //   return Number(d.perc)
    // })])
    .domain([0, 50])
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
      return y(d.country) * 2
    })
    .attr('width', (d) => {
      return x(d.perc)
    })
    .attr('height', y.bandwidth())

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
  for (let i = 0; i < 14; i++) { // data[0].timeline.length; i++) {
    dataTime.push(new Date(data[0].timeline[i].date))
  }
  tempDateTime = dataTime

  // * * set bars datum
  var inputsliders = g.selectAll('.sliderxxx')
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
    .attr('width', 500)
    .attr('height', 100)
    .attr('class', 'sliderxxx')
    .append('g')
    .attr('transform', 'translate(30,0)')
    .each(function (d, i) {
      d3.select(this).call(ttt(d, colorScale(i)), updateDataTime)
    })
    .attr('y', (d) => {
      console.log('d', d)
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
      return (y(d.country) + 21) * 2
    })
    .attr('x', (d) => {
      return 0
    })

  //* * set bars datum
  var inputs = g.selectAll('.text2')
    .data(data, function (d) {
      return d.countryName
    })
  //* * REMOVE
  inputs.exit()
    .remove()
  //* * ENTER + MERGE
  inputs
    .enter().append('text')
    .attr('class', 'text2')
    .attr('dy', (d) => {
      return (y(d.country) + 31) * 2
    })
    .attr('dx', (d) => {
      return 100// x(d.perc)
    })
  // merge
    .merge(inputs)
    .text((d) => {
      return d.countryName
    })
    .transition()
    .ease(easeCubic)
    .duration(1000)
    .attr('dy', (d) => {
      return (y(d.country) + 31) * 2
    })
    .attr('dx', (d) => {
      return 0
    })
}

function ttt (d, c, updateDataTime) {
  return sliderBottom()
    .min(d3.min(tempDateTime))
    .max(tempDateTime[13])
  // .step(1000 * 60 * 60 * 24)// * 365)
    .step(1)
    .width(300)
    .tickFormat(d3.timeFormat('%m-%d'))
    .tickValues(tempDateTime)
    .default(new Date(2020, 3, 3))

    .default([tempDateTime[3], tempDateTime[7]])
    .fill((d, i) => {
      return c
    })
    .on('onchange', (val, w) => {
      console.log('val ', val, this)
      console.log('d ', d)
      d3.select('p#value-time').text((val.map(d3.timeFormat('%B %d, %Y')).join('-')))
    })
    .on('end', (val, w) => {
      console.log('val ', val, this)
      console.log('d ', d)
      updateDataTime(d)
    })
}
