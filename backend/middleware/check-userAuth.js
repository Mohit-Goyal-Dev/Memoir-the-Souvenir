const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // authorization = "Bearer tkahssdbnajkbnzzdsoi"
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        //adding new data to req and it will be apssed to next req function
        req.userData = { email: decodedToken.email, userId: decodedToken.userId }
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication Failed or Expired!" });
    }


};