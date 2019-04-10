import React from 'react'
import { connect } from 'react-redux'
import Styled from 'styled-components'

import SongListing from './SongListing'

import { downloadChart } from '../redux/actions'

const ChartListContainer = Styled.div`
  color: #DDDDDD;
`

const ChartList = ({ isFetching, charts, currentlyDownloading, downloadChart, wasDownloaded }) => {
  if (isFetching) {
    return <div style={{ color: '#EEEEEE' }}>Getting Songs...</div>
  }
  return (
    <ChartListContainer>
      {charts.map(chart => (
        <SongListing
          key={chart.id}
          song={chart}
          isDownloading={currentlyDownloading.includes(chart.id)}
          wasDownloaded={wasDownloaded.includes(chart.id)}
          onDownloadClick={() => downloadChart(chart)}
        />
      ))}
    </ChartListContainer>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    downloadChart: directLinks => dispatch(downloadChart(directLinks)),
  }
}

const mapStateToProps = state => {
  return {
    isFetching: state.charts.isFetching,
    charts: state.charts.items,
    currentlyDownloading: state.downloads.currentlyDownloading,
    wasDownloaded: state.downloads.wasDownloaded
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartList)
