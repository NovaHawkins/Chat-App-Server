//const mongoose = require("mongoose")
const router = require("express").Router()

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// import middleware (?)

// import Models
const userSchema = require("../models/User")
const { error } = require("console")
//const roomSchema = require("../models/Room")
//const messageSchema = require("../models/Message")

// POST Create User
router.route("/register").post(async (req, res, next) => {
  //let password = req.body.password
  req.body.password = await bcrypt.hash(req.body.password, 10)
  
  // console.log(req.body)

  await userSchema
    .create(req.body)
    .then((newUser) => {
      const payload = { userId: newUser._id, username: newUser.username }
      let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d"})

      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      })

      //console.log(`TOKEN ${token}`)
      //cookie

      res.json({ user: newUser })
    })
  })/* .catch((error) => {
    res.json({ error:error.message })
    return next(error.message)
  }) */


// Post User Login
router.route("/login").post(async (req, res, next) => {
  const { username, password } = req.body

  await userSchema
    .findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Incorrect username or password" })
      }

      const passwordCorrect = bcrypt.compareSync(req.body.password, user.password)

      // password doesn't match
      if (!passwordCorrect) {
        return res
          .status(401)
          .json({ message: "Incorrect username or password" })
      }

      const payload = { userId: user._id, username: user.username }
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })

      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      })

      res.json({ user })
    })
    .catch((error) => {
      console.log(`Login Error ${error.message}`)
      return nextTick(error)
    })
      // res.send("login")
})

module.exports = router