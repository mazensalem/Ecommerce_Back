const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.URI).then(_ => console.log('database connected'));

const express = require('express');
const app = express();
app.use(express.json())

app.use('/user', require('./users/user.route'));
app.use('/address', require('./address/address.routes'));


const appError = require('./utils/appError.util');
app.use((req, res, next) => {
    next(new appError('This route is not available', 404));
})
app.use(require('./middlewares/errorHandler'));



app.listen(process.env.PORT, _ => console.log(`server is running at ${process.env.PORT}`));
