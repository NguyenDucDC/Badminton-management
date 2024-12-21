import classNames from "classnames/bind";
import styles from "./ImageCircle.module.scss"

const cx = classNames.bind(styles)

function ImageCircle({ src, size }) {
    return (
        <div style={{ width: size, height: size }} className={cx('image')}>
            <img src={src} />
        </div>
    );
}

export default ImageCircle;