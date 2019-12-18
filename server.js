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
app.post('/adminLog', (req, res) => 
{
    console.log(req.body.username);
    console.log(req.body.password);
    /*pool.connect();
    async function executeValidate()
    {
      try {
          
          const result = pool.query('SELECT password FROM admin_table WHERE username = $1', [req.body.username], (err, res) => {
            done();
          if (err) {
            console.log(err.stack);
          }
          else {
            
            //
            return res.rows[0];
          }
        });
        console.log('this is the pass variable ', result.password);
        
        return result;
      } catch (error) {
        console.log(error);
      }
    }
    const passwd = pool.connect( function(err){
      if(err) throw err;
      pool.query('SELECT password FROM admin_table WHERE username = $1',[req.body.username],(err, res) => {
        if (err) {
          console.log(err.stack)
        } else {
          var pass=res.rows[0];
          console.log('this is the pass variable ',pass.password);
        }
        
      });
      return pass;
    });
    
      //pool.end();
    var resultFromServer = {success: false};
    const resul=executeValidate();
    pool.end();
    */
  pool
    .query('SELECT password FROM admin_table WHERE username = $1',[req.body.username])
    .then (res => console.log(res.rows[0]))
    .then (async function(){
          if (res.rows[0]==req.body.password) 
          {
              req.session.user="admin";
              //resultFromServer={success: true};
              console.log('successful login!!!');
              res.render('pages/successfullogin');
              
          }
          else
          {
              res.render('pages/unsuccesfullLogin');
          }
    })
    .catch(err=>
      setImmediate(()=>{
        throw err;
      })
      )
    
    
    //res.json(resultFromServer);
}
);


