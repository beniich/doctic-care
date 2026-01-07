import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './db.js';

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const googleId = profile.id;

                // 1. Check if user exists with this Google ID
                let user = await prisma.user.findUnique({
                    where: { googleId },
                });

                if (user) {
                    // Update last login
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { lastLogin: new Date() }
                    });
                    return done(null, user);
                }

                // 2. Check if user exists with this email (merge accounts)
                user = await prisma.user.findUnique({
                    where: { email },
                });

                if (user) {
                    // Link Google ID to existing user
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            googleId,
                            avatar: profile.photos[0]?.value,
                            lastLogin: new Date()
                        },
                    });
                    return done(null, user);
                }

                // 3. Create new user
                user = await prisma.user.create({
                    data: {
                        googleId,
                        email,
                        firstName: profile.name.givenName,
                        lastName: profile.name.familyName,
                        name: profile.displayName,
                        avatar: profile.photos[0]?.value,
                        role: 'DOCTOR', // Default role - change as needed
                        emailVerified: true,
                    },
                });

                return done(null, user);
            } catch (err) {
                console.error('Google Auth Error:', err);
                return done(err, null);
            }
        }
    )
);

export default passport;
