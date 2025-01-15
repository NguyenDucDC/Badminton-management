const express = require('express')
const app = express()

const port = 3001

var connection = require('./config/connect.js')
var bodyParser = require('body-parser')
var cors = require('cors')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// system router
const AuthRouter = require('./routes/authRouter.js')
const ProfileRouter = require('./routes/profileRouter.js')
const FacilityRouter = require('./routes/facilityRouter.js')
const ManagerRouter = require('./routes/managerRouter.js')
const SalesRouter = require('./routes/salesRouter.js')
const OrderRouter = require('./routes/orderRouter.js')
const CustomerRouter = require('./routes/customerRouter.js')
const CalendarRouter = require('./routes/calendarRouter.js')
const StatisticsRouter = require('./routes/statisticsRouter.js')
const IncomeExpenditureRouter = require('./routes/incomeExpenditureRouter.js')

// user router
const AuthUserRouter = require('./routes/authUserRouter.js')
const UserRouter = require('./routes/userRouter.js')
const FacilityUserRouter = require('./routes/facilityUserRouter.js')
const CalendarUserRouter = require('./routes/calendarUserRouter.js')
const SalesUserRouter = require('./routes/salesUserRouter.js')
const OrderUserRouter = require('./routes/orderUserRouter.js')
const CustomerUserRouter = require('./routes/customerUserRouter.js')
const PaymentUserRouter = require('./routes/paymentUserRouter.js')
const PostsRouter = require('./routes/postsRouter.js')

// api system
app.use('/api/auth', AuthRouter);
app.use('/api/profile', ProfileRouter);
app.use('/api/facility', FacilityRouter);
app.use('/api/manager', ManagerRouter);
app.use('/api/sales', SalesRouter);
app.use('/api/order', OrderRouter);
app.use('/api/customer', CustomerRouter);
app.use('/api/calendar', CalendarRouter);
app.use('/api/statistics', StatisticsRouter);
app.use('/api/income-expenditure', IncomeExpenditureRouter);

//api user
app.use('/user/auth', AuthUserRouter);
app.use('/user/user', UserRouter);
app.use('/user/facility', FacilityUserRouter);
app.use('/user/calendar', CalendarUserRouter);
app.use('/user/sales', SalesUserRouter);
app.use('/user/order', OrderUserRouter);
app.use('/user/payment', PaymentUserRouter);
app.use('/user/customer', CustomerUserRouter);
app.use('/user/posts', PostsRouter);

app.listen(port, '127.0.0.1', () => {
    console.log(`Example app listening on port ${port}`)
    connection.connect(function (err) {
        if (err) throw err;
        console.log("database connected!")
    })
})