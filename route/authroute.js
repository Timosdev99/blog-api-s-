const express = require('express')
const Router = express.Router()
const jwt = require('jsonwebtoken')
const user = require('../MODELS/users')
const bcrypt = require('bcrypt')


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



module.exports = Router 