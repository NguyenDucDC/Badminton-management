import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardBody, CCardHeader } from '@coreui/react'
import { useParams } from 'react-router-dom';
import { getDetailFacility } from 'src/services/facility'
import FacilityInfo from 'src/components/facility-info/FacilityInfo'
import ListPersonnal from 'src/components/list-personnal/ListPersonnal'
import Price from 'src/components/price/Price'
import Calendar from 'src/components/calendar/Calendar'
import ImageFacility from 'src/components/imageFacility/ImageFacility'


function DetailFacility() {
    const { id } = useParams()
    const [data, setData] = useState()

    useEffect(() => {
        getFacility()
    }, [])

    const getFacility = async () => {
        try {
            const res = await getDetailFacility(id)
            if (res.status === 1) {
                setData(res.facility)
            }
        } catch (err) {
            console.log("err: ", err)
        }
    }

    return (
        <CRow>
            < FacilityInfo />
            < ListPersonnal data={data} />
            < Price />
            < Calendar data={data} />
            < hr />
            < ImageFacility />
        </CRow >
    );

}
export default DetailFacility
