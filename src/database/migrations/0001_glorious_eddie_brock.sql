CREATE TABLE `properties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`json` json,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `properties_id` PRIMARY KEY(`id`)
);
