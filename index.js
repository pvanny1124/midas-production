const express           = require("express");
const http              = require("http");
const socketIo          = require("socket.io");
const fetch             = require('isomorphic-fetch');
const app               = express();
const controllers       = require('./controllers');
const models            = require('./models');
const cookieParser      = require('cookie-parser');
const expressSession    = require('express-session');
const passport          = require('./middlewares/auth');
const rp                = require('request-promise');
const cheerio           = require('cheerio');
const Table             = require('cli-table');
const Users             = require('./models/users');
const bodyParser        = require('body-parser');
const iextrading        = require('./helpers/interactions/iex_interactions');
const redis             = require('redis');
const DOMParser         = require('xmldom').DOMParser;
const util              = require('util');
const inspect           = require('eyes').inspector({maxLength: false}) //used to color and format json output in the console.
const exec              = require('child_process').exec;
const parseString       = require('xml2js').parseString;
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.HEROKU_POSTGRESQL_GOLD_URL,
  ssl: true,
});

client.connect();

var text, parser, xmlDoc;
parser = new DOMParser();

// const command = "curl \"http://wu-quotes.apple.com/dgw?imei=42&apptype=finance\" -H \"Content-type: text/xml\" -d \"<?xml version='1.0' encoding='utf−8'?><request devtype='Apple_OSX' deployver='APPLE_DASHBOARD_1_0' app='YGoAppleStocksWidget' appver='unknown' api='finance' apiver='1.0.1' acknotification='0000'><query id='0' timestamp='`date +%s000`' type='getquotes'><list><symbol>GE</symbol></list></query></request>\"";

// child = exec(command, function(error, stdout, stderr){

//             //convert stdout into xml
//             xmlDoc = parser.parseFromString(stdout,"text/xml");
            
//             //turn xmlDoc into JSON
//             parseString(xmlDoc, function (err, result) {
              
//               inspect(result) //Check output on console

//               //check status code that tells you whether the market is open or not.
//               console.log(result.response.result[0].list[0].quote[0].status[0]); 
//               console.log(util.inspect(result, false, null)) //another way to look at the entire json object
//               //used to display part of the [Object] object..only goes 2 levels deep though.
//               //That's why using the eyes framework works best to view the entire thing!
//             });

//             if(error !== null)
//             {
//                 console.log('exec error: ' + error);
//             }

// });
/*******************Basic Setup and Configuration**********************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(expressSession(({
  secret: 'keyboard cat - REPLACE ME WITH A BETTER SECRET',
  resave: false,
  saveUninitialized: true,
})));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "https://aqueous-castle-51032.herokuapp.com" //our app name
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
 
  app.use(express.static('midas-client/build')); 
  // app.get('*', (req, res) => {
  //   res.sendFile(path.resolve(__dirname, 'midas-client', 'build', 'index.html'));
  // });
}

// app.use(function(req, res, next) {  

//   //Following is needed to allow a fetch put request to work on the client side:

//     //Website you wish to allow to connect
//     var allowedOrigins = ['http://127.0.0.1:3001', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://localhost:3000'];
//     var origin = req.headers.origin;
  
//     if(allowedOrigins.indexOf(origin) > -1){
//          res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     next();
// });  

app.use(controllers)

const server = http.createServer(app);
const io = socketIo(server); 

/*****************************************Redis Configuration*******************************/

// var client = redis.createClient();
//     client.on('error', function(err){
//       console.log('Something went wrong ', err)
//     });

//     client.set('my test key', 'my test value', redis.print);
//     client.get('my test key', function(error, result) {
//       if (error) throw error;
//       console.log('GET result ->', result)
// });

// /*************************************Socket Configuration*******************************/
io.on("connection", socket => {

      console.log("New client connected");

      let interval;

      socket.on("get quote", (ticker) => {
            if (interval) clearInterval(interval);
            interval = setInterval(() => getStockPriceAndEmit(socket, ticker), 104);
      });

      socket.on("disconnect sim", () => {
          clearInterval(interval);
      })
      
      socket.on("disconnect", () => {
          clearInterval(interval);
        console.log("Client disconnected");
      });

});

/*******************WEB SCRAPING THE NYSE STATUS***************************/

// var options = {
//   url: 
// }

// First, make sure the Database tables and models are in sync
// then, start up the server and start listening.
models.sequelize.sync({force: false})
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Server is up and running on...`)
    });
  });


/******************************Helper Functions*************************************/

const getStockPriceAndEmit = async (socket, ticker) => {
    try {
      const res = await iextrading.getStockPrice(ticker); // Getting the data from DarkSky
      console.log(res);
      socket.emit("stock price", res); // Emitting a new message to the client

    } catch (error) {
      console.error(`Error: ${error.code}`);
    }
  };




