-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationToken" TEXT,
ADD COLUMN     "verificationTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "comments_postId_idx" ON "comments"("postId");

-- CreateIndex
CREATE INDEX "comments_authorId_idx" ON "comments"("authorId");

-- CreateIndex
CREATE INDEX "comments_parentId_idx" ON "comments"("parentId");

-- CreateIndex
CREATE INDEX "comments_createdAt_idx" ON "comments"("createdAt");

-- CreateIndex
CREATE INDEX "payouts_userId_idx" ON "payouts"("userId");

-- CreateIndex
CREATE INDEX "payouts_payoutDate_idx" ON "payouts"("payoutDate");

-- CreateIndex
CREATE INDEX "posts_authorId_idx" ON "posts"("authorId");

-- CreateIndex
CREATE INDEX "posts_category_idx" ON "posts"("category");

-- CreateIndex
CREATE INDEX "posts_postType_idx" ON "posts"("postType");

-- CreateIndex
CREATE INDEX "posts_createdAt_idx" ON "posts"("createdAt");

-- CreateIndex
CREATE INDEX "posts_isActive_idx" ON "posts"("isActive");

-- CreateIndex
CREATE INDEX "posts_upvotesCount_idx" ON "posts"("upvotesCount" DESC);

-- CreateIndex
CREATE INDEX "posts_expiryDate_idx" ON "posts"("expiryDate");

-- CreateIndex
CREATE INDEX "tips_tipperId_idx" ON "tips"("tipperId");

-- CreateIndex
CREATE INDEX "tips_receiverId_idx" ON "tips"("receiverId");

-- CreateIndex
CREATE INDEX "tips_postId_idx" ON "tips"("postId");

-- CreateIndex
CREATE INDEX "tips_createdAt_idx" ON "tips"("createdAt");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_emailVerified_idx" ON "users"("emailVerified");

-- CreateIndex
CREATE INDEX "votes_postId_idx" ON "votes"("postId");

-- CreateIndex
CREATE INDEX "votes_commentId_idx" ON "votes"("commentId");
