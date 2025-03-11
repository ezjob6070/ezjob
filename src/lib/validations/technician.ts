
import * as z from "zod";

export const technicianSchema = z.object({
  name: z.string().min(2, {
    message: "Technician name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  specialty: z.string().min(2, {
    message: "Please enter a valid specialty.",
  }),
  status: z.enum(["active", "inactive", "onLeave"]).default("active"),
  paymentType: z.enum(["percentage", "flat", "hourly"]).default("percentage"),
  paymentRate: z.string().min(1, {
    message: "Please enter a valid payment rate.",
  }),
  hireDate: z.string().min(1, {
    message: "Please enter a valid hire date.",
  }),
  notes: z.string().optional(),
});
