const mongoose= require('mongoose')
const bcrypt = require('bcrypt')

const userschema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, 
{timestamps: true}
)


// userschema.pre('save', async function(next) {
//     const user = this;
//     if(user.isModified(password)) {

//         user.password = await bcrypt.hash(user.password, 8)


//     }

  
  

//     next()
// })




const user = mongoose.model('users', userschema)

module.exports = user;