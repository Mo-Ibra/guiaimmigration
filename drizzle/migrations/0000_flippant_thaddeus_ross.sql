CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"form_type" text,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "guides" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"title_es" text NOT NULL,
	"description" text NOT NULL,
	"description_es" text NOT NULL,
	"form_type" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"skill_level" text NOT NULL,
	"featured" boolean DEFAULT false,
	"online_filing" boolean DEFAULT false,
	"file_name" text,
	"file_content" text,
	"file_type" text,
	"file_name_2" text,
	"file_content_2" text,
	"file_type_2" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"case_type" text NOT NULL,
	"rating" integer NOT NULL,
	"testimonial" text NOT NULL,
	"timeline" text,
	"allow_contact" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "translation_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_number" varchar(20) NOT NULL,
	"customer_email" varchar(255) NOT NULL,
	"customer_phone" varchar(50),
	"original_file_name" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"page_count" integer NOT NULL,
	"delivery_type" varchar(20) NOT NULL,
	"total_price" numeric(10, 2) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"original_file_path" varchar(500),
	"translated_file_path" varchar(500),
	"original_file_content" text,
	"translated_file_content" text,
	"admin_notes" text,
	"payment_intent_id" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "translation_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
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
CREATE TABLE "uscis_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"form_type" text NOT NULL,
	"fee" text NOT NULL,
	"processing_time" text NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	CONSTRAINT "uscis_data_form_type_unique" UNIQUE("form_type")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
