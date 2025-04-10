const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({ message: "Không có quyền truy cập" });
    }
  };
  
  export default isAdmin;
  