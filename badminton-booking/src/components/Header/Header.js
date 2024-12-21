import React, { useEffect, useState, useRef } from 'react';
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.webp';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../services/user';
import { useAuth } from '../../context/AuthContext';

const cx = classNames.bind(styles)

function Header() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [hoveredItem, setHoveredItem] = useState(false);
    const userId = localStorage.getItem('userId')
    const [data, setData] = useState({})
    const { isAuthenticated } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const profileRef = useRef(null);
    const avtRef = useRef(null);
    const { setLogout } = useAuth();

    const nav = [
        { path: '/', name: 'Trang chủ' },
        { path: '/cart', name: 'Giỏ hàng' },
        { path: '/booking', name: 'Đặt sân' },
        { path: '/help', name: 'Hỗ trợ' },
    ]

    useEffect(() => {
        if (isAuthenticated) {
            handleGetUser()
        }
    }, [])

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleGetUser = async () => {
        try {
            const res = await getUser(userId)
            if (res.status === 1) {
                setData(res.user)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleLogout = () => {
        setLogout();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login')
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target) && !avtRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileRef]);

    return (
        <div className={cx('container')}>
            <div className={cx('header-left')} onClick={() => navigate('/')}>
                <img src={logo} />
                <p>Badminton</p>
            </div>

            <div className={cx('header-right')}>
                {isAuthenticated ? (
                    <div className={cx('avatar')} onClick={toggleDropdown} ref={avtRef}>
                        <img src={data.avatarURL} />


                        {showDropdown && (
                            <div className={cx('popup-avatar')} ref={profileRef}>
                                <div className={cx('profile')} onClick={() => navigate('/profile')}>
                                    <img
                                        src={data.avatarURL}
                                        alt="avt"
                                    />
                                    <span>{data.username}</span>
                                </div>
                                <hr className={cx('line')}></hr>
                                <div className={cx('logout')} onClick={() => {
                                    handleLogout()
                                }}>
                                    <div className={cx('logout-icon')}>
                                        <FontAwesomeIcon
                                            icon={faRightFromBracket}
                                            className={cx('icon')}
                                        />
                                    </div>
                                    <span>Đăng xuất</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        key='login'
                        to='/login'
                        className={cx('item', {
                            active: pathname === '/login',
                            hover: hoveredItem === 'login'
                        })}
                        onMouseEnter={() => setHoveredItem(true)}
                        onMouseLeave={() => setHoveredItem(false)}
                    >
                        Đăng nhập
                    </Link>
                )}

                {nav.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={cx('item', {
                            active: pathname === item.path,
                            hover: hoveredItem === index
                        })}
                        onMouseEnter={() => setHoveredItem(true)}
                        onMouseLeave={() => setHoveredItem(false)}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>

        </div>
    )
}

export default Header;