import jwtHelper from '../helpers/JWTHelper.js';


class AuthMiddleWare {
    

    isAuth = async (req, res, next) => {
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const tokenFromClient = req.body.token || req.query.token || req.headers["access-token"];

        if (tokenFromClient) {
            try {
                const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);

                req.jwtDecoded = decoded;

                next();
            }
            catch (error) {
                return res.status(401).json({
                    message: 'Unauthorized.',
                });

            }
        }
        else {
            return res.status(403).json({
                message: 'No token provided.',
            });
        }

    }

    
}




export default new AuthMiddleWare();