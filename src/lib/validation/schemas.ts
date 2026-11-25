import { z } from "zod";

export const idSchema = z.number().int().positive();
export const idsSchema = z.array(idSchema).min(1).max(100);

export const nameSchema = z.string().min(1).max(60).trim();
export const idParamSchema = z.string().min(1).max(999).trim();

export const joinCodeSchema = z.number().gte(10000000).lte(99999999);

export const preemptReasonSchema = z.string().min(1).max(300)