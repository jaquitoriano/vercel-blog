-- CreateIndex
CREATE INDEX "posts_status_date_idx" ON "posts"("status", "date");

-- CreateIndex
CREATE INDEX "posts_author_id_idx" ON "posts"("author_id");

-- CreateIndex
CREATE INDEX "posts_category_id_idx" ON "posts"("category_id");

-- CreateIndex
CREATE INDEX "post_tags_tag_id_idx" ON "post_tags"("tag_id");

-- CreateIndex
CREATE INDEX "comments_post_id_idx" ON "comments"("post_id");

