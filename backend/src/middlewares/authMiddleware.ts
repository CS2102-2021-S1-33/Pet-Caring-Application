const authMiddleware = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  };
};

export default authMiddleware;
