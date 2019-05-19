import React from 'react'
import Styled, { css } from 'styled-components'

const disabledCss = css`
  opacity: 0.5;
  text-decoration: line-through;
`

const ArtOverlay = Styled.div`
width: 100%;
height: 100%;
position: absolute;
top: 0;
left: 0;
background-color: rgba(0, 0, 0, .5);
border-radius: 8px;
font-size: 2.4em;
cursor: pointer;
display: ${({show}) => show ? 'block' : 'none'};

:hover {
  color: lightgreen;
}
`

const SongInfo = Styled.div`
  color: #EEEEEE;
  width: 100%;
  height: 140px;
  padding: 15px;
  user-select: none;

  display: grid;
  grid-template-columns: 110px minmax(0px, auto) 150px;
  grid-column-gap: 10px;

  :nth-child(even) {
    background-color: rgb(17, 17, 17);
  }

  :nth-child(odd) {
    background-color: #222222;
  }

  :hover {
    ${ArtOverlay} {
      display: block;
    }
  }
`

SongInfo.ArtOverlay = ArtOverlay

SongInfo.InfoWrapper = Styled.div`
  color: #EEEEEE;
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  line-height: 1.2;
`

SongInfo.Info = Styled.span`
  font-size: ${({size}) => size ? size : '1em'};
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

SongInfo.DifficultyWrapper = Styled.div`
  line-height: 1.6;
`

const DiffLevel = Styled.span`
  color: ${p => (p.included ? 'lightgreen' : 'rgba(255, 100, 100, .8)')};
  font-weight: ${p => (p.included ? 'bold' : 'normal')};
`

const DifficultyCircle = Styled.div`
  height: 11px;
  width: 11px;
  border-radius: 50%;
  border: 2px solid #EEEEEE;
  background-color: ${p => (p.filled ? 'red' : 'rgba(0,0,0,0)')};
  margin-right: 4px;
`

SongInfo.Difficulty = Styled(({ className, diff, tier, name }) => {
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

SongInfo.AlbumArt = Styled.div`
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
  color: #EEEEEE;
`

export default SongInfo