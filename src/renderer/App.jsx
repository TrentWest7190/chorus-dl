import React from 'react'
import { connect } from 'react-redux'
import Styled from 'styled-components'

import { closeModal } from './redux/actions'

import ChartList from './components/ChartList'
import Toolbar from './components/Toolbar'
import Preferences from './components/Preferences'

const Modals = {
  Preferences
}

const ModalContainer = Styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0);
  z-index: 2;
`

const ChartListContainer = Styled.div`
  width: 100%;
  height: calc(100vh - 50px);
  overflow-y: scroll;
`

const App = ({ modalOpen, ModalComponent, closeModal }) => {
  let Modal = null
  if (modalOpen) Modal = Modals[ModalComponent]
  return (
    <div>
      <Preferences/>
      {modalOpen && (
        <ModalContainer onClick={closeModal}>
          <Modal/>
        </ModalContainer>
      )}
      <Toolbar />
      <ChartListContainer>
        <ChartList />
      </ChartListContainer>
    </div>
  )
}

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal())
})

const mapStateToProps = state => ({
  modalOpen: state.ui.modalOpen,
  ModalComponent: state.ui.modal,
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
