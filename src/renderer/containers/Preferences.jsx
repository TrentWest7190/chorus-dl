import React, { useRef, useState } from 'react'
import Styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'
import { remote, ipcRenderer } from 'electron'
import ReactLoading from 'react-loading'
import { toast } from 'react-toastify'
import { parseSaveFormat } from 'common/saveFormatParser'

import preferences, {saveLibraryPath, saveSaveFormat} from '../redux/slices/preferences'

import {clearDlCache} from '../redux/slices/downloadManager'

import ui from '../redux/slices/ui'

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
  width: 475px;
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

const ClearCacheWarning = Styled.div`
  user-select: none;
`

const SaveLocationEditor = Styled.input`
  height: 30px;
  border-radius: 15px;
  border: 0px;
  padding-left: 15px;
  background-color: ${({ invalid }) =>
    invalid ? 'rgba(255, 100, 100, 0.8)' : '#535353'};
  outline: none;
  color: #EEEEEE;
  margin-right: 5px;
  width: 100%;

  ::placeholder {
    color: #909090;
  }
`

const Preferences = ({
  library,
  show,
  scanningSongs,
  saveLibraryPath,
  closePreferences,
  clearDlCache,
  startSongScan,
  saveSaveFormat,
  saveFormat,
  setInvalidSaveFormat,
  invalidSaveFormat,
}) => {
  const [localSaveFormat, setFormat] = useState(saveFormat)
  const inputEl = useRef(null)

  const _clearCache = () => {
    toast.warn(
      <ClearCacheWarning>
        <div>
          Are you sure you want to do this? All songs will appear as not being
          downloaded, and you'll have to rescan your library to add them back.
        </div>
        <button
          onClick={() => {
            toast.dismiss()
            clearDlCache()
          }}
        >
          Hit it, chief
        </button>
      </ClearCacheWarning>,
      {
        autoClose: false,
        closeOnClick: false,
      },
    )
  }

  const _closePreferences = () => {
    if (invalidSaveFormat) {
      toast.error(
        `You need to set a valid save format, or else you can't download anything!`,
      )
    } else {
      closePreferences()
    }
  }

  const _scanLibrary = () => {
    toast.warn(
      <ClearCacheWarning>
        <div>
          This feature is kind of expiremental. It might not work exactly right
          and if you have a lot of songs, it'll probably take a while and the
          program might go unresponsive several times during the process or it
          might even crash!
        </div>
        <button
          onClick={() => {
            toast.dismiss()
            startSongScan()
            ipcRenderer.send('scan-library')
          }}
        >
          Do it anyway.
        </button>
      </ClearCacheWarning>,
      {
        autoClose: false,
        closeOnClick: false,
      },
    )
  }

  const _onSaveLocationBlur = () => {
    const parsed = parseSaveFormat(localSaveFormat)
    if (parsed.error) {
      parsed.errorMsgs.forEach(msg => {
        toast.error(msg)
      })
      setInvalidSaveFormat(true)
    } else {
      saveSaveFormat(localSaveFormat)
    }
  }

  return (
    <PreferencesContainer onClick={e => e.stopPropagation()} show={show}>
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
        <Button onClick={_clearCache} disabled={library.length <= 0}>
          Clear Song Cache
        </Button>
      </div>
      <span>Song Saving Structure</span>
      <div>
        <SaveLocationEditor
          value={localSaveFormat}
          onChange={e => setFormat(e.target.value)}
          onBlur={_onSaveLocationBlur}
          invalid={invalidSaveFormat}
        />
      </div>
      <span style={{ fontSize: '.75em' }}>
        Valid fields are artist, album, genre, charter, name, year
      </span>

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

const mapStateToProps = state => ({
  library: state.preferences.library,
  show: state.ui.preferencesOpen,
  scanningSongs: state.ui.scanningSongs,
  saveFormat: state.preferences.saveFormat,
  invalidSaveFormat: state.preferences.invalidSaveFormat,
})

const actionCreators = {
  saveLibraryPath,
  saveSaveFormat,
  clearDlCache,
  startSongScan: ui.actions.startSongScan,
  closePreferences: ui.actions.closePreferences,
  setInvalidSaveFormat: preferences.actions.setInvalidSaveFormat
}

export default connect(
  mapStateToProps,
  actionCreators,
)(Preferences)
