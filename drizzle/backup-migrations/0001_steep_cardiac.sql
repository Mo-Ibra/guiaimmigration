CREATE TABLE "translation_pricing" (
	"id" serial PRIMARY KEY NOT NULL,
	"service_type" varchar(50) NOT NULL,
	"price_per_page" numeric(10, 2) NOT NULL,
	"minimum_price" numeric(10, 2) NOT NULL,
	"delivery_days" integer NOT NULL,
	"description" text NOT NULL,
	"description_es" text NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "guides" ADD COLUMN "file_name" text;--> statement-breakpoint
ALTER TABLE "guides" ADD COLUMN "file_content" text;--> statement-breakpoint
ALTER TABLE "guides" ADD COLUMN "file_type" text;--> statement-breakpoint
ALTER TABLE "guides" ADD COLUMN "file_name_2" text;--> statement-breakpoint
ALTER TABLE "guides" ADD COLUMN "file_content_2" text;--> statement-breakpoint
ALTER TABLE "guides" ADD COLUMN "file_type_2" text;--> statement-breakpoint
ALTER TABLE "translation_orders" ADD COLUMN "original_file_content" text;--> statement-breakpoint
ALTER TABLE "translation_orders" ADD COLUMN "translated_file_content" text;