const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./router');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config.json');
const socket = require('./socket')

mongoose.Promise = global.Promise;
const conn = mongoose.connect(config.db);
mongoose.connection.once('connected', function() {
	console.log("Connected to database")
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
router(app);

const server = app.listen(config.port);
socket(server)

console.log(process.argv)
if (process.argv[2] && process.argv[2] == 'populateTasks') {
	console.log('Populating tasks...')
	require('./populateTasks')
}
