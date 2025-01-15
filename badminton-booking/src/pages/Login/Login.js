import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
import { notification, Input } from 'antd';
import { useAuth } from '../../context/AuthContext';


const cx = classNames.bind(styles);

function Login() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();

    const { setLogin } = useAuth();

    const handleLogin = async () => {
        if (!phone) {
            notification.error({
                message: `Notification`,
                description: `Vui lòng nhập số điện thoại!`,
                placement: `bottomRight`,
                duration: 3,
            })
            return
        } else if (!password) {
            notification.error({
                message: `Notification`,
                description: `Vui lòng nhập mật khẩu!`,
                placement: `bottomRight`,
                duration: 3,
            })
            return
        }

        try {
            const res = await login(phone, password)
            if (res.status === 1) {
                localStorage.setItem('token', res.token);
                localStorage.setItem('userId', res.data.user.id);
                setLogin();
                navigate("/")
                notification.success({
                    message: `Notification`,
                    description: `${res.message}`,
                    placement: `bottomRight`,
                    duration: 3,
                })
            } else {
                notification.error({
                    message: `Notification`,
                    description: `${res.message}`,
                    placement: `bottomRight`,
                    duration: 1.5,
                })
            }
        } catch {
            notification.error({
                message: `Notification`,
                description: `Đăng nhập không thành công!`,
                placement: `bottomRight`,
                duration: 1.5,
            })
        }
    }

    return (
        <div className={cx('wrapper')}>
            <h2>Đăng nhập</h2>
            <div className={cx('container')}>
                <div className={cx('input')}>
                    <Input
                        className={cx('input-item')}
                        autoComplete="tel"
                        placeholder="Số điện thoại"
                        onChange={(e) => {
                            setPhone(e.target.value)
                        }}
                    />
                    <Input.Password
                        className={cx('input-item')}
                        placeholder="Mật khẩu"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />
                </div>
                <div>
                    <button className={cx('btn-login')} onClick={() => handleLogin()}>Đăng nhập</button>
                </div>
                <div className={cx('register')}>
                    Chưa có tài khoản?
                    <a href='/register' >Đăng ký ngay</a>
                </div>
            </div>
        </div>
    );
}

export default Login;
