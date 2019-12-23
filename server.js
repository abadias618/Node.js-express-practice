//db setup pgsql
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://hbohzckjefyygp:15b846561384e1f92ca1ca16d6537bb4d54e9cdba26c0b24e4187e1c68881382@ec2-174-129-255-7.compute-1.amazonaws.com:5432/d8j0bkorbigoko', //process.env.DATABASE_URL,
  ssl: true
});

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
const ejslayouts = require('express-ejs-layouts');
const session = require('express-session');
const bodyParser = require('body-parser');
//to use json ecoded bodies
app.use(express.json());
//recognize body
app.use(express.urlencoded({ extended: true }));
//setup paths for public and views folders 
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
//setting template engine
app.set('view engine', 'ejs');
// set up sessions
app.use(session({
  name: 'server-session-cookie-id',
  secret: 'my express secret',
  saveUninitialized: true,
  resave: true,
}));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
//-------------------------------------------------------------
//  LANDING PAGE
//-------------------------------------------------------------
app.get('/',(req, res) =>{res.render('pages/landingpage')} );
//-------------------------------------------------------------
//  ADMIN LOGIN PAGE
//-------------------------------------------------------------
app.get('/admin', (req, res) => res.render('pages/adminpage'));
//-------------------------------------------------------------
//  VALIDATE LOGIN INFO (NOT SHOWN TO THE USER)
//-------------------------------------------------------------

app.post('/adminLog', getPass);

//PROCESS THE DATA FROM DB
function getPass(req, res) {
  if (req.body.username && req.body.password) {
    pool.query('SELECT password FROM admin_table WHERE password = $1', [req.body.password], function (err, response) {
      if (err) {
        console.log(err);
      }
      else {
        main(response, req, res);
      }
    });
  }
}
//MAIN LOGIC FOR CREDENTIAL VALIDATION
function main(response,req,res) {
  console.log(response.rows[0]);
  if (response.rowCount > 0 && response.rows[0].password == req.body.password) {
    console.log('success login');
    req.session.user = "admin";
    var result = { success: true , redirect: '/getInventory'};
    res.json(result);
  }
  else {
    console.log('bad login');
    req.session.user = "";
    var result = { success: false };
    res.json(result);
  }
}
//-------------------------------------------------------------
//  SUBMIT AN ELEMENT TO BE INSERTED TO INVENTORY PAGE
//-------------------------------------------------------------
app.get('/submitNewElement', (req, res) => res.render('pages/submitNewElement'));
//-------------------------------------------------------------
//  INSERT A NEW ITEM TO INVENTORY PAGE
//-------------------------------------------------------------
app.post('/insert', (req, res) => {

  try {

    var name = req.body.name;

    var color = req.body.color;

    var size = req.body.size;

    var url = req.body.url;



    var response = pool.query('INSERT INTO main_table (shoe_name,shoe_color,shoe_size,shoe_url) VALUES ($1,$2,$3,$4)',[name,color,size,url]);

    if (response) {

      console.log('done;');

    }

    res.json({success: true});

    console.log('success inserting');

     

  } catch (error) {

    console.log(error);

  }

});
//-------------------------------------------------------------
//  INVENTORY PAGE
//-------------------------------------------------------------
app.get('/inventory', (req, res) => res.render('pages/adminInventory'));
//-------------------------------------------------------------
//  GET THE INVENTORY FROM DB (NOT SHOWN TO THE USER)
//-------------------------------------------------------------

app.get('/getInventory', async (req, res) => {

  var resultsDb = await pool.query("SELECT * FROM main_table");

  //var to send to the render page
  result={result: resultsDb};

  res.render('pages/adminInventory', result);

  });