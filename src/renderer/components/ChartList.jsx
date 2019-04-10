import React from 'react'
import { connect } from 'react-redux'
import Styled from 'styled-components'
import ReactLoading from 'react-loading'

import SongListing from './SongListing'

import { downloadChart } from '../redux/actions'

const ChartListContainer = Styled.div`
  color: #DDDDDD;
`

const FetchingIndicator = Styled.div`
  width: 100%;
  height: calc(100vh - 50px);
  color: #EEEEEE;
  display: grid;
  place-items: center;
  font-size: 3em;
`

const StyledLoader = Styled(ReactLoading)`
  display: grid;
  place-items: center;
`

const ChartList = ({
  isFetching,
  charts,
  currentlyDownloading,
  downloadChart,
  wasDownloaded,
}) => {
  if (isFetching) {
    return (
      <FetchingIndicator style={{ color: '#EEEEEE' }}>
        <StyledLoader type="bars" width="50%" height="50%"/>
      </FetchingIndicator>
    )
  }
  return (
    <ChartListContainer>
      {charts.map(chart => (
        <SongListing
          key={chart.id}
          song={chart}
          isDownloading={currentlyDownloading.includes(chart.id)}
          wasDownloaded={
            chart.hashes && wasDownloaded.includes(chart.hashes.file)
          }
          onDownloadClick={() => downloadChart(chart)}
        />
      ))}
    </ChartListContainer>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    downloadChart: chart => dispatch(downloadChart(chart)),
  }
}

const mapStateToProps = state => {
  return {
    isFetching: state.charts.isFetching,
    charts: state.charts.items,
    currentlyDownloading: state.downloads.currentlyDownloading,
    wasDownloaded: state.ui.wasDownloaded,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartList)
