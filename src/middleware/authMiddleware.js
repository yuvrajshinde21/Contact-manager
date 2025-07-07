const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const validateToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                // console.log("Incoming token:", token);
                res.clearCookie("token");
                return res.redirect("/login");
            }
            req.user = decoded;
            // console.log("Decoded user:", decoded);

            next();
        })
    } else {
        return res.redirect("/login");
    }

})

// const validateToken = asyncHandler(async(req,res,next)=>{
//     const authHeader = req.headers.authorization;

//     if (authHeader && authHeader.startsWith("Bearer ")) {
//         const token = authHeader.split(" ")[1];

//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
//             if (err) {
//                 res.status(401);
//                 throw new Error("Invalid token!");
//             }
//             req.user = decoded;
//             next();
//         })
//     } else {
//         res.status(401);
//         throw new Error("No token provided!")
//     }
// });

module.exports = validateToken;