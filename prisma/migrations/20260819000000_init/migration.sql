-- CreateTable
CREATE TABLE `AdminUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginChallenge` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `adminUserId` INTEGER NOT NULL,
    `otpHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `consumedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LoginChallenge_token_key`(`token`),
    INDEX `LoginChallenge_adminUserId_idx`(`adminUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordResetCode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `adminUserId` INTEGER NOT NULL,
    `codeHash` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `consumedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `PasswordResetCode_token_key`(`token`),
    INDEX `PasswordResetCode_adminUserId_idx`(`adminUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LoginAttempt` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LoginAttempt_key_createdAt_idx`(`key`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlogPost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `excerpt` VARCHAR(500) NOT NULL,
    `contentHtml` LONGTEXT NOT NULL,
    `coverImage` VARCHAR(191) NULL,
    `tags` VARCHAR(191) NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` VARCHAR(500) NULL,
    `ogImage` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogPost_slug_key`(`slug`),
    INDEX `BlogPost_status_publishedAt_idx`(`status`, `publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Course` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `shortDescription` VARCHAR(500) NOT NULL,
    `contentHtml` LONGTEXT NOT NULL,
    `heroImage` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `faqs` JSON NULL,
    `seoTitle` VARCHAR(191) NULL,
    `seoDescription` VARCHAR(500) NULL,
    `ogImage` VARCHAR(191) NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Course_slug_key`(`slug`),
    INDEX `Course_published_sortOrder_idx`(`published`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PricingPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `tagline` VARCHAR(300) NOT NULL,
    `price` INTEGER NOT NULL,
    `billingPeriod` VARCHAR(191) NOT NULL DEFAULT 'month',
    `classesPerWeek` INTEGER NOT NULL,
    `classesPerMonth` INTEGER NOT NULL,
    `minutesPerClass` INTEGER NOT NULL DEFAULT 30,
    `altPricingNote` VARCHAR(191) NULL,
    `features` JSON NOT NULL,
    `highlighted` BOOLEAN NOT NULL DEFAULT false,
    `ctaLabel` VARCHAR(191) NOT NULL DEFAULT 'Start Free Trial',
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PricingPlan_slug_key`(`slug`),
    INDEX `PricingPlan_published_sortOrder_idx`(`published`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clientName` VARCHAR(191) NOT NULL,
    `company` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL,
    `quote` TEXT NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `rating` INTEGER NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Review_published_sortOrder_idx`(`published`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteSettings` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `logoUrl` VARCHAR(191) NULL,
    `logoWidth` INTEGER NULL,
    `faviconUrl` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MediaAsset` (
    `id` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `data` LONGBLOB NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactSubmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `subject` VARCHAR(191) NULL,
    `message` TEXT NOT NULL,
    `ip` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `readAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrialRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `course` VARCHAR(191) NULL,
    `preferredPlan` VARCHAR(191) NULL,
    `preferredTime` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `ip` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `readAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LoginChallenge` ADD CONSTRAINT `LoginChallenge_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `AdminUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordResetCode` ADD CONSTRAINT `PasswordResetCode_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `AdminUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
