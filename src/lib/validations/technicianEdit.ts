
import * as z from "zod";
import { SalaryBasis } from "@/types/technician";

export const technicianEditSchema = z.object({
  name: z.string().min(2, {
    message: "Technician name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  specialty: z.string().min(2, {
    message: "Specialty must be at least 2 characters.",
  }),
  status: z.enum(["active", "inactive", "onLeave"]),
  paymentType: z.enum(["percentage", "flat", "hourly"]),
  paymentRate: z.string().refine((value) => {
    try {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 0;
    } catch (e) {
      return false;
    }
  }, {
    message: "Payment rate must be a valid number.",
  }),
  startDate: z.string().optional(),
  hireDate: z.string(),
  notes: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  salaryBasis: z.enum(["hourly", "annual", "commission", "weekly", "monthly", "yearly"] as const).optional(),
  hourlyRate: z.string().optional(),
  incentiveType: z.enum(["bonus", "commission", "none", "hourly", "weekly", "monthly"] as const).optional(),
  incentiveAmount: z.string().optional(),
  profileImage: z.string().nullable().optional(),
});

export type TechnicianEditFormValues = z.infer<typeof technicianEditSchema>;
