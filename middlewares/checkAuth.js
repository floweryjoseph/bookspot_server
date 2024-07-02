import JWT  from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();



export const checkAuth = async(req, res, next)=>{

    const headerToken = req.headers?.authorization

    if(!headerToken || !headerToken.startsWith('Bearer')){
        return res.status(500).json({message:"Unauthorized access token"})
    }
    const token  = headerToken.split(" ")[1]
    try{
    const decryptedToken = JWT.verify(token, process.env.JWT_SECRET)
    req.body.userId = decryptedToken.userId;
    next();
    } catch {
        return res.status(500).json({message:"Unauthorized"})
    }

}





