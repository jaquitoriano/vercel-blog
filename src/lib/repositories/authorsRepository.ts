import { prisma } from '../db/prisma';
import { executeQuery } from '../db/utils';

export async function getAllAuthors() {
  return executeQuery(async () => {
    return await prisma.author.findMany({
      include: {
        posts: true,
      },
    });
  });
}

export async function getAuthorById(id: string) {
  return executeQuery(async () => {
    return await prisma.author.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });
  });
}

export async function createAuthor(data: any) {
  return executeQuery(async () => {
    return await prisma.author.create({
      data,
    });
  });
}

export async function updateAuthor(id: string, data: any) {
  return executeQuery(async () => {
    return await prisma.author.update({
      where: { id },
      data,
    });
  });
}

export async function deleteAuthor(id: string) {
  return executeQuery(async () => {
    return await prisma.author.delete({
      where: { id },
    });
  });
}