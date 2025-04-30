
import * as z from "zod";
import { SalaryBasis, IncentiveType } from "@/types/employee";

export const technicianSchema = z.object({
  name: z.string().min(2, {
    message: "Technician name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional(),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().optional(),
  specialty: z.string().min(2, {
    message: "Please enter a valid specialty.",
  }),
  status: z.enum(["active", "inactive", "onLeave"]).default("active"),
  paymentType: z.enum(["percentage", "flat", "hourly"]).default("percentage"),
  paymentRate: z.string().min(1, {
    message: "Please enter a valid payment rate.",
  }),
  hireDate: z.string().min(1, {
    message: "Please select a hire date.",
  }),
  notes: z.string().optional(),
  contractType: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  salaryBasis: z.enum(["hourly", "annual", "commission"]).optional(),
  hourlyRate: z.string().optional(),
  incentiveType: z.enum(["bonus", "commission", "none"]).optional(),
  incentiveAmount: z.string().optional(),
  profileImage: z.string().optional(),
});
