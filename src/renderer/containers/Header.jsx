import React, { useState } from 'react'
import { connect } from 'react-redux'

import Toolbar from '../components/Toolbar'
import ui from '../redux/slices/ui'
import chorus, { fetchCharts } from '../redux/slices/chorus'

const Header = ({
  skip,
  openPreferences,
  fetchCharts,
  setFetchMode,
  setSkip,
  setSearchQuery,
}) => {
  const [searchValue, setSearchValue] = useState('')

  const _onKeyPress = e => {
    if (e.key !== 'Enter') return

    setSkip(0)
    setFetchMode('search')
    setSearchQuery(searchValue)
    fetchCharts()
  }

  const _nextCharts = () => {
    setSkip(skip + 20)
    fetchCharts()
  }

  const _prevCharts = () => {
    setSkip(skip - 20 < 0 ? 0 : skip - 20)
    fetchCharts()
  }

  const _latestCharts = () => {
    setSkip(0)
    setSearchValue('')
    fetchCharts()
  }

  return (
    <Toolbar>
      <Toolbar.Button onClick={() => openPreferences()}>
        Preferences
      </Toolbar.Button>
      <Toolbar.SearchContainer>
        <Toolbar.Button onClick={_latestCharts}>Latest</Toolbar.Button>
        <Toolbar.Search
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyPress={_onKeyPress}
          placeholder="Search..."
        />
        <Toolbar.ButtonContainer>
          <Toolbar.Button onClick={_prevCharts}>{'<'}</Toolbar.Button>
          <Toolbar.Button onClick={_nextCharts}>{'>'}</Toolbar.Button>
        </Toolbar.ButtonContainer>
      </Toolbar.SearchContainer>
    </Toolbar>
  )
}

const mapStateToProps = state => ({
  skip: state.chorus.skip,
})

const actionCreators = {
  openPreferences: ui.actions.openPreferences,
  setFetchMode: chorus.actions.setFetchMode,
  setSkip: chorus.actions.setSkip,
  setSearchQuery: chorus.actions.setSearchQuery,
  fetchCharts,
}

export default connect(
  mapStateToProps,
  actionCreators,
)(Header)
