import compression from "compression";

// Compress responses for better performance
export const compressionMiddleware = compression({
  level: 6, // Compression level (1-9, 6 is default)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress responses if the request includes a cache-control: no-transform directive
    if (
      req.headers["cache-control"] &&
      req.headers["cache-control"].includes("no-transform")
    ) {
      return false;
    }
    // Use compression for all other responses
    return compression.filter(req, res);
  },
});
