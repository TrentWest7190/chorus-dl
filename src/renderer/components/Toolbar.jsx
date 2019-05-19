import React from 'react'
import Styled from 'styled-components'

const Toolbar = Styled.div`
  height: 50px;
  padding: 0 10px;
  display: grid;
  place-items: center;
  grid-auto-flow: column;
  grid-template-columns: min-content auto;
`

Toolbar.Search = Styled.input`
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

Toolbar.SearchContainer = Styled.div`
  display: flex;
  justify-self: end;
  * {
    margin-right: 10px;

    :last-child {
      margin-right: 0px;
    }
  }
`

Toolbar.Button = Styled.button`
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

Toolbar.ButtonContainer = Styled.div`
  ${Toolbar.Button} {
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

export default Toolbar