import React, { useRef } from 'react'
import Styled, { keyframes } from 'styled-components'
import { connect } from 'react-redux'
import { remote } from 'electron'

import { saveLibraryPath, closeModal } from '../redux/actions'

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
  border-radius: 15px;
  background-color: rgba(50, 50, 50, .9);
  padding: 30px 20px 20px 20px;
  color: #DADADA;
  z-index: 3;
  animation: ${fallDown} .2s ease-out;
  user-select: none;
  position: relative;
  margin-left: 120px;
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
  width: 140px;
  height: 35px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 20px;
  color: #DADADA;
  border: 0px;
  outline: none;
  font-size: 1em;

  :first-child {
    margin-right: 10px;
  }
`

const Preferences = ({ library, saveLibraryPath, closeModal }) => {
  const inputEl = useRef(null)
  return (
    <PreferencesContainer unmountOnExit onClick={e => e.stopPropagation()}>
      <CloseButton onClick={closeModal}>X</CloseButton>
      <span>Chart Library Folder:</span>
      <LibraryDisplay>{library}</LibraryDisplay>
      <div>
        <Button onClick={() => inputEl.current.click()}>Choose Folder</Button>
        <Button onClick={() => remote.shell.openItem(library)}>Open Folder</Button>
      </div>
      <Button>Scan For Songs</Button>
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
  closeModal: () => dispatch(closeModal()),
})

const mapStateToProps = state => ({
  library: state.preferences.library,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Preferences)
