const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const config = require('../config/databse')
module.exports = (router) => {
    /////////////create blog//////
    router.post('/newBlog', (req, res) => {
        if (!req.body.title) {
            res.json({ success: false, message: "Blog Title is Required" })
        } else {
            if (!req.body.body) {
                res.json({ success: false, message: "Blog Body is Required" })
            } else {
                if (!req.body.createdBy) {
                    res.json({ success: false, message: "Blog Creator is Required" })

                } else {
                    const blog = new Blog({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy
                    });
                    blog.save((err) => {
                        if (err) {
                            res.json({ success: false, message: err })
                        } else {
                            res.json({ success: true, message: "Blog Saved" })
                        }
                    })
                }
            }
        }
    })
    /////get all blog
    router.get('/allBlogs', (req, res) => {
        Blog.find({}, (err, blogs) => {
            if (err) {
                res.json({ success: false, message: err })
            } else {
                if (!blogs) {
                    res.json({ success: true, message: "No Blogs Saved" })
                } else {

                    res.json({ success: true, blogs: blogs })
                }

            }
        }).sort({ '_id': -1 })
    })
    ////////////get single blog for edit///////////
    router.get('/singleBlog/:id', (req, res) => {

        if (!req.params.id) {
            res.json({ success: true, message: "No Blogs Id Provided" })
        } else {
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: "Not a Valid blog Id" })
                } else {
                    if (!blog) {
                        res.json({ success: true, message: "Blog Not Found---" })

                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err })
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: "Unable to Authenticate User" })
                                } else {
                                    if (user.username !== blog.createdBy) {
                                        res.json({ success: false, message: "you are Not Autherorized to Edit" })
                                    } else {
                                        res.json(({ success: true, blog: blog }))
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    })

    //////////update blog///////////
    router.put('/updateBlog', (req, res) => {
        if (!req.body._id) {
            res.json({ success: true, message: "No Blogs Id Provided" })
        }
        else {
            Blog.findOne({ _id: req.body._id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: "Not a Valid blog Id" })
                } else {
                    if (!blog) {
                        res.json({ success: true, message: "Blog Not Found" })
                    } else {
                        User.findOne({ _id: req.decoded.userId }, (err, user) => {
                            if (err) {
                                res.json({ success: false, message: err })
                            } else {
                                if (!user) {
                                    res.json({ success: false, message: "Unable to Authenticate User" })
                                } else {
                                    if (user.username !== blog.createdBy) {
                                        res.json({ success: false, message: "you are Not Autherorized" })
                                    } else {
                                        blog.title = req.body.title;
                                        blog.body = req.body.body
                                        blog.save((err) => {
                                            if (err) {
                                                res.json({ success: false, message: err })
                                            } else {
                                                res.json({ success: true, message: "Blog updated" })
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    })
//////////delete blog//////


router.delete('/deleteBlog/:id',(req,res)=>{
    if (!req.params.id) {
        res.json({ success: true, message: "No Blogs Id Provided" })
    }
    else {
        Blog.findOne({ _id: req.params.id }, (err, blog) => {
            if (err) {
                res.json({ success: false, message: "Not a Valid blog Id" })
            } else {
                if (!blog) {
                    res.json({ success: true, message: "Blog Not Found" })
                } else {
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        console.log( req.decoded.userId)
                        if (err) {
                            res.json({ success: false, message: err })
                        } else {
                            if (!user) {
                                res.json({ success: false, message: "Unable to Authenticate User" })
                            } else {
                                if (user.username !== blog.createdBy) {
                                    res.json({ success: false, message: "you are Not Autherorized to Delete" })
                                } else {
                                    blog.remove((err) => {
                                        if (err) {
                                            res.json({ success: false, message: err })
                                        } else {
                                            res.json({ success: true, message: "Blog Deleted" })
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
    }
})






    return router
}