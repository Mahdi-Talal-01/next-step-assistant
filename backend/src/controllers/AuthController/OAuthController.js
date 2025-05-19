const oauthService = require("../services/oauthService");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { TokenRepository } = require("../../repositories/TokenRepository");
const prisma = new PrismaClient();
const ResponseTrait = require("../../traits/ResponseTrait");

class OAuthController {
  async handleGoogleAuth(req, res) {
    try {
      // Check if required environment variables are set
      if (!process.env.GOOGLE_CLIENT_ID) {
        return ResponseTrait.sendErrorResponse(
          res,
          "Missing GOOGLE_CLIENT_ID environment variable",
          500
        );
      }     

      if (!process.env.GOOGLE_CLIENT_SECRET) {
        return ResponseTrait.sendErrorResponse(
          res,
          "Missing GOOGLE_CLIENT_SECRET environment variable",
          500
        );
      }

      const url = oauthService.generateAuthUrl();
      return res.json({ url });
    } catch (error) {
      console.error("Google auth error:", error);
      return res.status(500).json({
        error: "Failed to initiate Google authentication",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  }

  async handleGoogleCallback(req, res) {
    try {
      const { code } = req.query;
      if (!code) {
        return res
          .status(400)
          .json({ error: "Authorization code is required" });
      }

      // Get tokens from Google
      const tokens = await oauthService.getToken(code);

      // Get user data from Google
      const userData = await oauthService.getUserData(tokens.access_token);

      // Check if user exists
      let user = await prisma.user.findFirst({
        where: {
          OR: [{ email: userData.email }, { providerId: userData.id }],
        },
        include: {
          profile: true,
        },
      });

      if (!user) {
        // Create new user with profile
        user = await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            avatar: userData.picture,
            provider: "google",
            providerId: userData.id,
            profile: {
              create: {
                bio: "",
                location: "",
                phone: "",
                linkedin: "",
                github: "",
                website: "",
              },
            },
          },
          include: {
            profile: true,
          },
        });
      } else if (!user.providerId) {
        // Update existing user with Google data
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            provider: "google",
            providerId: userData.id,
            avatar: userData.picture,
          },
          include: {
            profile: true,
          },
        });
      }

      // Save or update tokens in the Token table
      await TokenRepository.saveTokens(user.id, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date,
        scope: tokens.scope || "email profile",
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // Redirect to frontend with token and user data
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      const userDataString = encodeURIComponent(
        JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          profile: user.profile,
        })
      );

      res.redirect(`${frontendUrl}/auth?token=${token}&user=${userDataString}`);
    } catch (error) {
      console.error("Google callback error:", error);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendUrl}/auth?error=Authentication failed`);
    }
  }
}

module.exports = new OAuthController();
