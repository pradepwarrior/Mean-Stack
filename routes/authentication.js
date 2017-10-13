const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/databse')
module.exports = (router) => {

    router.post('/register', (req, res) => {

        if (!req.body.email) {
            res.json({ success: false, message: 'enter e-mail' })
        } else if (!req.body.username) {
            res.json({ success: false, message: 'enter username' })
        } else if (!req.body.password) {
            res.json({ success: false, message: 'enter password' })
        } else {
            let user = new User({
                email: req.body.email.toLowerCase(),
                username: req.body.username.toLowerCase(),
                password: req.body.password
            })
            user.save((err) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({ success: false, message: 'User Already Added' })
                    } else {
                        res.json({ success: false, message: 'User not saved' + err })
                    }
                } else {
                    res.json({ success: true, message: 'Account Registered!' })
                }
            })
        }

    });

    //check email available
    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) {
            res.json({ success: false, message: 'Email not Provided' })
        } else {
            User.findOne({ email: req.params.email }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err })
                } else {
                    if (user) {
                        res.json({ success: false, message: 'Email Already Added' })
                    } else {
                        res.json({ success: true, message: 'Email Available' })
                    }
                }
            })
        }
    });
    //check username available
    router.get('/checkUsername/:username', (req, res) => {
        console.log(req.params.username)
        if (!req.params.username) {
            res.json({ success: false, message: 'Username not Provided' })
        } else {
            User.findOne({ username: req.params.username }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err })
                } else {
                    if (user) {
                        res.json({ success: false, message: 'Username Already Added' })
                    } else {
                        res.json({ success: true, message: 'Username Available' })
                    }
                }
            })
        }
    })

    //login verification

    router.post('/login', (req, res) => {
        if (!req.body.username) {
            res.json({ success: false, message: 'Username not Provided' })
        } else {
            if (!req.body.password) {
                res.json({ success: false, message: 'Password not Provided' })
            } else {
                User.findOne({ username: req.body.username }, (err, user) => {
                    console.log(user)
                    if (err) {
                        res.json({ success: false, message: err })
                    } else {
                        if (!user) {
                            res.json({ success: false, message: "User not Available" })
                        } else {
                            console.log(req.body.password)
                            const validPassword = user.comparePassword(req.body.password)
                            if (!validPassword) {
                                res.json({ success: false, message: "Password Invalid" })
                            } else {
                                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' })
                                res.json({ success: true, message: "Success!", token: token, user: { username: user.username } })
                            }
                        }
                    }

                })
            }
        }
    })

    router.use((req, res, next) => {
        const token = req.headers['authorization']
        if (!token) {
            res.json({ success: false, message: "No Token Provided" })
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({ success: false, message: "Token Invalid" + err })
                } else {
                    req.decoded=decoded;
                    next()
                }
            })
        }
    })

    router.get('/profile', (req, res) => {
        User.findOne({_id:req.decoded.userId}).select('username email').exec((err,user)=>{
            if(err){
                res.json({ success: false, message: "No Token Provided" })
            }else{
                if(!user){
                    res.json({ success: false, message: "User Not Found" })
                }else{
                    res.json({success:true,user:user})
                }
            }
        })
    })

    return router;


}