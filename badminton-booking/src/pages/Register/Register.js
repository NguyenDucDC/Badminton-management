import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Register.module.scss';
import { useNavigate } from 'react-router-dom';
import { register, checkAccount } from '../../services/auth';
import { auth } from '../../config/Firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { Modal, Input, Button, message, notification } from 'antd';


const cx = classNames.bind(styles);

function Register() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [username, setUsername] = useState();
    const [otp, setOtp] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!window.recaptchaVerifier) {
            setUpRecaptcha();
        }
    }, []);

    const normalizePhoneNumber = (phoneNumber) => {
        let cleanedNumber = phoneNumber.replace(/\s+/g, '');

        if (cleanedNumber.startsWith('+84')) {
            cleanedNumber = '0' + cleanedNumber.slice(3);
        }

        return cleanedNumber;
    };

    const formatPhoneNumber = (phoneNumber) => {
        if (phoneNumber.startsWith('0')) {
            return '+84' + phoneNumber.slice(1);
        }
        return phoneNumber;
    };

    const handleCheckAccount = async () => {
        try {
            const res = await checkAccount(phone)
            if (res.status === 1) {
                notification.error({
                    message: `Notification`,
                    description: `${res.message}`,
                    placement: `bottomRight`,
                    duration: 3,
                })
                return true;
            }
            return false;
        } catch (err) {
            console.log(err)
        }
    }

    const setUpRecaptcha = () => {
        if (window.recaptchaVerifier) {
            return;
        }
        let recaptchaElement = document.getElementById('sign-in-button');
        if (!recaptchaElement) {
            recaptchaElement = document.createElement('div');
            recaptchaElement.id = 'sign-in-button';
            document.body.appendChild(recaptchaElement);
        }

        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                console.log("Recaptcha verified");
            }
        });
    };

    // Gửi OTP
    const sendOTP = async () => {
        if (!handleValidate()) {
            return;
        }

        const accountExists = await handleCheckAccount();
        if (accountExists) {
            return;
        }
        setUpRecaptcha();

        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, formatPhoneNumber(phone), appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setVerificationId(confirmationResult.verificationId);
                setIsVisible(true);
                message.success('OTP đã được gửi!');
            }).catch((error) => {
                console.log("error: ", error)
                notification.error({
                    message: `Notification`,
                    description: `${error}`,
                    placement: `bottomRight`,
                    duration: 3,
                })
            });
    };

    const handleOtpSubmit = async () => {
        if (otp.length !== 6) {
            message.error('OTP không hợp lệ. Vui lòng nhập lại.');
            return;
        }
        try {
            const credential = PhoneAuthProvider.credential(verificationId, otp);
            await signInWithCredential(auth, credential);
            message.success('Xác thực OTP thành công!');
            handleRegister(); // Tiến hành đăng ký sau khi xác thực thành công
            handleCancel();
        } catch (error) {
            console.error("Error verifying OTP", error);
            message.error('Xác minh OTP thất bại!');
        }
    };

    const handleValidate = () => {
        if (!phone || !username || !password || !confirmPassword) {
            notification.error({
                message: `Error`,
                description: `Vui lòng nhập đầy đủ thông tin!`,
                placement: `bottomRight`,
                duration: 3,
            })
            console.log("false")

            return false;
        }

        if (password !== confirmPassword) {
            notification.error({
                message: `Error`,
                description: `Mật khẩu không trùng khớp, vui lòng nhập lại mật khẩu!`,
                placement: `bottomRight`,
                duration: 3,
            })
            return false;
        }
        return true;
    }

    const handleRegister = async () => {
        try {
            const res = await register(normalizePhoneNumber(phone), username, password)
            if (res.status === 1) {
                navigate('/login')
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
                    duration: 3,
                })
            }
        } catch {
            notification.error({
                message: `Notification`,
                description: `Đăng ký không thành công!`,
                placement: `bottomRight`,
                duration: 1.5,
            })
        }
    }

    const handleCancel = () => {
        setOtp('')
        setIsVisible(false);
    };

    return (
        <div>
            <Modal
                title="Nhập mã OTP"
                open={isVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOtpSubmit}>
                        Xác nhận
                    </Button>,
                ]}
            >
                <p>Vui lòng nhập mã OTP đã được gửi đến số điện thoại của bạn.</p>
                <Input
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                />
            </Modal>

            <div className={cx('wrapper')}>
                <h2>Đăng ký</h2>
                <div id="sign-in-button"></div>
                <div className={cx('container')}>
                    <div className={cx('input')}>
                        <Input
                            className={cx('input-item')}
                            placeholder="Số điện thoại"
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        <Input
                            className={cx('input-item')}
                            placeholder="Tên người dùng"
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <Input.Password
                            className={cx('input-item')}
                            placeholder="Mật khẩu"
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Input.Password
                            className={cx('input-item')}
                            placeholder="Nhập lại mật khẩu"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <button className={cx('btn-register')} onClick={sendOTP}>
                            Đăng ký
                        </button>
                    </div>
                    <div className={cx('login')}>
                        Đã có tài khoản?
                        <a href='/login'>Đăng nhập</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
