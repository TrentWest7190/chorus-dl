import React, { useState } from 'react'
import useDebouncedCallback from 'use-debounce/lib/callback'
import { connect } from 'react-redux'
import Styled from 'styled-components'
import {
  searchCharts,
  openPreferences,
} from '../redux/actions'

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
  margin-right: 5px;
  width: 200px;

  ::placeholder {
    color: #E0E0E0;
  }
`

const SearchContainer = Styled.div`
  display: flex;
  justify-self: end;
`

const Button = Styled.button`
  height: 30px;
  border-radius: 15px;
  border: 0px;
  background-color: #535353;
  outline: none;
  color: #EEEEEE;

  :hover {
    background-color: #777777;
  }
`

const NextBack = Styled(
  ({ className, onNext, onBack, disableBack, disableNext }) => (
    <div className={className}>
      <Button onClick={disableBack ? () => {} : onBack}>{'<'}</Button>
      <Button onClick={disableNext ? () => {} : onNext}>{'>'}</Button>
    </div>
  ),
)`

  ${Button} {
    width: 30px;
    :first-child {
      border-radius: 15px 0 0 15px;
      margin-right: 2px;
      ${p =>
        p.disableBack &&
        `
        opacity: .5;
        cursor: default;
        :hover {
          background-color: #535353;
        }
      `}
    }
  
    :last-child {
      border-radius: 0 15px 15px 0;
      ${p =>
        p.disableNext &&
        `
        opacity: .5;
        cursor: default;
        :hover {
          background-color: #535353;
        }
      `}
    }
  }
`

const Toolbar = ({ isFetching, search, openPreferences, searchNextCharts }) => {
  const [searchValue, setSearchValue] = useState('')
  const [skip, setSkip] = useState(0)
  const [_onChange] = useDebouncedCallback(query => {
    setSearchValue(query)
    if (query.length > 0) search(query)
  }, 200)
  const _onNext = () => {
    search(`${searchValue}&from=${skip + 20}`)
    setSkip(skip + 20)
  }
  const _onBack = () => {
    search(`${searchValue}&from=${skip - 20}`)
    setSkip(skip - 20)
  }
  return (
    <ToolbarContainer>
      <Button onClick={openPreferences}>Preferences</Button>
      <SearchContainer>
        <Search
          onChange={ev => _onChange(ev.target.value)}
          placeholder="Search..."
        />
        <NextBack
          onNext={_onNext}
          onBack={_onBack}
          disableBack={skip <= 0 || isFetching}
          disableNext={isFetching}
        />
      </SearchContainer>
    </ToolbarContainer>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    search: query => dispatch(searchCharts(query)),
    openPreferences: () => dispatch(openPreferences()),
    searchNextCharts: query => dispatch(searchNextCharts(query)),
  }
}

const mapStateToProps = state => ({
  isFetching: state.charts.isFetching,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Toolbar)
