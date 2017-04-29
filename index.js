const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./router');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config.json');

mongoose.Promise = global.Promise;
const conn = mongoose.connect(config.db);
mongoose.connection.once('connected', function() {
	console.log("Connected to database")
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
router(app);


app.listen(config.port);