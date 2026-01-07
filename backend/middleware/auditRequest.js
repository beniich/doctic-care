import auditService from '../services/auditService.js';

/**
 * Middleware to log specific API requests
 * @param {string} action - The action name to log
 */
const auditRequest = (action) => {
  return async (req, res, next) => {
    // Capture the original 'end' function to log after response is sent
    const originalEnd = res.end;

    // Default outcome
    let outcome = 'SUCCESS';

    // Hook into response finish
    res.end = function (chunk, encoding) {
      // Restore original
      res.end = originalEnd;
      // Call original
      res.end(chunk, encoding);

      // Determine outcome based on status code
      if (res.statusCode >= 400 && res.statusCode < 500) {
        outcome = 'DENIED'; // or FAILURE depending on context
      } else if (res.statusCode >= 500) {
        outcome = 'FAILURE';
      }

      // Extract user ID if available (from auth middleware)
      const userId = req.user ? req.user.id : (req.body.userId || 'anonymous');

      // Log asynchronously
      auditService.log(
        userId,
        action,
        req.originalUrl,
        outcome,
        {
          method: req.method,
          ip: req.ip,
          userAgent: req.get('user-agent'),
          statusCode: res.statusCode
        }
      );
    };

    next();
  };
};

export default auditRequest;
