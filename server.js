
var express = require('express');
const cookieParser = require('cookie-parser');

var {connect} = require('./config/db')
var cors = require('cors')
const configViewEngine = require('./config/configViewEngine')
const index = require('./routes/api')


// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions= { 
//     origin: true,
//     credentials: true // cấu hình để FE nhận dc cookies
//    };
  
//   callback(null, corsOptions);
// }

const whitelist = [
  'http://localhost:5174',
  'https://ba-gep3.onrender.com' // add chính domain đã deploy
];

var corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};


connect(); // kết nối mongo
var app = express();
var port = process.env.PORT || '3000'
const hostname = "localhost"


configViewEngine(app);
// cấu hình cookies để lấy làm refres_token
app.use(cookieParser());  
app.use(cors(corsOptionsDelegate));

/* 
   config req.body
*/
// app.use(express.static('./uploads'))
// app.use('/uploads', express.static('uploads'))
app.use('/uploads/images', express.static('uploads/images'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/* 
   web - router
*/
app.use('/', index);



// view engine setup

// app.listen(port,hostname, () => {
//   console.log(`Example app listening on port ${port},${hostname}`)
// })


module.exports = app;
