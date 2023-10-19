const jwt = require('jsonwebtoken');

const jwtValidate = (req, res, next) => {
    try {
        if(req.header && req.headers.authorization){
            const token = req.headers.authorization;
            const slicedToken = token.split(" ")[1];
            const decodedToken = jwt.verify(slicedToken, process.env.SECRET_KEY);

            if(decodedToken){
                req.decodedToken = decodedToken;
                req.token = slicedToken;
                next()
            }
        }
    } catch (error) {
        res.status(400).json({success: false, message: "Invalid token", error: error});
    }
}

module.exports = {jwtValidate}