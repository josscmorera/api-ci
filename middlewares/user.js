const e = require('express');
const {isEmail, isStrongPassword} = require('validator');

const validateUserData = (req, res, next) => {
    const errObj = {};
    const {email, password} = req.body;
    if(!isEmail(email)){
        errObj.email = "Email is invalid";
        return res.status(400).json({success: false, message: "Email is invalid"});
    }
    if(!isStrongPassword(password)){
        errObj.password = "Your password must be at least 8 characters long and contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbol";
        return res.status(400).json({success: false, message: errObj.password});

    }
    if (Object.keys(errObj).length > 0) {
        return res.status(400).json({ success: false, message:"Error data" });
    } else {
        next();
    }
}


module.exports = {validateUserData}

