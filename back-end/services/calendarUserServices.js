const { Op } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('../models/customer');
const moment = require('moment-timezone');


// get all customer
exports.getCalendarByDate = async (facility_id, day) => {
  const date = moment(day).format('YYYY-MM-DD');

  const query = `
    SELECT 
      orders.id,
      orderCourts.checkIn,
      orderCourts.checkOut,
      orderCourts.court_id
    FROM orders
    JOIN orderCourts ON orderCourts.order_id = orders.id
    WHERE orders.facility_id = :facility_id
  `;

  const [results, metadata] = await sequelize.query(query, {
    replacements: { facility_id },
  });

  const filteredResults = results
    .filter(order => {
      const checkInMoment = moment(order.checkIn);
      const checkOutMoment = moment(order.checkOut);

      return checkInMoment.isSame(date, 'day') || checkOutMoment.isSame(date, 'day');
    })
    .map(order => ({
      ...order,
      checkIn: moment(order.checkIn),
      checkOut: moment(order.checkOut)
    }));

  return filteredResults;
};

// check calendar
exports.checkCalendar = async (data) => {
  const facilityId = data.facility;
  const checkIn = moment(data.checkIn).milliseconds(0).toISOString();
  const checkOut = moment(data.checkOut).milliseconds(0).toISOString();
  let court = [];

  // check lock facility
  const queryLock = `
    SELECT
      locks.id,
      locks.time_start,
      locks.time_end
    FROM locks
    LEFT JOIN lockFacilities ON lockFacilities.lock_id = locks.id
    WHERE 
      lockFacilities.facility_id = :facilityId 
      AND (
        (:checkIn >= locks.time_start AND :checkIn < locks.time_end)
        OR (locks.time_start >= :checkIn AND locks.time_start < :checkOut)
      )
  `

  const [results] = await sequelize.query(queryLock, {
    replacements: { facilityId, checkIn, checkOut },
  });

  if (results.length > 0) {
    court = data.court
    return court
  }

  await Promise.all(
    data.court.map(async (courtId) => {
      const query = `
        SELECT
          orderCourts.court_id,
          orderCourts.checkIn,
          orderCourts.checkOut
        FROM orders
        JOIN orderCourts ON orderCourts.order_id = orders.id
        WHERE 
          orders.facility_id = :facilityId 
          AND orderCourts.court_id = :courtId
          AND (
            (:checkIn >= orderCourts.checkIn AND :checkIn < orderCourts.checkOut)
            OR (orderCourts.checkIn >= :checkIn AND orderCourts.checkIn < :checkOut)
          )
      `;

      const [results] = await sequelize.query(query, {
        replacements: { facilityId, courtId, checkIn, checkOut },
      });

      results.forEach(order => {
        court.push(order.court_id);
      });
    })
  );

  return court;
};


// check calendar default month
exports.checkCalendarDefaultMonth = async (data, dates) => {
  const facilityId = data.facility;
  let court = [];

  const checkInMoment = moment(data.checkIn).tz("Asia/Ho_Chi_Minh");
  const checkOutMoment = moment(data.checkOut).tz("Asia/Ho_Chi_Minh");

  const hoursCheckIn = checkInMoment.hours();
  const hoursCheckOut = checkOutMoment.hours();

  for (let i = 0; i < dates.length; i++) {
    const date = moment(dates[i])

    let checkIn = date.clone().set({ hour: hoursCheckIn, minute: '00', second: '00' });
    let checkOut = date.clone().set({ hour: hoursCheckOut, minute: '00', second: '00' });

    checkIn = moment(checkIn).milliseconds(0).toISOString();
    checkOut = moment(checkOut).milliseconds(0).toISOString();

    // check lock facility
    const queryLock = `
      SELECT
        locks.id,
        locks.time_start,
        locks.time_end
      FROM locks
      LEFT JOIN lockFacilities ON lockFacilities.lock_id = locks.id
      WHERE 
        lockFacilities.facility_id = :facilityId 
        AND (
          (:checkIn >= locks.time_start AND :checkIn < locks.time_end)
          OR (locks.time_start >= :checkIn AND locks.time_start < :checkOut)
        )
    `

    const [results] = await sequelize.query(queryLock, {
      replacements: { facilityId, checkIn, checkOut },
    });

    if (results.length > 0) {
      court = data.court
      return court
    }

    // check order
    await Promise.all(
      data.court.map(async (courtId) => {
        const query = `
          SELECT
            orderCourts.court_id,
            orderCourts.checkIn,
            orderCourts.checkOut
          FROM orders
          JOIN orderCourts ON orderCourts.order_id = orders.id
          WHERE 
            orders.facility_id = :facilityId 
            AND orderCourts.court_id = :courtId
            AND (
              (:checkIn >= orderCourts.checkIn AND :checkIn < orderCourts.checkOut)
              OR (orderCourts.checkIn >= :checkIn AND orderCourts.checkIn < :checkOut)
            )
        `;

        const [results] = await sequelize.query(query, {
          replacements: { facilityId, courtId, checkIn, checkOut },
        });

        results.forEach(order => {
          court.push(order.court_id);
        });
      })
    );
  }

  return court;
};
