-- AlterTable
ALTER TABLE `SiteSettings`
  ADD COLUMN `contactEmail` VARCHAR(191) NULL,
  ADD COLUMN `contactPhone` VARCHAR(191) NULL,
  ADD COLUMN `socialLinks` JSON NULL;
