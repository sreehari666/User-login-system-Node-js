var express = require('express');
var router = express.Router();
const authFunctions = require('../functions/authFunctions')


const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* GET home page. */
router.get('/',verifyLogin, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login',(req,res)=>{
  res.render('login')
})

router.get('/signup',(req,res)=>{
  res.render('signup')
})

router.post('/login',(req,res)=>{
  console.log(req.body)
  authFunctions.doLogin(req.body).then((response) => {
    console.log('response')
    console.log(response)
    if (response.status) {

      req.session.user = response.user
      req.session.loggedIn = true
      res.redirect('/')
    } else {
      req.session.loginUserErr = "Invalid username or password"
      console.log("error in login")
      let Error = 'Login failed'
      res.render('login',{Error})
    }
  })
  
})
router.post('/signup',(req,res)=>{
  console.log(req.body)
   authFunctions.checkUser(req.body).then((response) => {

     if (response) {
      let Error='You already have an account'
      res.render('signup',{Error})
     } else {
      authFunctions.doSignup(req.body).then((response) => {

        console.log("do signup")
        console.log(response)

        req.session.user = response
        req.session.loggedIn = true
        

        if (response) {
          res.redirect('/')
        } else {
          let Error='Signup failed'
          res.render('signup',{Error})
        }
      })
    }

  })
  
})
router.get('/logout', (req, res) => {
  req.session.loggedIn = null
  res.redirect('/login')
})
module.exports = router;
