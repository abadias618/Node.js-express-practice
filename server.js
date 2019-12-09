const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
//recognize body
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));
//session
var session = require('express-session');  
// set up sessions
app.use(session({
    name: 'server-session-cookie-id',
    secret: 'my express secret',
    saveUninitialized: true,
    resave: true,
}));
  


  app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
  //session
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

  app.post('/logout',(req,res)=>{
    var result = {success: false};
    if (req.session.user="admin") 
    {
        result={success: true};
        req.session.user=null;
    }
    res.json(result);
    
  })