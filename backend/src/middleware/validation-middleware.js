import { sendError } from '../utils/response.js';

export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const parsed = await schema.parseAsync(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error.issues) {
        const formatted = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return sendError(res, 400, 'Validation failed', formatted);
      }
      return sendError(res, 400, error.message || 'Validation error');
    }
  };
};
