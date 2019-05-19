import React from 'react'
import { connect } from 'react-redux'
import ReactLoading from 'react-loading'
import Styled from 'styled-components'

import SongInfo from '../components/SongInfo'
import { downloadChart } from '../redux/slices/downloadManager'

const StyledLoading = Styled(ReactLoading)`
  position: absolute;
  background-color: rgba(0, 0, 0, .5);
  border-radius: 8px;
`

const secondsToMinuteSecond = seconds =>
  `${Math.floor(seconds / 60)}:${
    seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60
  }`

const SongList = ({
  chartIds,
  charts,
  dlCache,
  currentlyDownloading,
  downloadChart,
}) => {
  const _downloadChart = chart => {
    downloadChart(chart)
  }
  return (
    <>
      {chartIds.map(id => {
        const chart = charts[id]
        const chartCached = dlCache.includes(chart.hashes.file)
        const chartDownloading = currentlyDownloading.includes(chart.id)
        let albumArt = null
        if (chart.directLinks['album.png'] || chart.directLinks['album.jpg']) {
          albumArt =
            chart.directLinks['album.png'] || chart.directLinks['album.jpg']
        }

        let Overlay = null
        if (chartCached) {
          Overlay = <SongInfo.ArtOverlay show>✓</SongInfo.ArtOverlay>
        } else if (chartDownloading) {
          Overlay = (
            <SongInfo.ArtOverlay show>
              <StyledLoading type="bars" height="100%" width="100%" />
            </SongInfo.ArtOverlay>
          )
        } else {
          Overlay = Overlay = (
            <SongInfo.ArtOverlay onClick={() => _downloadChart(chart)}>
              DL
            </SongInfo.ArtOverlay>
          )
        }
        return (
          <SongInfo key={id}>
            <SongInfo.AlbumArt albumArt={albumArt}>
              {!albumArt && 'NO ART'}
              {Overlay}
            </SongInfo.AlbumArt>
            <SongInfo.InfoWrapper>
              <SongInfo.Info size="2em">
                {chart.name}{' '}
                <SongInfo.Info size=".4em">
                  {secondsToMinuteSecond(chart.length)}
                </SongInfo.Info>
              </SongInfo.Info>
              <SongInfo.Info>{chart.artist}</SongInfo.Info>
              <SongInfo.Info size=".75em">
                {chart.album} {chart.year && `(${chart.year})`}
              </SongInfo.Info>
              <SongInfo.Info size=".75em">{chart.genre}</SongInfo.Info>
              <SongInfo.Info size=".75em">
                {chart.sources[0].name}
              </SongInfo.Info>
            </SongInfo.InfoWrapper>
            <SongInfo.DifficultyWrapper>
              <SongInfo.Difficulty
                name="Guitar"
                tier={chart.tier_guitar}
                diff={chart.diff_guitar}
              />
              <SongInfo.Difficulty
                name="Bass"
                tier={chart.tier_bass}
                diff={chart.diff_bass}
              />
              <SongInfo.Difficulty
                name="Drums"
                tier={chart.tier_drums}
                diff={chart.diff_drums}
              />
            </SongInfo.DifficultyWrapper>
          </SongInfo>
        )
      })}
    </>
  )
}

const mapStateToProps = state => ({
  chartIds: state.chorus.ids,
  charts: state.chorus.byId,
  dlCache: state.downloadManager.dlCache,
  currentlyDownloading: state.downloadManager.currentlyDownloading,
})

const actionCreators = {
  downloadChart: downloadChart,
}

export default connect(
  mapStateToProps,
  actionCreators,
)(SongList)
