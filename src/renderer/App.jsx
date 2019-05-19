import React from 'react'
import { connect } from 'react-redux'
import Styled from 'styled-components'

import Header from './containers/Header'
import ChartList from './containers/SongList'
import Preferences from './containers/Preferences'
import ui from './redux/slices/ui'

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

const App = ({ preferencesOpen, closePreferences }) => {
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

const mapStateToProps = state => ({
  preferencesOpen: state.ui.preferencesOpen,
})

const actionCreators = {
  closePreferences: ui.actions.closePreferences,
}

export default connect(
  mapStateToProps,
  actionCreators,
)(App)
