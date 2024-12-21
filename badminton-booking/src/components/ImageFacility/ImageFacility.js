import React, { useEffect, useState } from 'react';
import { getImageFacility } from 'src/services/facility';
import { useParams } from 'react-router-dom';
import styles from "./ImageFacility.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function ImageFacility() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(null);

    useEffect(() => {
        handleGetImageFacility();
    }, []);

    const handleGetImageFacility = async () => {
        try {
            const res = await getImageFacility(id);
            if (res.status === 1) {
                setData(res.imageUrls);
            }
        } catch (err) {
            console.error("err: ", err);
        }
    };

    const handleImageClick = (index) => {
        setCurrentImageIndex(index); // Khi click, lưu index của ảnh
    };

    const handleCloseFullScreen = () => {
        setCurrentImageIndex(null); // Đóng ảnh full màn hình
    };

    const showNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % data.length); // Chuyển sang ảnh tiếp theo
    };

    const showPrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length); // Quay về ảnh trước
    };

    return (
        <>
            <div className={cx('image-facility')}>
                <div className={cx('title')}>Ảnh sân</div>
                <div className={cx('image')}>
                    {data && data.map((image, index) => (
                        <div key={image.id} className={cx('list-image')}>
                            <img
                                src={image.imageURL}
                                className={cx('image-item')}
                                onClick={() => handleImageClick(index)}
                                alt="Facility"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {currentImageIndex !== null && (
                <div className={cx('fullscreen-overlay')} onClick={handleCloseFullScreen}>
                    <span className={cx('prev-arrow')} onClick={(e) => { e.stopPropagation(); showPrevImage(); }}>&#10094;</span>
                    <img
                        src={data[currentImageIndex].imageURL}
                        alt="Fullscreen"
                        className={cx('fullscreen-image')}
                    />
                    <span className={cx('next-arrow')} onClick={(e) => { e.stopPropagation(); showNextImage(); }}>&#10095;</span>
                </div>
            )}
        </>
    );
}

export default ImageFacility;
