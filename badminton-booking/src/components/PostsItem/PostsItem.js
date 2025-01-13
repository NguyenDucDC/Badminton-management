import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./PostsItem.module.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ImageCircle from "../ImageCircle/ImageCircle";
import { faTrash, faEllipsis, faPencil } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles)

function PostsItem({ posts, onDelete, onUpdate }) {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const params = useParams();
    const isoDate = posts.createdAt;
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('vi-VN', options);
    const data = posts.imageURLs;

    const popoverRef = useRef(null);
    const [showPopover, setShowPopover] = useState(false);
    const [isUser, setIsUser] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_CONTENT_LENGTH = 200;

    const maxImages = 4;
    const visibleImages = posts.imageURLs.slice(0, maxImages);
    const columns = Math.min(2, visibleImages.length);
    const rows = Math.ceil(visibleImages.length / columns);


    useEffect(() => {
        if (posts.user_id === userId) {
            setIsUser(true);
        }
        console.log("posts.imageURLs.length: ", posts.imageURLs.length)
    }, [params]);

    const handleNavigate = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setShowPopover(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popoverRef]);

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

    const handleToggleContent = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('user-posts')}>
                <div className={cx('user-info')} onClick={() => handleNavigate(`/profile/${posts.userId}`)}>
                    <div>
                        <ImageCircle src={posts.avatarURL} size={40} />
                    </div>
                    <div className={cx('username')}>
                        <p>{posts.username}</p>
                        <p>{formattedDate}</p>
                    </div>
                </div>

                {isUser && (
                    <div className={cx('ellipsis')} onClick={() => { setShowPopover(!showPopover) }} ref={popoverRef}>
                        <FontAwesomeIcon
                            icon={faEllipsis}
                            className={cx('icon')}
                        />
                        {showPopover && (
                            <div className={cx('popover-container')} >
                                <div className={cx('update-posts')} onClick={onUpdate}>
                                    <FontAwesomeIcon
                                        icon={faPencil}
                                        className={cx('icon')}
                                    />
                                    Chỉnh sửa bài viết
                                </div>
                                <div className={cx('delete-posts')} onClick={onDelete} >
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        className={cx('icon')}
                                    />
                                    Xoá bài viết
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
            <div className={cx('content')}>
                <pre>
                    {isExpanded
                        ? posts.content
                        : posts.content.slice(0, MAX_CONTENT_LENGTH) + (posts.content.length > MAX_CONTENT_LENGTH ? '...' : '')}
                </pre>

                {posts.content.length > MAX_CONTENT_LENGTH && (
                    <div onClick={handleToggleContent} className={cx('toggle-button')}>
                        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                    </div>
                )}
                {posts.imageURLs[0] !== null ? (
                    <div
                        className={cx('images')}
                        style={{
                            '--rows': rows,
                            '--row-height': posts.imageURLs.length <= 2 ? '500px' : '250px',
                            '--columns': columns,
                        }}
                    >
                        {posts.imageURLs.slice(0, 4).map((imageURL, index) => (
                            <div key={index} className={cx('image-item')}>
                                {index === 3 && posts.imageURLs.length > 4 ? (
                                    <div className={cx('more-images')}>
                                        <img src={imageURL} className={cx('image')} />
                                        <div
                                            className={cx('overlay')}
                                            onClick={() => handleImageClick(index)}
                                        >
                                            +{posts.imageURLs.length - 4}
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={imageURL}
                                        className={cx('image')}
                                        onClick={() => handleImageClick(index)}
                                    />
                                )}
                                
                            </div>
                        ))}
                    </div>
                ) : null}

                {currentImageIndex !== null && (
                    <div className={cx('fullscreen-overlay')} onClick={handleCloseFullScreen}>
                        <span className={cx('prev-arrow')} onClick={(e) => { e.stopPropagation(); showPrevImage(); }}>&#10094;</span>
                        <img
                            src={data[currentImageIndex]}
                            alt="Fullscreen"
                            className={cx('fullscreen-image')}
                        />
                        <span className={cx('next-arrow')} onClick={(e) => { e.stopPropagation(); showNextImage(); }}>&#10095;</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostsItem;