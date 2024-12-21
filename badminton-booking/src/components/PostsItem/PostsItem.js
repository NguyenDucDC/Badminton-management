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

    const popoverRef = useRef(null);
    const [showPopover, setShowPopover] = useState(false);
    const [isUser, setIsUser] = useState(false)

    const isoDate = posts.createdAt;
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('vi-VN', options);

    useEffect(() => {
        if (posts.user_id === userId) {
            setIsUser(true);
        }
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
                <pre>{posts.content}</pre>
                {posts.imageURLs.length > 0 ? (
                    <div className={cx('images')}>
                        {posts.imageURLs.map((imageURL, index) => (
                            <div key={index} className={cx('image-item')}>
                                <img src={imageURL} />
                            </div>
                        ))}
                    </div>  
                ) : null}

            </div>
        </div>
    );
}

export default PostsItem;