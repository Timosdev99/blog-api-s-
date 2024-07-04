const express = require('express')
const Router = express.Router()
const jwt = require('jsonwebtoken')
const user = require('../MODELS/users')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env,
        pass: process.env
    }
});


Router.post('/register', async(req, res) => {


    try{
  const {username, email, password} = req.body

  const  salt = await bcrypt.genSalt(10)
  const hashpassword = await bcrypt.hash(password, salt)


  const newuser = new user({
    username, 
    email, 
    password: hashpassword });

    await newuser.save()
    res.status(201).json({
        message: 'user succesfully created'
    })

}  
 catch(err) {
    res.status(500).json({
        message: err.message
    })
 }

})

Router.post('/login', async(req, res) => {
    try{
        const {email, password} = req.body
        const existinguser = await user.findOne({email})

        if(!existinguser) {
            res.status(400).json(
                { message: "user does not exist"}
            )
        }

      const ismatch = await bcrypt.compare(password, existinguser.password)
      if(!ismatch) {
        res.status(400).json(
            { message: "user does not exist"}
        )
      }

      const token = jwt.sign({
        id: existinguser._id
      }, process.env.JWT_SECRET_KEY)

       res.status(200).json({
        token,
        existinguser,
        message: " user logged in succesfully"
       })

    }
    catch{

    }
})

Router.post('/sendotp', async (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const { email } = req.body;
    try {
        const mailOptions = {
            from: process.env,
            to: email,
            subject: 'OTP for verification',
            text: `Your OTP for verification is ${otp}`
        };

        


        transporter.sendMail(mailOptions,async function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({
                    message: error.message
                });
            } else {
                // save otp in db
                const user = await  User.findOne({ email });
                if(!user){
                    return res.status(400).json({
                        message: 'User not found'
                    });
                }
                user.otp = otp;
                user.save();

                console.log('Email sent: ' + info.response);
                res.json({
                    message: 'Email sent successfully',
                });
            }
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

Router.post('/changepassword', async (req, res) => {
    const {email , otp , newpassword} = req.body;
    try {
          const user = await User.findOne({ email });

            if(!user){  
                return res.status(400).json({
                    message: 'User not found'
                });
            }

            if(user.otp !== otp){
                return res.status(400).json({
                    message: 'Invalid OTP'
                });
            }

            user.password = newpassword;
            user.otp = null;
            await user.save();

            res.json({
                message: 'Password changed successfully'
            });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = Router 