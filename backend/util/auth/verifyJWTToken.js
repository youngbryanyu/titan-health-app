/* verifyToken.js - verifying JSON web token for authentication */
const jwt = require("jsonwebtoken")

/* verifies whether the JSON web token is in the header of the HTTP request and valid */
function verify(req, res, next) {
    /* get JSON token from header */
    const authHeader = req.headers.token; 

    if (authHeader) { 
        const token = authHeader.split(" ")[1]; // ("Bearer", <token>)
        
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => { /* User is encoded into the JWT payload when token is signed */
            if (err) {
                res.status(403).json("JWT token is invalid!");
                return;
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated with a valid JSON web token."); // 401 is not authenticated
    }
}

module.exports = verify;