import express from "express"
import UserController from "../controllers/user.controller.js"
import passport from "passport"


const router = express.Router()

const userController = new UserController()

router.get('/',(req,res)=>{
    userController.getFirstView(req,res)
});

router.get('/register',(req,res)=>{
    userController.getSignUp(req,res)
});
router.post('/register',(req,res)=>{
    userController.postSignUp(req,res)
});
router.get('/login',(req,res)=>{
    userController.getSignIn(req,res)
});
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }));

  router.get('/logout',(req,res)=>{
    userController.signOut(req,res)
});

router.get('/reset-password', (req, res) => {
    userController.getResetPassword(req, res);
  });
  
router.post('/reset-password', (req, res) => {
    userController.postResetPassword(req, res);
  });
  
router.get('/reset-password/:token', (req, res) => {
    userController.getNewPassword(req, res);
  });
  
router.post('/reset-password/:token', (req, res) => {
    userController.postNewPassword(req, res);
  });




export default router;