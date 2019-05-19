import React from 'react'
import { connect } from 'react-redux'

import Toolbar from '../components/Toolbar'
import ui from '../redux/slices/ui'

const Header = ({ openPreferences }) => {
  return (
    <Toolbar>
      <Toolbar.Button onClick={() => openPreferences()}>Preferences</Toolbar.Button>
      <Toolbar.SearchContainer>
        <Toolbar.Search />
        <Toolbar.ButtonContainer>
          <Toolbar.Button>{'<'}</Toolbar.Button>
          <Toolbar.Button>{'>'}</Toolbar.Button>
        </Toolbar.ButtonContainer>
      </Toolbar.SearchContainer>
    </Toolbar>
  )
}

const actionCreators = {
  openPreferences: ui.actions.openPreferences,
}

export default connect(
  null,
  actionCreators,
)(Header)
