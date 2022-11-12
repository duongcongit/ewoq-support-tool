import { rejects } from "assert";
import { error } from "console";
import jwt from "jsonwebtoken";
import { resolve } from "path";

class JWTHelper {
    
    generateToken = async (tokenData, secretSignature, tokenLife) => {
        return new Promise((resolve, reject) => {
    
            jwt.sign(
                { data: tokenData },
                secretSignature,
                {
                    algorithm: "HS256",
                    expiresIn: tokenLife,
                },
                (error, token) => {
                    if (error) { return reject(error); }
                    resolve(token);
                }
            );
        });
    
    }
    
    verifyToken = (token, secretKey) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (error, decoded) => {
                if (error) { return reject(error); }
                resolve(decoded);
            });
        });
    }

    
}

export default new JWTHelper();