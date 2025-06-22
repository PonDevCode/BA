require("dotenv").config();
const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    const white_list = ['/', '/resigter','/login', '/user','uploads','/variant', '/category', '/product', '/listProductCate'];
    // if (white_list.find(item => '/v1' + item === req.path)) {
    //     next();
    // } 
    
    if (req.path.startsWith('/uploads') || req.path.startsWith('/v1/product') || white_list.find(item => '/v1' + item === req.path)) {
    return next();
}
    
    else {
        setTimeout(() => {
            // verify token 
            if (req.headers.authorization) {
                const token = req.headers?.authorization?.split(' ')[1];
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    // console.log(decoded);
                    req.user = decoded
                    next();
                    return;
                } catch (error) {
                    return res.status(401).json({
                        message: "bạn chưa truyền access_token / hoặc token bạn hết hạn"
                    })
                }
                // console.log('cheack', token);
                // next();
            } else {
                return res.status(401).json({
                    message: "bạn chưa truyền access_token / hoặc token bạn hết hạn"
                })
            }
        }, 500)
    }
}


module.exports = auth