const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");

router.get("/users", requireAuth, userController.listUsers);

router.get("/user/:id", requireAuth, userController.getUserDetails);

router.get("/addUser", (req, res) => {
  res.render("users/add", { error: null });
});

router.post("/addUser", (req, res, next) => {
    if (req.session.user) {
      if (req.session.user.profile !== "ADMIN") {
        return res
          .status(403)
          .send("Access denied. Only admins can register new users.");
      }
    }

    next();
  },
  userController.addUser
);

router.get(
  "/updateUser/:id", 
  requireAuth, 
  requireAdmin, 
  userController.getUserToEdit
);

router.put(
  "/updateUser/:id",
  requireAuth,
  requireAdmin,
  userController.updateUser
);

router.get(
  "/users/:id/edit", 
  requireAuth, 
  requireAdmin, 
  userController.getUserToEdit
);

router.delete(
  "/deleteUser/:id",
  requireAuth,
  requireAdmin,
  userController.deleteUser
);

module.exports = router;
