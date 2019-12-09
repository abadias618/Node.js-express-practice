//db setup pgsql
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
//templating engine
//-------------------------------------------------------------
//  LANDING PAGES
//-------------------------------------------------------------
//landing page route
app.get('/', (req, res) => res.render('pages/landingpage'));
//admin page route
app.get('/admin', (req, res) => res.render('pages/adminpage'));
//session login route
app.post('/login',(req,res)=>{
var result = {success: false};
console.log(req.body.username);
console.log(req.body.password);
if (req.body.username == "admin" && req.body.password == "password") 
{
    result={success: true};
    req.session.user="admin";
}
res.json(result);

})
//session logout route
app.post('/logout',(req,res)=>{
var result = {success: false};
if (req.session.user="admin") 
{
    result={success: true};
    req.session.user=null;
}
res.json(result);

})

