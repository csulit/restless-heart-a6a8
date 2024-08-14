CREATE TABLE `listing_areas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`city_id` int NOT NULL,
	CONSTRAINT `listing_areas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listing_cities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`region_id` int NOT NULL,
	CONSTRAINT `listing_cities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `listing_regions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `listing_regions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `listing_areas` ADD CONSTRAINT `listing_areas_city_id_listing_cities_id_fk` FOREIGN KEY (`city_id`) REFERENCES `listing_cities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `listing_cities` ADD CONSTRAINT `listing_cities_region_id_listing_regions_id_fk` FOREIGN KEY (`region_id`) REFERENCES `listing_regions`(`id`) ON DELETE no action ON UPDATE no action;