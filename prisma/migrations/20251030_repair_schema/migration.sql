-- Add PostStatus enum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNPUBLISHED', 'CORRECTED');

-- Add unique constraint to User email
ALTER TABLE "users" ADD CONSTRAINT "users_email_key" UNIQUE ("email");

-- Add description to Category
ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "description" TEXT;

-- Add status to Post
ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "status" "PostStatus" NOT NULL DEFAULT 'DRAFT';

-- Add relations
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;