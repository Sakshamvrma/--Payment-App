const mongoose=require('mongoose');
mongoose.connect(`mongodb+srv://sakshamvrma9:hVf5My7rlOUvhUc1@cluster0.8ympiub.mongodb.net/`)
const UserSchema=mongoose.Schema({
  firstname:{
    type:String,
    required:true,
    maxLength:15
  },
  lastname:{
    type:String
  },
  username:{
    type:String,
    required:true,
    unique:true,
    minLength:6,
    maxLength:30,
    lowercase:true
  },
  password:{
    type:String,
    required:true,
    minLength:6
  }

})
const User=mongoose.model('UserModel',UserSchema);
module.exports={User};