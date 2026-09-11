// engine/core/validation/schemas/post.schema.ts
import { z } from "zod";
import { optionalField } from "./optional";

export const companySchema = z.object({
  col: z.string().min(2),
  value: z.string().min(5),
});

 
export const orgUpdateSchema = z.object({
  uuid:z.string().min(10), 
  customer_name:z.string().trim().min(5),
  phone:z.string().trim().min(10), 
  email:z.email().trim(), 
  institution_name:z.string().min(3), 
  address:z.string().trim().min(5),
  pin: optionalField(z.string()),
  website: optionalField(
    z.url()
  ),
});