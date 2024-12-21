
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Register.module.scss';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/auth';
import { auth } from '../../config/Firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { Modal, Input, Button, message, notification } from 'antd';


const cx = classNames.bind(styles);

function Register() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('+84333960103');
    const [password, setPassword] = useState('duc');
    const [confirmPassword, setConfirmPassword] = useState('duc');
    const [username, setUsername] = useState('duc');
    const [otp, setOtp] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    // Setup reCAPTCHA
    const setUpRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                console.log("Recaptcha verified");
            }
        });
    };

    // Gửi OTP
    const sendOTP = async () => {
        setUpRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        signInWithPhoneNumber(auth, phone, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setVerificationId(confirmationResult.verificationId);
                setIsVisible(true);
                message.success('OTP đã được gửi!');
            }).catch((error) => {
                console.log("error: ", error)
            });
    };

    // Xác minh OTP
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
        } catch (error) {
            console.error("Error verifying OTP", error);
            message.error('Xác minh OTP thất bại!');
        }
    };


    const handleRegister = async () => {

        console.log("dang ky thanh cong!")

        // if (!phone) {
        //     notification.error({
        //         message: `Error`,
        //         description: `Vui lòng nhập số điện thoại!`,
        //         placement: `bottomRight`,
        //         duration: 1.5,
        //     })
        //     return
        // } else if (!username) {
        //     notification.error({
        //         message: `Error`,
        //         description: `Vui lòng nhập tên người dùng!`,
        //         placement: `bottomRight`,
        //         duration: 1.5,
        //     })
        //     return
        // } else if (!password) {
        //     notification.error({
        //         message: `Error`,
        //         description: `Vui lòng nhập mật khẩu!`,
        //         placement: `bottomRight`,
        //         duration: 1.5,
        //     })
        //     return
        // } else if (!confirmPassword) {
        //     notification.error({
        //         message: `Error`,
        //         description: `Vui lòng nhập lại mật khẩu!`,
        //         placement: `bottomRight`,
        //         duration: 1.5,
        //     })
        //     return
        // }

        // try {
        //     if (password !== confirmPassword) {
        //         notification.error({
        //             message: `Error`,
        //             description: `Mật khẩu không trùng khớp, vui lòng nhập lại mật khẩu!`,
        //             placement: `bottomRight`,
        //             duration: 1.5,
        //         })
        //     } else {
        //         const res = await register(phone, username, password)

        //         if (res.status === 1) {
        //             navigate('/login')
        //             notification.success({
        //                 message: `Notification`,
        //                 description: `${res.message}`,
        //                 placement: `bottomRight`,
        //                 duration: 3,
        //             })
        //         } else {
        //             notification.error({
        //                 message: `Notification`,
        //                 description: `${res.message}`,
        //                 placement: `bottomRight`,
        //                 duration: 1.5,
        //             })
        //         }
        //     }

        // } catch {
        //     notification.error({
        //         message: `Notification`,
        //         description: `Đăng ký không thành công!`,
        //         placement: `bottomRight`,
        //         duration: 1.5,
        //     })
        // }
    }

    const handleCancel = () => {
        setIsVisible(false);
    };

    return (
        <>
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
                        <div className={cx('input-item')}>
                            <input
                                defaultValue='+84333960103'
                                placeholder="Số điện thoại"
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className={cx('input-item')}>
                            <input
                                defaultValue='duc'
                                placeholder="Tên người dùng"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className={cx('input-item')}>
                            <input
                                defaultValue='duc'
                                placeholder="Mật khẩu"
                                type='password'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className={cx('input-item')}>
                            <input
                                defaultValue='duc'
                                placeholder="Nhập lại mật khẩu"
                                type='password'
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
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
        </>
    );
}

export default Register;
