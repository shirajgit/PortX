
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url))

import * as runtime from "@prisma/client/runtime/client"
import * as $Enums from "./enums"
import * as $Class from "./internal/class"
import * as Prisma from "./internal/prismaNamespace"

export * as $Enums from './enums'
export * from "./enums"
/**
 * ## Prisma Client
 * 
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Profiles
 * const profiles = await prisma.profile.findMany()
 * ```
 * 
 * Read more in our [docs](https://pris.ly/d/client).
 */
export const PrismaClient = $Class.getPrismaClientClass()
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>
export { Prisma }

/**
 * Model Profile
 * 
 */
export type Profile = Prisma.ProfileModel
/**
 * Model PaymentRequest
 * 
 */
export type PaymentRequest = Prisma.PaymentRequestModel
/**
 * Model Link
 * 
 */
export type Link = Prisma.LinkModel
/**
 * Model Experience
 * 
 */
export type Experience = Prisma.ExperienceModel
/**
 * Model Project
 * 
 */
export type Project = Prisma.ProjectModel
/**
 * Model Skill
 * 
 */
export type Skill = Prisma.SkillModel
/**
 * Model Education
 * 
 */
export type Education = Prisma.EducationModel
/**
 * Model PageView
 * 
 */
export type PageView = Prisma.PageViewModel
