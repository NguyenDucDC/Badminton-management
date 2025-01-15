import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ForgotPassword.module.scss';
import { useNavigate } from 'react-router-dom';
import { changePassword, checkAccount } from '../../services/auth';
import { auth } from '../../config/Firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { Modal, Input, Button, message, notification } from 'antd';

const cx = classNames.bind(styles);

function ForgotPassword() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [otp, setOtp] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);

    useEffect(() => {
        if (!window.recaptchaVerifier) {
            setUpRecaptcha();
        }
    }, []);

    const normalizePhoneNumber = (phoneNumber) => {
        let cleanedNumber = phoneNumber.replace(/\s+/g, '');  //loại bỏ khoảng trắng
        
        if (cleanedNumber.startsWith('+84')) {  // chuyển +84 thành đầu 0
            cleanedNumber = '0' + cleanedNumber.slice(3);
        }

        return cleanedNumber;
    };

    const handleCheckAccount = async () => {
        try {
            const res = await checkAccount(normalizePhoneNumber(phone))
            if (res.status === 1) {
                return true;
            } else {
                notification.error({
                    message: `Notification`,
                    description: `${res.message}`,
                    placement: `bottomRight`,
                    duration: 3,
                })
                return false;
            }
        } catch (err) {
            console.log(err)
        }
    }


    const setUpRecaptcha = () => {
        if (window.recaptchaVerifier) {
            return;
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
        if (!accountExists) {
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

    const formatPhoneNumber = (phoneNumber) => {
        if (phoneNumber.startsWith('0')) {
            return '+84' + phoneNumber.slice(1);
        }
        return phoneNumber;
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
            handleCancelOTP();
            setIsChangePassword(true);
        } catch (error) {
            console.error("Error verifying OTP", error);
            message.error('Xác minh OTP thất bại!');
        }
    };

    const handleValidate = () => {
        if (!phone) {
            notification.error({
                message: `Error`,
                description: `Vui lòng nhập đầy đủ thông tin!`,
                placement: `bottomRight`,
                duration: 3,
            })
            return false;
        }
        return true;
    }

    const handleChangePassword = async () => {
        if(password !== confirmPassword){
            notification.error({
                message: `Notification`,
                description: `Mật khẩu không khớp.`,
                placement: `bottomRight`,
                duration: 3,
            })
            return;
        }

        try {
            const res = await changePassword(normalizePhoneNumber(phone), password)
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
            handleCancelChangePassword()
        } catch {
            notification.error({
                message: `Notification`,
                description: `Đổi mật khẩu không thành công!`,
                placement: `bottomRight`,
                duration: 1.5,
            })
        }
    }

    const handleCancelOTP = () => {
        setOtp('')
        setIsVisible(false);
    };

    const handleCancelChangePassword = () => {
        setPassword('');
        setConfirmPassword('');
        setIsChangePassword(false);
    };

    return (
        <div>
            <Modal
                title="Nhập mã OTP"
                open={isVisible}
                onCancel={handleCancelOTP}
                footer={[
                    <Button key="back" onClick={handleCancelOTP}>
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

            <Modal
                title="Đổi mật khẩu"
                open={isChangePassword}
                onCancel={handleCancelChangePassword}
                footer={[
                    <Button key="back" onClick={handleCancelChangePassword}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleChangePassword}>
                        Xác nhận
                    </Button>,
                ]}
            >
                <Input.Password
                    className={cx('input-item')}
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Input.Password
                    className={cx('input-item')}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Modal>

            <div className={cx('wrapper')}>
                <h2>Quên mật khẩu</h2>
                <div id="sign-in-button"></div>
                <div className={cx('container')}>
                    <div className={cx('input')}>
                        <Input
                            className={cx('input-item')}
                            placeholder="Số điện thoại"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <button className={cx('btn-register')} onClick={sendOTP}>
                            Gửi OTP
                        </button>
                    </div>
                    <div className={cx('login')}>
                        Quay lại trang
                        <a href='/login'>Đăng nhập</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
