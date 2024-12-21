import React, { useEffect, useState } from 'react';
import classNames from "classnames/bind";
import styles from "./DetailFacility.module.scss";
import { useParams } from 'react-router-dom';
import { getDetailFacility } from '../../services/facility';
import Calendar from '../../components/Calendar/Calendar';
import Price from '../../components/Price/Price';
import ImageFacility from '../../components/ImageFacility/ImageFacility';
import Contact from '../../components/Contact/Contact';

const cx = classNames.bind(styles)

function Facility() {
    const { id } = useParams();
    const [data, setData] = useState({})

    useEffect(() => {
        handleDetailFacility()
    }, [])

    const handleDetailFacility = async () => {
        try {
            const res = await getDetailFacility(id)
            if (res.status === 1) {
                // console.log("check res: ", res)
                setData(res.facility)
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    return (
        <div className={cx('detail-facility')}>
            < Contact data={data} />
            <hr />
            < ImageFacility />
            <hr />
            < Price />
            <hr />
            < Calendar data={data} />
        </div>
    )

}

export default Facility;
