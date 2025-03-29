import { z } from 'zod';

export const userSchema = z.object({
  first_name: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(10, 'First name must be less than 10 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'First name can only contain letters, spaces, and hyphens'),
  last_name: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(10, 'Last name must be less than 10 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'Last name can only contain letters, spaces, and hyphens'),
  email: z
    .string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(50, 'Email must be less than 50 characters'),
});

export type UserFormData = z.infer<typeof userSchema>;