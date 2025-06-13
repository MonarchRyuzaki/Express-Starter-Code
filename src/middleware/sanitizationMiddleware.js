import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

// Sanitize NoSQL injection attempts
export const sanitizeNoSQL = mongoSanitize({
  replaceWith: "_",
});

// Sanitize XSS attempts
export const sanitizeXSS = xss();
