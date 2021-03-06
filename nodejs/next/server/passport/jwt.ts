import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.TOKEN_SECRET,
  issuer: process.env.TOKEN_ISSUER,
  audience: process.env.TOKEN_AUDIENCE,
};

passport.use(
  new JWTStrategy(jwtOptions, async (payload, done) => {
    if (!payload.iat && !payload.exp && !payload.aud && !payload.iss && !payload.sub) {
      return done("Invalid JWT Payload", null);
    }
    return done(undefined, payload.sub);
  }),
);
