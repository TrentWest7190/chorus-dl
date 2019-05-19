import { createSlice } from 'redux-starter-kit'

const downloads = createSlice({
  initialState: {
    currentlyDownloading: [],
  },
  reducers: {
    requestDownload: (state, action) => {
      state.currentlyDownloading.push(action.payload)
    },
    downloadComplete: (state, action) => {
      state.currentlyDownloading = state.currentlyDownloading.filter(
        dl => dl !== action.payload.id,
      )
    },
  },
})

export default downloads

export const {
  reducer,
  actions
} = downloads