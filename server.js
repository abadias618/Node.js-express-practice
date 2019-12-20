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
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
//-------------------------------------------------------------
//  LANDING PAGES
//-------------------------------------------------------------
//landing page route
app.get('/', (req, res) => res.render('pages/landingpage'));
//admin page route
app.get('/admin', (req, res) => res.render('pages/adminpage'));

app.post('/adminLog', async (req, res) => {
  if (req.body.username && req.body.password) {
    try {
      var response = await pool.query('SELECT password FROM admin_table WHERE password = $1',[req.body.password]);
      console.log(response.rows[0]);
      if (response.rowCount > 0 && response.rows[0].password==req.body.password) {
        console.log('success login');
        req.session.user="admin";
        res.json({redirect: '/successfulLogin', 
        success: true});
        console.log('after res.json');
      }
      else {
        console.log('unsuccsess login');
        req.session.user=null;
        res.json({redirect: '/unsuccessfulLogin',
        success: false});
        console.log('after res.json');
      }
    } catch (error) {
      console.log(error);
    }
  } 
    
});

app.get('/successfulLogin', (req, res) => res.render('pages/successfulLogin'));
app.get('/unsuccessfulLogin', (req, res) => res.render('pages/unsuccessfulLogin'));
app.get('/submitNewElement', (req, res) => res.render('pages/submitNewElement'));

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

app.get('/inventory', (req, res) => res.render('pages/adminInventory'));
app.get('/getInventory', async (req, res) => {
  var result = await pool.query("SELECT * FROM main_table");
  console.log(result);
  console.log(typeof(result));
  res.render('pages/adminInventory', result, rmWhitespace);
  /*res.write("<table>");
    res.write("<tr>");
    for(var column in result.fields){
        res.write("<td><label>" + result.fields[column].name + "</label></td>");
    }
    res.write("</tr>");
    for(var row in result.rows){
        res.write("<tr>");
        for(var column in result.rows[row]){
            res.write("<td><label>" + result.rows[row][column] + "</label></td>");       
        }
        res.write("</tr>");         
    }
    res.write("</table>");*/
  });