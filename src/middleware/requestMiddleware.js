// Request timeout middleware
export const timeoutMiddleware = (timeout = 30000) => {
  return (req, res, next) => {
    req.setTimeout(timeout, () => {
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          message: "Request timeout",
        });
      }
    });
    next();
  };
};

// Body size limiting middleware
export const bodySizeLimit = {
  json: { limit: "10mb" },
  urlencoded: { limit: "10mb", extended: false },
};
