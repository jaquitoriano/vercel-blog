import { type Prisma } from '@prisma/client'

export type CategoryFormData = Pick<Prisma.CategoryCreateInput, 'name' | 'slug' | 'description'>