// middleware/validateInput.js
module.exports = (schema) => {
  return (req, res, next) => {
    const { body } = req;
    const missingFields = [];

    for (const key in schema) {
      if (schema[key] && (body[key] === undefined || body[key] === null || body[key] === '')) {
        missingFields.push(key);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    next();
  };
};
