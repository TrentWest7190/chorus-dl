import React, { useState } from 'react'
import Styled, { css } from 'styled-components'
import ReactLoading from 'react-loading'

const DifficultyCircle = Styled.div`
  height: 11px;
  width: 11px;
  border-radius: 50%;
  border: 2px solid #EEEEEE;
  background-color: ${p => (p.filled ? 'red' : 'rgba(0,0,0,0)')};
  margin-right: 4px;
`

const disabledCss = css`
  opacity: 0.5;
  text-decoration: line-through;
`

const DiffLevel = Styled.span`
  color: ${p => (p.included ? 'lightgreen' : 'rgba(255, 100, 100, .8)')};
  font-weight: ${p => (p.included ? 'bold' : 'normal')};
`

const Name = Styled.span`
  font-size: 2em;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 600px;
`

const Artist = Styled.span`
  font-size: 1em;
`

const AlbumGenre = Styled.span`
  font-size: .75em;
  color: #AAAAAA;
`

const Difficulty = Styled(({ className, diff, tier, name }) => {
  return (
    <div className={className}>
      <div>
        <span>{name}</span>
        <span className="diff-levels">
          <DiffLevel included={diff & 1}>E</DiffLevel>
          <DiffLevel included={diff & 2}>M</DiffLevel>
          <DiffLevel included={diff & 4}>H</DiffLevel>
          <DiffLevel included={diff & 8}>X</DiffLevel>
        </span>
      </div>
      <div className="diff-container">
        {Array.from({ length: 6 }, (_, i) => (
          <DifficultyCircle filled={tier > i} key={i} />
        ))}
      </div>
    </div>
  )
})`
  user-select: none;
  div:first-child {
    display: flex;
    justify-content: space-between;
  }

  .diff-container {
    display: flex;
  }

  ${p => (!p.diff ? disabledCss : '')}
`

const Downloader = Styled.div`
  width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    border-radius: 8px;
    font-size: 2.4em;
    cursor: pointer;

    :hover {
      color: lightgreen;
    }
`

const AlbumArt = Styled(({ className, albumArt, children }) => {
  return (
    <div className={className}>
      {!albumArt && 'NO ART'}
      {children}
    </div>
  )
})`
  user-select: none;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: ${p => (p.albumArt ? `url(${p.albumArt})` : '#353535')};
  background-size: cover;
  font-size: 2em;
  display: grid;
  place-items: center;
  text-align: center;
  font-weight: bold;
  position: relative;
`

const StyledLoading = Styled(ReactLoading)`
  position: absolute;
  background-color: rgba(0, 0, 0, .5);
  border-radius: 8px;
`

const SongListing = Styled(
  ({ song, className, onDownloadClick, isDownloading, wasDownloaded }) => {
    const [isHovered, setHovered] = useState(false)
    let albumArt = null
    if (song.directLinks['album.png'] || song.directLinks['album.jpg']) {
      albumArt = song.directLinks['album.png'] || song.directLinks['album.jpg']
    }

    const askBeforeDownload = () => {
      onDownloadClick()
    }

    let artOverlay = null
    if (isDownloading) {
      artOverlay = <StyledLoading type="bars" height="100%" width="100%" />
    } else if (wasDownloaded) {
      artOverlay = <Downloader onClick={askBeforeDownload}>✓</Downloader>
    } else if (isHovered) {
      artOverlay = (
        <Downloader onClick={onDownloadClick}>
          {wasDownloaded ? '✓' : 'DL'}
        </Downloader>
      )
    }

    return (
      <div
        className={className}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AlbumArt albumArt={albumArt}>{artOverlay}</AlbumArt>
        <div className="info">
          <Name>{song.name}</Name>
          <Artist>{song.artist}</Artist>
          <AlbumGenre>
            {song.album} {song.year && `(${song.year})`}
          </AlbumGenre>
          <AlbumGenre>{song.genre}</AlbumGenre>
        </div>
        <div>
          <Difficulty
            name="Guitar"
            tier={song.tier_guitar}
            diff={song.diff_guitar}
          />
          <Difficulty name="Bass" tier={song.tier_bass} diff={song.diff_bass} />
          <Difficulty
            name="Drums"
            tier={song.tier_drums}
            diff={song.diff_drums}
          />
        </div>
      </div>
    )
  },
)`
  width: 100%;
  height: 140px;
  padding: 15px;
  user-select: none;

  display: grid;
  grid-template-columns: 110px auto 150px;
  grid-column-gap: 10px;

  .info {
    padding: 5px 0 5px 0;
    display: flex;
    flex-direction: column;
  }

  :nth-child(odd) {
    background-color: #222222;
  }
`

export default SongListing
