import React from 'react'
import DefaultLayout from './layout/DefaultLayout/DefaultLayout'

const Login = React.lazy(() => import('./pages/Login/Login'));
const Register = React.lazy(() => import('./pages/Register/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword/ForgotPassword'));

const HomePage = React.lazy(() => import('./pages/Home/HomePage'));
const Booking = React.lazy(() => import('./pages/Booking/Booking'));
const DetailFacility = React.lazy(() => import('./pages/DetailFacility/DetailFacility'));
const Help = React.lazy(() => import('./pages/Help/Help'));
const PaymentReturn = React.lazy(() => import('./pages/PaymentReturn/PaymentReturn'));
const Cart = React.lazy(() => import('./pages/Cart/Cart'));
const Profile = React.lazy(() => import('./pages/Profile/Profile'));

const routes = [
    {
        path: '/login',
        name: 'Login',
        element: Login,
        exact: true,
        layout: DefaultLayout
    },
    {
        path: '/register',
        name: 'Register',
        element: Register,
        exact: true,
        layout: DefaultLayout
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        element: ForgotPassword,
        exact: true,
        layout: DefaultLayout
    },
    {
        path: '/',
        name: 'Home',
        element: HomePage,
        exact: true,
        layout: DefaultLayout
    },
    {
        path: '/booking',
        name: 'Booking',
        element: Booking,
        exact: true,
        layout: DefaultLayout
    },
    {
        path: '/detail-facility/:id',
        name: 'DetailFacility',
        element: DetailFacility,
        exact: true,
        layout: DefaultLayout
    },
    {
        path: '/help',
        name: 'Help',
        element: Help,
        exact: true,
        layout: DefaultLayout
    },
    {
        path: '/payment/vnpay_return',
        name: 'PaymentReturn',
        element: PaymentReturn,
        exact: true,
        layout: null
    },
    {
        path: '/cart',
        name: 'Cart',
        element: Cart,
        exact: true,
        layout: DefaultLayout
    },
    {
        path: '/profile',
        name: 'Profile',
        element: Profile,
        exact: true,
        layout: DefaultLayout
    }
]

export default routes
