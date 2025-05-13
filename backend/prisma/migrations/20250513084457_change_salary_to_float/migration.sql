/*
  Warnings:

  - You are about to alter the column `salary` on the `job` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `job` MODIFY `salary` DOUBLE NULL;
