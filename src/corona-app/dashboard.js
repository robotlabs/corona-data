import React, { Component } from 'react'
import { fetchData, compare } from './funcs/utils'
import { barchartManager } from './funcs/bar-chart-manager'
import * as d3 from 'd3'
import './dashboard-style.scss'

let iter
class Dashboard extends Component {
  state = {
    dateInit: '',
    dateInitLabel: ''
  }

  constructor (props) {
    super(props)

    this.node = React.createRef()
  }

  async componentDidMount () {
    const data = await fetchData()
    for (let i = 0; i < data.length; i++) {
      const c = data[i]
      const newTimeline = []
      for (let i = 0; i < c.timeline.length; i++) {
        if (i >= 36) {
          newTimeline.push(c.timeline[i])
        }
      }
      c.timeline = newTimeline

      c.dataInit = c.timeline.length - 5
      c.dataEnd = c.timeline.length - 1// new Date(c.timeline[c.timeline.length - 1].date)
    }
    iter = 44
    const compareData = compare(data, iter)

    const d3El = d3.select(this.node.current)
    const svg = d3El.append('svg')
    const g = svg
      .attr('width', '100%')
      .attr('height', window.innerHeight + 'px')
      .append('g')

    this.g = g

    barchartManager(compareData.data, this.g, this.updateDataTime)
    this.setState({
      dataInit: compareData.dataInit,
      dataInitLabel: compareData.dataInitLabel
    })

    // setInterval(() => {
    //   const l = data[0].timeline.length
    //   if (iter < l - 2) {
    //     iter++
    //     const compareData = compare(data, iter)
    //     barchartManager(compareData.data, this.g)
    //     this.setState({
    //       dateInitLabel: compareData.dateInitLabel,
    //       dateEndLabel: compareData.dateEndLabel
    //     })
    //   }
    // }, 2000)

    setTimeout(() => {
      const l = data[0].timeline.length
      const compareData = compare(data, iter)
      barchartManager(compareData.data, this.g, this.updateDataTime)
      this.setState({
        dateInitLabel: compareData.dateInitLabel,
        dateEndLabel: compareData.dateEndLabel
      })
    }, 1000)

    this.data = data
  }

  updateDataTime = (dataTime) => {
    for (let i = 0; i < this.data.length; i++) {
      const c = this.data[i]
      if (c.country === dataTime.countryInfo.country) {
        this.data[i].dataInit = dataTime.dateInit
        this.data[i].dataEnd = dataTime.dateEnd
      }
    }

    const compareData = compare(this.data, 0)
    console.log('+++ ', compareData)
    barchartManager(compareData.data, this.g, this.updateDataTime)
  }

  render () {
    const { dateEndLabel, dateInitLabel } = this.state
    return (
      <div>
        <div
          className='box'
          ref={this.node}
        />
        {/* <div className='date'>
          <div>init: {dateInitLabel}</div>
          <div>end: {dateEndLabel}</div>
        </div> */}
        <div className='sliderx' id='slider' />
        <div className='sliderx' id='slider-range' />
        <div className='row align-items-center sliderx'>
          <div className='col-sm-2'><p id='value-time' /></div>
          <div className='col-sm'><div id='slider-time' /></div>
        </div>

        <div className='row align-items-center sliderx2'>
          <div className='col-sm-2'><p id='value-range' /></div>
          <div className='col-sm'><div id='slider-range' /></div>
        </div>
        {/* <div className='slidecontainer'>
          <input type='range' min='1' max='100' value='50' className='slider' id='myRange' />
        </div> */}
      </div>
    )
  }
}
export default Dashboard
