import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Email not found"));

        let user = await User.findOne({ email });

        if (!user) {
          // FIX: Implement unique username generation logic
          let baseUsername = profile.displayName.toLowerCase().replace(/\s/g, "");
          let username = baseUsername;
          let counter = 0;
          
          while(await User.findOne({ username })) {
              counter++;
              username = `${baseUsername}${counter}`;
          }

          user = new User({
            username,
            email,
            profilePicture: profile.photos?.[0]?.value || null,
            password: "GOOGLE_OAUTH_TEMP_PASSWORD", 
          });
          
          try {
            await user.save();
          } catch (saveError) {
             console.error("Error saving new Google user to DB:", saveError);
             return done(saveError, null); 
          }
        }

        done(null, user); 
      } catch (err) {
        done(err, null);
      }
    }
  )
);
// ... rest of file (serializeUser, deserializeUser)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;