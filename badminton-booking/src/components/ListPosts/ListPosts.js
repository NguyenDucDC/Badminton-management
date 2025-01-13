import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from './ListPosts.module.scss';
import { useParams } from "react-router-dom";
import { getUser } from '../../services/user';
import { createPosts, getAllPosts, deletePosts, updatePosts } from "../../services/posts";
import PostsItem from "../PostsItem/PostsItem";
import { Modal, Input, Form, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import ImageCircle from "../ImageCircle/ImageCircle";
import image from "../../assets/image.png";
import { notification } from 'antd';
import { useAuth } from '../../context/AuthContext';
import InfiniteScroll from 'react-infinite-scroll-component';

const cx = classNames.bind(styles);

function ListPosts() {
    const params = useParams()
    const userId = localStorage.getItem('userId');
    const { isAuthenticated } = useAuth();

    const [data, setData] = useState([]);
    const [isCreatePosts, setIsCreatePosts] = useState(false);
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [update, setUpdate] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [modalDelete, setModalDelete] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        }
    }, [params]);

    const fetchProfile = async () => {
        try {
            const res = await getUser(userId)
            if (res.status === 1) {
                setData(res.user);
            }
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        handleGetAllPosts();
    }, [page]);

    // Tăng trang khi lướt tới cuối
    const loadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleGetAllPosts = async () => {
        console.log("get all posts")
        try {
            const res = await getAllPosts(page)
            if (res.status === 1) {
                const newPosts = res.posts;
                // setPosts((prevPosts) => [...prevPosts, ...newPosts]);

                setPosts((prevPosts) => {
                    const existingIds = new Set(prevPosts.map((post) => post.id));
                    const filteredPosts = newPosts.filter((post) => !existingIds.has(post.id));
                    return [...prevPosts, ...filteredPosts];
                });

                if (newPosts.length === 0) {
                    setHasMore(false);
                }
            }
        } catch (err) {
            console.log(err)
        }
    };

    const handleCreatePosts = async () => {
        const formData = new FormData();
        selectedImages.forEach((image) => {
            formData.append('images', image);
        });
        formData.append('content', content);
        setIsLoading(true);
        try {
            const res = await createPosts(formData)
            if (res.status === 1) {
                const newPost = res.newPost;
                setPosts((prevPosts) => [newPost, ...prevPosts]);
                handleCancelPosts()
                notification.success({
                    message: `Notification`,
                    description: `${res.message}`,
                    placement: `bottomRight`,
                    duration: 1.5,
                })
            }
        } catch (err) {
            notification.error({
                message: `Error`,
                description: `${err.message}`,
                placement: `bottomRight`,
                duration: 1.5,
            })
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePosts = async () => {
        const formData = new FormData();
        selectedImages.forEach((image) => {
            formData.append('images', image);
        });
        formData.append('oldImages', JSON.stringify(imagePreview));
        formData.append('content', content);

        try {
            const res = await updatePosts(update, formData)
            if (res.status === 1) {
                handleGetAllPosts()
                handleCancelPosts()
                notification.success({
                    message: `Notification`,
                    description: `${res.message}`,
                    placement: `bottomRight`,
                    duration: 1.5,
                })
            }
        } catch (err) {
            notification.error({
                message: `Error`,
                description: `${err.message}`,
                placement: `bottomRight`,
                duration: 1.5,
            })
        }
    };

    const removeImage = (indexToRemove) => {
        setSelectedImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };
    const removeImagePreview = (indexToRemove) => {
        setImagePreview(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const handleUploadImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.click();

        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            setSelectedImages(prevImages => [...prevImages, ...files]);
        };
    }

    const handleCancelPosts = () => {
        setUpdate('')
        setIsCreatePosts(false);
        setSelectedImages([]);
        setImagePreview([])
        setContent('');
    }

    const handlePreviewPost = async (posts) => {
        setUpdate(posts.id)
        setIsCreatePosts(true);
        setContent(posts.content);
        setImagePreview(posts.imageURLs);
    }

    const handleDeletePost = async (id) => {
        try {
            setIsLoading(true);
            const res = await deletePosts(id);
            if (res.status === 1) {
                setModalDelete('');
                setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
                notification.success({
                    message: `Notification`,
                    description: `${res.message}`,
                    placement: `bottomRight`,
                    duration: 3,
                })
            } else {
                console.log(res)
            }
        } catch (err) {
            console.log(err)
            notification.error({
                message: `Notification`,
                description: `${err.message}`,
                placement: `bottomRight`,
                duration: 3,
            })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cx('posts')}>
            <Modal
                title="Bạn có chắc muốn xoá bài viết này không?"
                open={modalDelete}
                closable={false}
                onCancel={() => setModalDelete('')}
                onOk={() => handleDeletePost(modalDelete)}
            >
                <div>
                    Hành động này không thể hoàn tác!
                </div>
            </Modal>

            <Modal
                open={isCreatePosts}
                footer={null}
                closable={false}
                onCancel={() => handleCancelPosts()}
            >
                <div className={cx('modal')}>
                    <div className={cx('title-modal')}>
                        <span>Tạo bài viết</span>
                        <div className={cx('icon-close')} onClick={() => handleCancelPosts()}>
                            <FontAwesomeIcon icon={faClose} className={cx('icon')} />
                        </div>
                    </div>
                    <div className={cx('body-modal')}>
                        <div className={cx('user-posts')}>
                            <div>
                                <ImageCircle src={data.avatarURL} size={40} />
                            </div>
                            <div className={cx('username')}>
                                {data.username}
                            </div>
                        </div>
                        <div className={cx('content')}>
                            <textarea
                                placeholder="Bạn đang nghĩ gì?"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />

                            <div className={cx('image-preview')}>
                                {selectedImages && selectedImages.map((image, index) => (
                                    <div key={index} className={cx('image-container')}>
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`selectedImages-${index}`}
                                            className={cx('preview-image')}
                                        />
                                        <button
                                            className={cx('remove-button')}
                                            onClick={() => removeImage(index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {update && imagePreview && (
                                <div className={cx('image-preview')}>
                                    {imagePreview.map((image, index) => (
                                        image && (
                                            <div key={index} className={cx('image-container')}>
                                                <img
                                                    src={image}
                                                    alt={`imagePreview-${index}`}
                                                    className={cx('preview-image')}
                                                />
                                                <button
                                                    className={cx('remove-button')}
                                                    onClick={() => removeImagePreview(index)}
                                                >
                                                    X
                                                </button>
                                            </div>
                                        )
                                    ))}
                                </div>
                            )}


                        </div>
                        <div className={cx('more')}>
                            <p>Thêm vào bài viết của bạn</p>
                            <div className={cx('image')} onClick={() => handleUploadImage()}>
                                <img src={image} />
                            </div>
                        </div>
                    </div>
                    {update ? (
                        <button
                            className={cx('btn-create')}
                            onClick={handleUpdatePosts}
                        >
                            Cập nhật
                        </button>
                    ) : (
                        <button
                            className={cx('btn-create')}
                            onClick={handleCreatePosts}
                        >
                            Đăng
                        </button>
                    )}

                </div>
            </Modal>

            {isLoading && (
                <div className={cx('loading')}>
                    <Spin size="large" tip="Đang xử lý..." />
                </div>
            )}

            {data.role === 'sale' && (
                <div className={cx('header-posts')}>
                    <div className={cx('avt')}>
                        <ImageCircle src={data.avatarURL} size={40} />
                    </div>
                    <div className={cx('add-posts')} onClick={() => setIsCreatePosts(true)}>
                        <p>Tạo bài đăng</p>
                    </div>
                </div>
            )}

            <InfiniteScroll
                dataLength={posts.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<h4>Đang tải...</h4>}
                endMessage={<p>Đã hiển thị toàn bộ bài đăng!</p>}
            >
                {posts && posts.map((postsItem, index) => (
                    <div key={index} className={cx('posts-item')}>
                        <PostsItem
                            posts={postsItem}
                            key={postsItem.id}
                            onDelete={() => setModalDelete(postsItem.id)}
                            onUpdate={() => handlePreviewPost(postsItem)}
                        />
                    </div>
                ))}
            </InfiniteScroll>


        </div>
    )
}

export default ListPosts;
