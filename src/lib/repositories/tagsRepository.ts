import { prisma } from '../db/prisma';
import { executeQuery } from '../db/utils';

export async function getAllTags() {
  return executeQuery(async () => {
    return await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });
  });
}

export async function getTagById(id: string) {
  return executeQuery(async () => {
    return await prisma.tag.findUnique({
      where: { id },
    });
  });
}

export async function getTagBySlug(slug: string) {
  return executeQuery(async () => {
    return await prisma.tag.findUnique({
      where: { slug },
    });
  });
}

export async function getTagsByIds(ids: string[]) {
  return executeQuery(async () => {
    return await prisma.tag.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  });
}

export async function createTag(data: any) {
  return executeQuery(async () => {
    return await prisma.tag.create({
      data,
    });
  });
}

export async function updateTag(id: string, data: any) {
  return executeQuery(async () => {
    return await prisma.tag.update({
      where: { id },
      data,
    });
  });
}

export async function deleteTag(id: string) {
  return executeQuery(async () => {
    return await prisma.tag.delete({
      where: { id },
    });
  });
}