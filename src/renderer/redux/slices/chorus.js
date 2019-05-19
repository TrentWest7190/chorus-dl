import {createSlice} from 'redux-starter-kit'
import fetch from 'node-fetch'

const chorus = createSlice({
  slice: 'chorus',
  initialState: {
    requesting: false,
    byId: {},
    ids: []
  },
  reducers: {
    requestCharts: (state) => {
      state.requesting = true
    },
    recieveCharts: (state, action) => {
      state.ids = action.payload.map(({id}) => id)
      state.byId = action.payload.reduce((a,v) => ({
        ...a,
        [v.id]: v
      }), {})
    }
  }
})

export default chorus

export const fetchCharts = query => async dispatch => {
  dispatch(chorus.actions.requestCharts)
  const rawResults = await fetch(`https://chorus.fightthe.pw/api/latest?query=${query}`)
  const {songs} = await rawResults.json()
  dispatch(chorus.actions.recieveCharts(songs))
}