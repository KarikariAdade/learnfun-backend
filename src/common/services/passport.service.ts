import passport from "passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import prisma from "./database.service";
import { loggerService } from "./logger.service";

const options: any = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use(
    new Strategy(options, async (jwtPayload:any, done:VerifiedCallback)=> {
        try {
            const user = await prisma.users.findUnique({
                where: {
                    id: jwtPayload.id
                }
            })

            if (user) {
                return done(null, user)
            }else{
                return done(null, false)
            }
        } catch (errors) {

            loggerService.error('Token validation failed', errors)

            return done(errors, false)
        }
    })
)

export default passport;