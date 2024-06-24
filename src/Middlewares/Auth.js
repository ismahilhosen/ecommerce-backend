const jwt = require("jsonwebtoken");

const ensureAuthanticated = async(req, res, next)=>{
    const auth = req.headers["authoraization"];
    if(!auth){
        return res.status(403).json({
            message: "authantication token is requried",
        })
    }

    try {
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        console.log(req.user, req);
        req.user = decoded;
        next()
    } catch (error) {
        res.status(403).json({message: "jwt token is wrong or expired"})
    }
}

module.exports = ensureAuthanticated;