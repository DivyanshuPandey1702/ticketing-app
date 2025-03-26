import express from "express";
const router = express.Router();
router.post("/api/users/signout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    path: "/api/auth/refresh-token",
  });
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "strict",
    path: "/api/auth/refresh-token",
  });

  res.send({});
});

export { router as signoutRouter };
