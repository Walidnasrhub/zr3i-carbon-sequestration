CREATE TABLE `emailTokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`token` varchar(255) NOT NULL,
	`type` varchar(50) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailTokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailTokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `farmerProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(100),
	`lastName` varchar(100),
	`phone` varchar(20),
	`country` varchar(100),
	`region` varchar(100),
	`farmName` varchar(255),
	`farmSize` int,
	`primaryCrop` varchar(100),
	`yearsOfFarming` int,
	`language` varchar(10) DEFAULT 'en',
	`profilePicture` varchar(500),
	`bio` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `farmerProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `farms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`location` varchar(255),
	`latitude` varchar(50),
	`longitude` varchar(50),
	`sizeHectares` int,
	`sizeAcres` int,
	`cropType` varchar(100),
	`soilType` varchar(100),
	`description` text,
	`isActive` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `farms_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `farmerProfiles` ADD CONSTRAINT `farmerProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `farms` ADD CONSTRAINT `farms_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;