import {createSlice} from 'redux-starter-kit'
import fetch from 'node-fetch'

const chorus = createSlice({
  slice: 'chorus',
  initialState: {
    fetchMode: 'latest',
    searchQuery: '',
    skip: 0,
    requesting: false,
    byId: {},
    ids: []
  },
  reducers: {
    requestCharts: (state) => {
      state.requesting = true
    },
    recieveCharts: (state, action) => {
      state.requesting = false
      state.ids = action.payload.map(({id}) => id)
      state.byId = action.payload.reduce((a,v) => ({
        ...a,
        [v.id]: v
      }), {})
    },
    setFetchMode: (state, action) => {
      state.fetchMode = action.payload
    },
    setSkip: (state, action) => {
      state.skip = action.payload
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    }
  }
})

export default chorus

export const fetchCharts = () => async (dispatch, getState) => {
  const {
    fetchMode,
    skip,
    searchQuery
  } = getState().chorus
  let queryString = ''
  if (searchQuery) queryString = `query=${searchQuery}&`
  dispatch(chorus.actions.requestCharts())
  const rawResults = await fetch(`https://chorus.fightthe.pw/api/${fetchMode}?${queryString}from=${skip}`)
  const {songs} = await rawResults.json()
  dispatch(chorus.actions.recieveCharts(songs))
}