import { prisma } from '../db/prisma';
import { executeQuery } from '../db/utils';

export async function getCommentsByPostId(postId: string) {
  return executeQuery(async () => {
    return await prisma.comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });
}

export async function createComment(data: any) {
  return executeQuery(async () => {
    return await prisma.comment.create({
      data,
    });
  });
}

export async function updateComment(id: string, data: any) {
  return executeQuery(async () => {
    return await prisma.comment.update({
      where: { id },
      data,
    });
  });
}

export async function deleteComment(id: string) {
  return executeQuery(async () => {
    return await prisma.comment.delete({
      where: { id },
    });
  });
}