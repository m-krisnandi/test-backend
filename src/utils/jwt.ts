import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../configs'

interface Payload {
    userId: string;
    name: string;
    email: string;
  }

const createJWT = ( payload: Payload ): string => {
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration });
    return token;
}

const isTokenValid = (token: string): string | JwtPayload => jwt.verify(token, config.jwtSecret);

export { createJWT, isTokenValid, Payload }