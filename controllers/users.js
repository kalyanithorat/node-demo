const userModel = require('../models/users');
const bcrypt = require('bcrypt');
let middleware = require('../middleware');
const jwt = require('jsonwebtoken');

module.exports = {
    create: function (req, res, next) {

        console.log('req', req.body);

        userModel.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
            // name: req.body.name
        },
            function (err, result) {
                if (err)
                    next(err);
                else
                    res.json({ status: "success", message: "User added successfully!!!", data: result });

            });
    },
    // authenticate: function (req, res, next) {
    //     userModel.findOne({ email: req.body.email }, function (err, userInfo) {
    //         if (err) {
    //             next(err);
    //         } else {
    //             if (bcrypt.compareSync(req.body.password, userInfo.password)) {
    //                 const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' });
    //                 res.json({ status: "success", message: "user found!!!", data: { user: userInfo, token: token } });
    //             } else {
    //                 res.json({ status: "error", message: "Invalid email/password!!!", data: null });
    //             }
    //         }
    //     });

    // },

    //login api
    login: function (req, res, next) {

        console.log('req', req.body);

        console.log('password',bcrypt.hashSync(req.body.password, 10));
        
        userModel.findOne({
            email: req.body.email,
        },
            function (err, result) {
                if (err) {
                    next(err);
                }
                else {

                    bcrypt.compare(req.body.password, result.password,result.saltRounds, function(err, res) {
                        if(res) {
                            console.log('password match');
                            
                         // Passwords match
                        } else {
                            console.log('password not match');
                            
                         // Passwords don't match
                        } 
                      });

                    if (result.length < 1) {
                        res.json({ status: "failed", message: "Invalid username/passsword", data: result });
                    } else {

                        let token=jwt.sign({ email: result.email },
                            'aaa',
                            { expiresIn: '24h' }
                        );
                        result.token=token;
                        result.save((err,res1)=>{
                            res.json({ status: "success", message: "User Data", data: result, token: token });
                        })

                        

                    }
                }

            });
    },

    //update the database



    update: function (req, res, next) {
        const { id, user } = req.body;
        userModel.findOneAndUpdate({ _id: id },
            user,
            {
                new: true
            },
            function (err, result) {
                if (err) {
                    res.json({ status: "Failed", message: "Update Error", data: null });
                }
                else {
                    res.json({ status: "success", message: "User Updated", data: result });
                }
            });
    },

    //delete api
    delete: function (req, res, next) {
        const { id } = req.body;
        userModel.findOneAndRemove({ _id: id },
            function (err, result) {
                if (err) {
                    res.json({ status: "Failed", message: "Delete Error", data: null });

                } else {
                    res.json({ status: "success", message: "User Deleted", data: result });
                }
            });

    },
    //get data api 
    get: function (req, res) {
        const { id } = req.body;
        userModel.find(
            function (err, result) {
                if (err) {
                    res.json({ status: "failed", message: "retrive errror", data: null });
                }
                else {
                    res.json({ status: "success", message: "retrival successfull", data: result });
                }

            });
    },
    loggedInUser: function (req, res) {
        console.log(req.headers.authorization
            );
        
        const token = req.headers.authorization;
        userModel.findOne({ token: token },
            function (err, result) {
                if (err) {
                    res.json({ status: "failed", message: "login error", data: null });
                }
                else {
                    res.json({ status: "success", message: "logged-in user", data: result });
                }
            }
        )
    }
}







