import React, { useEffect, useState } from 'react';
import classNames from "classnames/bind";
import styles from "./HomePage.module.scss";
import { getAllFacility } from '../../services/facility';
import Facility from '../../components/Facility/Facility';
import Banner from '../../components/Banner/Banner';
import ListPosts from '../../components/ListPosts/ListPosts';

const cx = classNames.bind(styles)

function HomePage() {
    const [facilities, setFacilities] = useState([])

    useEffect(() => {
        handleGetAllFacility()
    }, [])

    const handleGetAllFacility = async () => {
        try {
            const res = await getAllFacility()
            if (res.status === 1) {
                setFacilities(res.facilities)
            }
        } catch (error) {
            console.log("err: ", error)
        }
    }
    return (
        <div className={cx('home-container')}>
            <Banner />
            <div className={cx('home-content')}>
                <div className={cx('list-facility')}>
                    <div className={cx('title')}>Danh sách các cơ sở</div>
                    {facilities.map((facility, index) => (
                        <Facility key={facility.id} data={facility} index={index} />
                    ))}
                </div>
                <div className={cx('list-posts')}>
                    <ListPosts />
                </div>
            </div>

        </div>
    )

}

export default HomePage;
