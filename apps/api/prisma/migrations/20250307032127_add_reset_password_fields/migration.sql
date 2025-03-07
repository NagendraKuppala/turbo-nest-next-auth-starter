-- AlterTable
ALTER TABLE "users" ADD COLUMN     "pwdResetToken" VARCHAR(255),
ADD COLUMN     "pwdResetTokenExpiry" TIMESTAMP(3);
