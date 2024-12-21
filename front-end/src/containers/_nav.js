import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilPencil,
  cilSpeedometer,
  cilContact,
  cilUser,
  cilList,
  cilBuilding,
  cilCart,
  cilChartLine,
  cilMoney,
  cilBarChart,
  cilGroup,
  cilLockLocked
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { Roles } from 'src/config/Roles'


const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

  // Quản lý cơ sở
  {
    component: CNavTitle,
    name: 'Quản lý cơ sở',
    permission: [Roles.ADMIN, Roles.MANAGER, Roles.SALE],
  },
  {
    component: CNavItem,
    name: 'Danh sách cơ sở',
    to: '/list-facility',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    permission: [Roles.ADMIN, Roles.MANAGER, Roles.SALE],
  },
  {
    component: CNavItem,
    name: 'Thêm cơ sở',
    to: '/add-facility',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    permission: [Roles.ADMIN],
  },
  {
    component: CNavItem,
    name: 'Khoá cơ sở',
    to: '/lock-facility',
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
    permission: [Roles.MANAGER],
  },
  {
    component: CNavItem,
    name: 'Danh sách khoá cơ sở',
    to: '/list-lock-facility',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    permission: [Roles.ADMIN, Roles.MANAGER, Roles.SALE],
  },

  // Quản lý manager
  {
    component: CNavTitle,
    name: 'Quản lý manager',
    permission: [Roles.ADMIN],
  },
  {
    component: CNavItem,
    name: 'Danh sách manager',
    to: '/list-manager',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    permission: [Roles.ADMIN],
  },
  {
    component: CNavItem,
    name: 'Thêm manager',
    to: '/add-manager',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    permission: [Roles.ADMIN],
  },

  // Sale
  {
    component: CNavTitle,
    name: 'Quản Lý Sales',
    permission: [Roles.ADMIN, Roles.MANAGER],
  },
  {
    component: CNavItem,
    name: 'Danh sách sales',
    to: '/list-sales',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    permission: [Roles.ADMIN, Roles.MANAGER],
  },
  {
    component: CNavItem,
    name: 'Thêm Sales',
    to: '/add-sales',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    permission: [Roles.MANAGER],
  },

  // Quản lý thu chi
  {
    component: CNavTitle,
    name: 'Quản Lý Thu - Chi',
    permission: [Roles.ADMIN, Roles.MANAGER],
  },
  {
    component: CNavItem,
    name: 'Danh sách thu - chi',
    to: '/list-income-expenditure',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    permission: [Roles.ADMIN, Roles.MANAGER],
  },
  {
    component: CNavItem,
    name: 'Thêm khoản thu - chi',
    to: '/add-income-expenditure',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    permission: [Roles.MANAGER],
  },

  // Thống kê
  {
    component: CNavTitle,
    name: 'Thống kê',
    permission: [Roles.ADMIN, Roles.MANAGER],
  },
  {
    component: CNavItem,
    name: 'Thống kê chung',
    to: '/general-statistics',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    permission: [Roles.ADMIN, Roles.MANAGER],
  },
  {
    component: CNavItem,
    name: 'Thống kê chi tiết',
    to: '/detail-statistics',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
    permission: [Roles.ADMIN, Roles.MANAGER],
  },

  // Đơn hàng
  {
    component: CNavTitle,
    name: 'Đơn hàng',
    permission: [Roles.SALE, Roles.MANAGER, Roles.ADMIN],
  },
  {
    component: CNavItem,
    name: 'Danh sách đơn hàng',
    to: '/list-order',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    permission: [Roles.SALE, Roles.MANAGER, Roles.ADMIN],
  },
  {
    component: CNavItem,
    name: 'Thêm đơn hàng',
    to: '/add-order',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
    permission: [Roles.SALE],
  },

  // Khách hàng
  {
    component: CNavTitle,
    name: 'Khách hàng',
    permission: [Roles.ADMIN, Roles.MANAGER],
  },
  {
    component: CNavItem,
    name: 'Danh sách khách hàng',
    to: '/list-customer',
    icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
    permission: [Roles.ADMIN, Roles.MANAGER],
  },
]

export default _nav

