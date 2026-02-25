const { z } = require('zod');
exports.userSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
});

exports.transactionSchema = z.object({
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be a positive number')
    .max(1000000, 'Amount cannot exceed 1,000,000'),
    
  type: z
    .enum(['INCOME', 'EXPENSE'], { 
      errorMap: () => ({ message: 'Type must be INCOME or EXPENSE' }) 
    }),
    
  category: z
    .string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
    
  description: z
    .string()
    .max(200, 'Description must be less than 200 characters')
    .optional()
    .or(z.literal('')),
    
  date: z
    .string()
    .optional()
    .or(z.date()),
    
});
exports.validate = (schema) => (req, res, next) => {
  try {
    const dataToValidate = req.method === 'GET' ? req.query : req.body;
    req.validatedData = schema.parse(dataToValidate);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(issue => ({
        field: issue.path.join('.') || 'unknown',
        message: issue.message
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    next(error);
  }
};