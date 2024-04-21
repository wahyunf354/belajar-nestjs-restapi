import { ZodType, z } from 'zod';

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().email('This is not valid email').optional(),
    phone: z
      .string()
      .regex(
        new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
      )
      .min(0)
      .max(13),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().email('This is not valid email').optional(),
    phone: z
      .string()
      .regex(
        new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
      )
      .min(0)
      .max(13),
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
  });
}
