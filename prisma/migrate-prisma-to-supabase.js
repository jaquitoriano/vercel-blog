#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

const env = {
  ...dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), '.env'))),
  ...(fs.existsSync(path.resolve(process.cwd(), '.env.local'))
    ? dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), '.env.local')))
    : {}),
};
const sourceUrl = env.PRISMA_SOURCE_DATABASE_URL;
const destinationUrl = env.DIRECT_URL;

if (!sourceUrl) throw new Error('Missing PRISMA_SOURCE_DATABASE_URL for the Prisma source database');
if (!destinationUrl) {
  throw new Error('Missing DIRECT_URL for the Supabase destination');
}

const source = new PrismaClient({
  datasourceUrl: sourceUrl,
});
const destination = new PrismaClient({
  datasourceUrl: destinationUrl,
});

const models = ['author', 'category', 'tag', 'post', 'postTag', 'comment', 'user', 'siteSetting'];

async function counts(client) {
  const result = {};
  for (const model of models) {
    result[model] = await client[model].count();
  }
  return result;
}

async function main() {
  console.log('Reading source records from Prisma Postgres...');
  const sourceData = {
    authors: await source.author.findMany(),
    categories: await source.category.findMany(),
    tags: await source.tag.findMany(),
    posts: await source.post.findMany(),
    postTags: await source.postTag.findMany(),
    comments: await source.comment.findMany(),
    users: await source.user.findMany(),
    siteSettings: await source.siteSetting.findMany(),
  };

  console.log('Importing records into Supabase...');
  await destination.$transaction(async (tx) => {
    for (const author of sourceData.authors) {
      await tx.author.upsert({ where: { id: author.id }, update: author, create: author });
    }
    for (const category of sourceData.categories) {
      await tx.category.upsert({ where: { id: category.id }, update: category, create: category });
    }
    for (const tag of sourceData.tags) {
      await tx.tag.upsert({ where: { id: tag.id }, update: tag, create: tag });
    }
    for (const post of sourceData.posts) {
      await tx.post.upsert({ where: { id: post.id }, update: post, create: post });
    }
    for (const postTag of sourceData.postTags) {
      await tx.postTag.upsert({
        where: { postId_tagId: { postId: postTag.postId, tagId: postTag.tagId } },
        update: postTag,
        create: postTag,
      });
    }
    for (const comment of sourceData.comments) {
      await tx.comment.upsert({ where: { id: comment.id }, update: comment, create: comment });
    }
    for (const user of sourceData.users) {
      await tx.user.upsert({ where: { id: user.id }, update: user, create: user });
    }
    for (const siteSetting of sourceData.siteSettings) {
      await tx.siteSetting.upsert({
        where: { id: siteSetting.id },
        update: siteSetting,
        create: siteSetting,
      });
    }
  }, { maxWait: 10000, timeout: 120000 });

  const sourceCounts = await counts(source);
  const destinationCounts = await counts(destination);
  console.log('Migration verification:');
  for (const model of models) {
    console.log(`- ${model}: ${destinationCounts[model]}/${sourceCounts[model]}`);
  }

  const mismatch = models.find((model) => destinationCounts[model] !== sourceCounts[model]);
  if (mismatch) throw new Error(`Count mismatch for ${mismatch}`);

  console.log('Migration completed successfully. Source and destination counts match.');
}

main()
  .catch((error) => {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await source.$disconnect();
    await destination.$disconnect();
  });
