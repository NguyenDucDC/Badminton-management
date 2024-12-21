import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { getProfile } from 'src/services/user'

const AppHeader = () => {
  const dispatch = useDispatch()
  const changeState = useSelector((state) => state.changeState)
  const [data, setData] = useState({})

  useEffect(() => {
    const handleGetProfile = async () => {
      try {
        const res = await getProfile()
        if (res.status === 1) {
          setData(res.user)
        }
      } catch (err) {
        console.log(err)
      }
    }
    handleGetProfile()
  }, [])

  return (
    <CHeader position="sticky" className="mb-4" style={{ zIndex: 1000 }}>
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !changeState.sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3 d-flex gap-2">
          <li className="user-info nav-item" style={{ fontSize: '0.9rem' }}>
            <div style={{ fontWeight: '700' }}>{data.username} </div>
            <span style={{ opacity: '0.6' }}>{data.role}</span>
          </li>
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
