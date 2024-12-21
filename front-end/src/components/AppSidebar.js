import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CHeader,
  CHeaderText,
  CNavTitle,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'
import logo from '../assets/logo.webp'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

const AppSidebar = ({ navigation }) => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const changeState = useSelector((state) => state.changeState)
  for (let i = 0; i < navigation.length; i++) {
    if (navigation[i]._children) {
      if (navigation[i].name) {
        navigation[i].name = navigation[i].name
      }

      for (let j = 0; j < navigation[i]._children.length; j++) {
        if (navigation[i]._children[j].name) {
          navigation[i]._children[j].name = navigation[i]._children[j].name
        } else {
          navigation[i]._children[j] = navigation[i]._children[j]
        }
      }
    } else {
      navigation[i].name = navigation[i].name
    }
  }
  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={changeState.sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        {/*<CIcon className="sidebar-brand-full" icon={logoNegative} height={35} /> */}
        <img style={logoStyle} src={logo} className="rounded-circle" alt="logo" />
        <CHeaderText style={{ fontSize: '5 rem' }}>Badminton</CHeaderText>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

const logoStyle = {
  width: '30px',
  height: '30px',
  marginRight: '5px',
}
