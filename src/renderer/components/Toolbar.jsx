import React from 'react'
import useDebouncedCallback from 'use-debounce/lib/callback'
import { connect } from 'react-redux'
import Styled from 'styled-components'
import { searchCharts, openPreferences } from '../redux/actions'

const ToolbarContainer = Styled.div`
  height: 50px;
  padding: 0 10px;
  display: grid;
  place-items: center;
  grid-auto-flow: column;
  grid-template-columns: min-content auto;
`

const Search = Styled.input`
  height: 30px;
  border-radius: 15px;
  border: 0px;
  padding-left: 15px;
  background-color: #535353;
  outline: none;
  color: #EEEEEE;
  justify-self: end;

  ::placeholder {
    color: #E0E0E0;
  }
`

const Button = Styled.button`
  height: 30px;
  border-radius: 15px;
  border: 0px;
  background-color: #535353;
  outline: none;
  color: #EEEEEE;
`

const Toolbar = ({ search, openPreferences }) => {
  const [_onChange] = useDebouncedCallback(query => {
    if (query.length > 0) search(query)
  }, 200)
  return (
    <ToolbarContainer>
      <Button onClick={openPreferences}>Preferences</Button>
      <Search
        onChange={ev => _onChange(ev.target.value)}
        placeholder="Search..."
      />
    </ToolbarContainer>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    search: query => dispatch(searchCharts(query)),
    openPreferences: () => dispatch(openPreferences())
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(Toolbar)
