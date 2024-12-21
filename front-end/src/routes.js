import React from 'react'
import { Roles } from './config/Roles'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

//Profile
const Profile = React.lazy(() => import('./views/profile/Profile'))

// Facility
const AddFacility = React.lazy(() => import('./views/facility/addFacility'))
const ListFacility = React.lazy(() => import('./views/facility/listFacility'))
const DetailFacility = React.lazy(() => import('./views/facility/detailFacility'))
const LockFacility = React.lazy(() => import('./views/facility/lockFacility'))
const ListLockFacility = React.lazy(() => import('./views/facility/listLock'))
const DetailLockFacility = React.lazy(() => import('./views/facility/detailLockFacility'))

// Manager
const AddManager = React.lazy(() => import('./views/manager/addManager'))
const ListManager = React.lazy(() => import('./views/manager/listManager'))
const DetailManager = React.lazy(() => import('./views/manager/detailManager'))

// Sale
const ListSale = React.lazy(() => import('./views/sale/listSale'))
const AddSale = React.lazy(() => import('./views/sale/addSale'))
const DetailSale = React.lazy(() => import('./views/sale/detailSale'))

// order
const AddOrder = React.lazy(() => import('./views/order/addOrder'))
const ListOrder = React.lazy(() => import('./views/order/listOrder'))
const DetailOrder = React.lazy(() => import('./views/order/detailOrder'))

// statistics
const GeneralStatistics = React.lazy(() => import('./views/statistics/generalStatistics'))
const DetailStatistics = React.lazy(() => import('./views/statistics/detailStatistics'))
const CustomerStatistics = React.lazy(() => import('./views/statistics/customerStatistics'))

// customer
const ListCustomer = React.lazy(() => import('./views/customer/listCustomer'))

// income and expenditure
const AddIncomeExpenditure = React.lazy(() => import('./views/income-expenditure/addIncomeExpenditure'))
const ListIncomeExpenditure = React.lazy(() => import('./views/income-expenditure/listIncomeExpenditure'))
const DetailIncomeExpenditure = React.lazy(() => import('./views/income-expenditure/detailIncomeExpenditure'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: Dashboard,
    permission: [Roles.SALE, Roles.ADMIN, Roles.MANAGER],
  },

  // profile
  {
    path: '/profile',
    name: 'Profile',
    element: Profile,
    permission: [Roles.SALE, Roles.ADMIN, Roles.MANAGER],
    exact: true,
  },

  // Facility
  {
    path: '/add-facility',
    name: 'Add Facility',
    element: AddFacility,
    permission: [Roles.ADMIN],
    exact: true,
  },
  {
    path: '/list-facility',
    name: 'List Facility',
    element: ListFacility,
    permission: [Roles.ADMIN, Roles.MANAGER, Roles.SALE],
    exact: true,
  },
  {
    path: '/detail-facility/:id',
    name: 'Detail Facility',
    element: DetailFacility,
    permission: [Roles.ADMIN, Roles.MANAGER, Roles.SALE],
    exact: true,
  },
  {
    path: '/lock-facility',
    name: 'Lock Facility',
    element: LockFacility,
    permission: [Roles.MANAGER],
    exact: true,
  },
  {
    path: '/list-lock-facility',
    name: 'List Lock Facility',
    element: ListLockFacility,
    permission: [Roles.ADMIN, Roles.MANAGER, Roles.SALE],
    exact: true,
  },
  {
    path: '/detail-lock-facility/:id',
    name: 'Detail Lock Facility',
    element: DetailLockFacility,
    permission: [Roles.ADMIN, Roles.MANAGER, Roles.SALE],
    exact: true,
  },

  // Manager
  {
    path: '/add-manager',
    name: 'Add Manager',
    element: AddManager,
    permission: [Roles.ADMIN],
    exact: true,
  },
  {
    path: '/list-manager',
    name: 'List Manager',
    element: ListManager,
    permission: [Roles.ADMIN],
    exact: true,
  },
  {
    path: '/detail-manager/:id',
    name: 'Detail Manager',
    element: DetailManager,
    permission: [Roles.ADMIN],
    exact: true,
  },

  // sale
  {
    path: '/list-sales',
    name: 'List Sales',
    element: ListSale,
    permission: [Roles.ADMIN, Roles.MANAGER],
    exact: true,
  },
  {
    path: '/add-sales',
    name: 'Add Sales',
    element: AddSale,
    permission: [Roles.ADMIN, Roles.MANAGER],
    exact: true,
  },
  {
    path: '/detail-sales/:id',
    name: 'Detail Sales',
    element: DetailSale,
    permission: [Roles.ADMIN, Roles.MANAGER],
    exact: true,
  },


  // GeneralStatistics
  {
    path: '/general-statistics',
    name: 'General Statistics',
    element: GeneralStatistics,
    permission: [Roles.ADMIN, Roles.MANAGER],
    exact: true,
  },
  {
    path: '/detail-statistics',
    name: 'Detail Statistics',
    element: DetailStatistics,
    permission: [Roles.ADMIN, Roles.MANAGER],
    exact: true,
  },
  {
    path: '/customer-statistics/:id',
    name: 'Customer Statistics',
    element: CustomerStatistics,
    permission: [Roles.ADMIN, Roles.MANAGER],
    exact: true,
  },

  // Order
  {
    path: '/list-order',
    name: 'List Order',
    element: ListOrder,
    permission: [Roles.SALE, Roles.MANAGER, Roles.ADMIN],
    exact: true,
  },
  {
    path: '/add-order',
    name: 'Add Order',
    element: AddOrder,
    permission: [Roles.SALE, Roles.MANAGER, Roles.ADMIN],
    exact: true,
  },
  {
    path: '/detail-order/:id',
    name: 'Detail Order',
    element: DetailOrder,
    permission: [Roles.SALE, Roles.MANAGER, Roles.ADMIN],
    exact: true,
  },

  // customer
  {
    path: '/list-customer',
    name: 'List Customer',
    element: ListCustomer,
    permission: [Roles.ADMIN, Roles.MANAGER],
    exact: true,
  },

  // income and expenditure
  {
    path: '/add-income-expenditure',
    name: 'Add Income or Expenditure',
    element: AddIncomeExpenditure,
    permission: [Roles.MANAGER],
    exact: true,
  },
  {
    path: '/list-income-expenditure',
    name: 'List Income or Expenditure',
    element: ListIncomeExpenditure,
    permission: [Roles.MANAGER, Roles.ADMIN],
    exact: true,
  },
  {
    path: '/detail-income-expenditure/:id',
    name: 'Detail Income or Expenditure',
    element: DetailIncomeExpenditure,
    permission: [Roles.MANAGER, Roles.ADMIN],
    exact: true,
  }
]

export default routes
