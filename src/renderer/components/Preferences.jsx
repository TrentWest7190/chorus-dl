import React, { useRef, useState } from 'react'
import Styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'
import { remote, ipcRenderer } from 'electron'
import ReactLoading from 'react-loading'

import {
  saveLibraryPath,
  closePreferences,
  clearSongCache,
  startSongScan,
} from '../redux/actions'
import eStore from 'common/electronStore'

const fallDown = keyframes`
  from {
    transform: translateY(-100vh);
  }
`

const CloseButton = Styled.span`
  position: absolute;
  top: 5px;
  left: 10px;
  font-size: 1.5em;
  font-weight: bold;
  cursor: pointer;
`

const PreferencesContainer = Styled.div`
  width: 425px;
  border-radius: 0 0 15px 15px;
  background-color: rgba(50, 50, 50, .95);
  padding: 30px 20px 20px 20px;
  color: #DADADA;
  z-index: 3;
  animation: ${fallDown} .2s ease-out;
  user-select: none;
  position: absolute;
  margin-left: 120px;
  display: flex;
  flex-direction: column;
  transition: transform .2s ${p => (p.show ? 'ease-out' : 'ease-in')};

  transform: ${p => (p.show ? 'translateY(0)' : 'translateY(-100vh)')};

  div {
    margin-bottom: 10px;
    display: flex;
  }
`

const LibraryDisplay = Styled.div`
  width: 100%;
  height: 30px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 20px;
  padding-left: 10px;
  margin: 10px 0;
  display: grid;
  align-items: center;
`

const Button = Styled.button`
  width: 50%;
  height: 35px;
  background-color: ${p =>
    p.warn ? 'rgba(255, 121, 0, 0.7)' : 'rgba(255,255,255,0.2)'};
  border-radius: 20px;
  color: #DADADA;
  border: 0px;
  outline: none;
  font-size: 1em;

  :first-child {
    margin-right: 10px;
  }

  ${p =>
    p.disabled &&
    `
    cursor: auto;
    background-color: rgba(30,30,30,0.3);
    color: #999999;
  `}
`

const StyledLoading = Styled(ReactLoading)`
  svg {
    width: 100%;
    height: 100%;
  }
`

const Preferences = ({
  library,
  show,
  scanningSongs,
  saveLibraryPath,
  closePreferences,
  clearCache,
  startSongScan,
}) => {
  const [confirmClear, setConfirmClear] = useState(false)
  const inputEl = useRef(null)

  const _clearCache = () => {
    if (confirmClear) {
      clearCache()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
    }
  }

  const _closePreferences = () => {
    closePreferences()
    setConfirmClear(false)
  }

  const _scanLibrary = () => {
    if (scanningSongs) {
      return
    } else {
      startSongScan()
      ipcRenderer.send('scan-library')
    }
  }

  return (
    <PreferencesContainer
      unmountOnExit
      onClick={e => e.stopPropagation()}
      show={show}
    >
      <CloseButton onClick={_closePreferences}>X</CloseButton>
      <span>Chart Library Folder:</span>
      <LibraryDisplay>{library}</LibraryDisplay>
      <div>
        <Button onClick={() => inputEl.current.click()}>Choose Folder</Button>
        <Button
          onClick={() => remote.shell.openItem(library)}
          disabled={library.length <= 0}
        >
          Open Folder
        </Button>
      </div>
      <div>
        <Button onClick={_scanLibrary} disabled={library.length <= 0}>
          {scanningSongs ? (
            <StyledLoading width="100%" height="100%" type="bars" />
          ) : (
            'Scan For Songs'
          )}
        </Button>
        <Button
          onClick={_clearCache}
          warn={confirmClear}
          disabled={library.length <= 0}
        >
          {confirmClear ? 'You Sure?' : 'Clear Song Cache'}
        </Button>
      </div>

      <input
        style={{ display: 'none' }}
        type="file"
        webkitdirectory="true"
        ref={inputEl}
        onChange={e => saveLibraryPath(e.target.files[0].path)}
      />
    </PreferencesContainer>
  )
}

const mapDispatchToProps = dispatch => ({
  saveLibraryPath: newPath => dispatch(saveLibraryPath(newPath)),
  closePreferences: () => dispatch(closePreferences()),
  clearCache: () => dispatch(clearSongCache()),
  startSongScan: () => dispatch(startSongScan()),
})

const mapStateToProps = state => ({
  library: state.preferences.library,
  show: state.ui.preferencesOpen,
  scanningSongs: state.ui.scanningSongs,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Preferences)
