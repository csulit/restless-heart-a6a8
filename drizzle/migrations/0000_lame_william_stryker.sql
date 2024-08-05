CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clerk_id` varchar(255) NOT NULL,
	`email` varchar(100) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_clerk_id_unique` UNIQUE(`clerk_id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
