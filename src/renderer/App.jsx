import React from 'react'
import Styled from 'styled-components'

import Header from './containers/Header'
import ChartList from './containers/SongList'
import Preferences from './containers/Preferences'

const AppWrapper = Styled.div`
  display: grid;
  grid-template-rows: 50px max-content;
`

const ChartListWrapper = Styled.div`
  width: 100%;
  height: calc(100vh - 50px);
  overflow-y: scroll;
  overflow-x: hidden;
`

const App = () => {
  return (
    <AppWrapper>
      <Header />
      <ChartListWrapper>
        <ChartList />
      </ChartListWrapper>
      <Preferences/>
    </AppWrapper>
  )
}

export default App
