const bcrypt = require('bcryptjs');
const mongoose = require("mongoose")
const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  }, { 
    collection: 'users',
    timestamps:true 
  })
/*    userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12)
    next()
  }) */

module.exports = mongoose.model('User', userSchema)