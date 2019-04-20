import React from 'react'
import { connect } from 'react-redux'
import Styled from 'styled-components'
import ReactLoading from 'react-loading'
import { toast } from 'react-toastify'
import transition from 'styled-transition-group'

import SongListing from './SongListing'

import { downloadChart, openPreferences } from '../redux/actions'

const ChartListContainer = transition.div`
  &:enter {
    transform: translateX(-100vw);
  }
  &:enter-active {
    transform: translateX(0);
    transition: transform 300ms ease-in;
  }
  &:exit {
    transform: translateX(0);
  }
  &:exit-active {
    transform: translateX(100vw);
    transition: transform 300ms ease-in;
  }
  color: #DDDDDD;
`

const FetchingIndicator = Styled.div`
  width: 100%;
  height: calc(100vh - 50px);
  color: #EEEEEE;
  display: grid;
  place-items: center;
  font-size: 3em;
  position: absolute;
  z-index: -1;
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
  openPreferences,
  wasDownloaded,
  libraryPath,
  invalidSaveFormat
}) => {
  const _downloadChart = chart => {
    if (invalidSaveFormat) {
      toast.error(
        `You need to set a valid save format before you can download anything!`
      )
      openPreferences()
    }
    if (libraryPath.length <= 0) {
      toast.error(
        `Looks like you haven't set your library. You need to set one before you download anything.`,
      )
      openPreferences()
    }
    if (!invalidSaveFormat && libraryPath.length > 0) {
      downloadChart(chart)
    } 
  }
  return (
    <>
      <FetchingIndicator>
        <StyledLoader type="bars" width="50%" height="50%" />
      </FetchingIndicator>

      <ChartListContainer in={!isFetching} timeout={300} unmountOnExit>
        {charts.map(chart => (
          <SongListing
            key={chart.id}
            song={chart}
            isDownloading={currentlyDownloading.includes(chart.id)}
            wasDownloaded={
              chart.hashes && wasDownloaded.includes(chart.hashes.file)
            }
            onDownloadClick={() => _downloadChart(chart)}
          />
        ))}
      </ChartListContainer>
    </>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    downloadChart: chart => dispatch(downloadChart(chart)),
    openPreferences: () => dispatch(openPreferences()),
  }
}

const mapStateToProps = state => {
  return {
    isFetching: state.charts.isFetching,
    charts: state.charts.items,
    currentlyDownloading: state.downloads.currentlyDownloading,
    wasDownloaded: state.dlCache,
    libraryPath: state.preferences.library,
    invalidSaveFormat: state.preferences.invalidSaveFormat
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChartList)
