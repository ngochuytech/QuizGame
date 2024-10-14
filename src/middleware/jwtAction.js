import jwt from "jsonwebtoken"
import 'dotenv/config'

const createJWT = (data) => {
    let payload = data;
    let token = null;

    // Check if the payload is an object (Do có cảnh báo)
    if (typeof payload !== 'object' || payload === null) {
        console.error("Payload must be a non-null object");
        return null;
    }

    try {
        token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });
    } catch (error) {
        console.log(error);
    }
    return token

}

const verifyToken = (token) => {
    let data = null;
    try {
        let decoded = jwt.verify(token, process.env.SECRET_KEY);
        data = decoded;
    } catch (error) {
        return null;
    }
    return data;
}


module.exports = {
    createJWT, verifyToken
}