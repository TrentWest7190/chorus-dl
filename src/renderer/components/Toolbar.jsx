import React, { useState } from 'react'
import useDebouncedCallback from 'use-debounce/lib/callback'
import { connect } from 'react-redux'
import Styled from 'styled-components'
import {
  searchCharts,
  openPreferences,
  setSearchMode
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
    color: #909090;
  }
`

const SearchContainer = Styled.div`
  display: flex;
  justify-self: end;
  * {
    margin-right: 10px;

    :last-child {
      margin-right: 0px;
    }
  }
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

  ${p => p.disabled && `
    opacity: .5;
    cursor: default;
    :hover {
      background-color: #535353;
    }
  `}
`

const NextBack = Styled(
  ({ className, onNext, onBack, disableBack, disableNext }) => (
    <div className={className}>
      <Button onClick={disableBack ? () => {} : onBack} disabled={disableBack}>{'<'}</Button>
      <Button onClick={disableNext ? () => {} : onNext} disabled={disableNext}>{'>'}</Button>
    </div>
  ),
)`

  ${Button} {
    width: 30px;
    :first-child {
      border-radius: 15px 0 0 15px;
      margin-right: 2px;
    }
  
    :last-child {
      border-radius: 0 15px 15px 0;
    }
  }
`

const Toolbar = ({ isFetching, search, openPreferences, searchNextCharts, setSearchMode }) => {
  const [searchValue, setSearchValue] = useState('')
  const [skip, setSkip] = useState(0)
  const [_onChange] = useDebouncedCallback(query => {
    setSearchMode('search')
    setSearchValue(query)
    if (query.length > 0) search(query)
  }, 400)
  const _onNext = () => {
    search(`${searchValue}&from=${skip + 20}`)
    setSkip(skip + 20)
  }
  const _onBack = () => {
    const newSkip = skip - 20
    search(`${searchValue}${newSkip <= 0 ? `` : `&from=${newSkip}`}`)
    setSkip(newSkip)
  }

  const _getLatest = () => {
    setSearchMode('latest')
    search()
  }

  return (
    <ToolbarContainer>
      <Button onClick={openPreferences}>Preferences</Button>
      <SearchContainer>
        <Button onClick={() => _getLatest()}>Latest</Button>
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
    setSearchMode: mode => dispatch(setSearchMode(mode))
  }
}

const mapStateToProps = state => ({
  isFetching: state.charts.isFetching,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Toolbar)
