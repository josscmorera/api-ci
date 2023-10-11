const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existUser = await User.exists({ email });

        if (existUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const existUsername = await User.exists({ username: req.body.username });

        if (existUsername) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        
        const userInfo = { ...req.body, password: hash }; 
        
        const newUser =  new User(userInfo);
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({ success: true, data: savedUser, token });
    }
    catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const foundUser = await User.findOne({ email });

        console.log(foundUser)

        if (!foundUser) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);

        console.log(isPasswordValid)

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Generate a token and send it back to the user
        const token = jwt.sign({ id: foundUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({ success: true, data: foundUser, token: token });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

const validateUser = (req, res) => {
    try {
        const decodedToken = res.locals.decodedToken
        const findUser = User.findOne({_id: decodedToken.id})

        if(!findUser){
            return res.status(400).json({success: false, message: "Invalid token"})
        }
        
        return res.status(200).json({success: true, user: findUser})
    } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid token", error: error });
    }
}


module.exports = { createUser, loginUser, validateUser };