import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilAccountLogout,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { logOut } from 'src/services/auth'
import { getProfile } from 'src/services/user'

const AppHeaderDropdown = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
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

  const lgOut = () => {
    const logoutThunk = logOut()
    dispatch(logoutThunk)
    navigate('/login')
  }

  const handleProfile = () => {
    navigate('./profile')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <div style={{ width: '40px', height: '40px', border: '1px solid #ccc', borderRadius: '50%' }}>
          <img
            src={data.avatarURL}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
            size="xs"
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem onClick={handleProfile}>
          <CIcon icon={cilUser} className="me-2" />
          {t('Profile')}
        </CDropdownItem>
        <CDropdownItem onClick={() => lgOut()}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          {t('Logout')}
        </CDropdownItem>
        <CDropdownDivider />
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
