import Header from "../../components/Header/Header"
import classNames from "classnames/bind"
import styles from "./DefaultLayout.module.scss"

const cx = classNames.bind(styles)

function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <div className={cx('content')}>
                {children}
            </div>
        </div>
    );
}

export default DefaultLayout;
