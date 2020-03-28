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
    // const dataUk = await fetchData(URL_UK)

    iter = 44
    const compareData = compare(data, iter)
    // console.log('DATA-UK', dataUk)

    const d3El = d3.select(this.node.current)
    const svg = d3El.append('svg')
    const g = svg
      .attr('width', '100%')
      .attr('height', window.innerHeight + 'px')
      .append('g')

    this.g = g

    barchartManager(compareData.data, this.g)
    this.setState({
      dataInit: compareData.dataInit,
      dataInitLabel: compareData.dataInitLabel
    })

    setInterval(() => {
      const l = data[0].timeline.length
      if (iter < l - 2) {
        iter++
        const compareData = compare(data, iter)
        barchartManager(compareData.data, this.g)
        this.setState({
          dateInitLabel: compareData.dateInitLabel,
          dateEndLabel: compareData.dateEndLabel
        })
        console.log('compareData.dataInit', compareData.dateInit)
      }
    }, 20000000)

    // setTimeout(() => {
    //   const l = data[0].timeline.length
    //   if (iter < l - 2) {
    //     iter++
    //     const compareData = compare(data, iter)
    //     barchartManager(compareData.data, this.g)
    //     this.setState({
    //       dateInitLabel: compareData.dateInitLabel,
    //       dateEndLabel: compareData.dateEndLabel
    //     })
    //     console.log('compareData.dataInit', compareData.dateInit)
    //   }
    // }, 1000)
  }

  render () {
    const { dateEndLabel, dateInitLabel } = this.state
    return (
      <div>
        <div
          className='box'
          ref={this.node}
        />
        <div className='date'>
          <div>init: {dateInitLabel}</div>
          <div>end: {dateEndLabel}</div>
        </div>
        {/* <div className='sliderx' id='slider' />
        <div className='sliderx' id='slider-range' /> */}
        <div class='row align-items-center sliderx'>
          <div class='col-sm-2'><p id='value-range' /></div>
          <div class='col-sm'><div id='slider-range' /></div>
        </div>
        {/* <div className='slidecontainer'>
          <input type='range' min='1' max='100' value='50' className='slider' id='myRange' />
        </div> */}
      </div>
    )
  }
}
export default Dashboard
