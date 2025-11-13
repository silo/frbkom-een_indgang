CREATE TABLE "department_event_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"department_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"note" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "department" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "department_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "event_access_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"needs_blockage" boolean DEFAULT false NOT NULL,
	"blockage_description" text,
	"police_permission_applied" boolean DEFAULT false NOT NULL,
	"police_approval_document_id" uuid,
	CONSTRAINT "event_access_info_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "event_application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"purpose" text NOT NULL,
	"expected_attendance_range" text NOT NULL,
	"commercial" boolean DEFAULT false NOT NULL,
	"recurring" boolean DEFAULT false NOT NULL,
	"recurring_interval" text,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"setup_start_at" timestamp with time zone,
	"setup_end_at" timestamp with time zone,
	"location_type" text NOT NULL,
	"location_address" text,
	"location_preset_id" uuid,
	"status" text DEFAULT 'draft' NOT NULL,
	"review_status" text DEFAULT 'unprocessed' NOT NULL,
	"summary_completion_pct" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_artifact" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"label" text NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"rotation" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"actor_user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"payload" json,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"content" text NOT NULL,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_food_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"has_food_or_beverage" boolean DEFAULT false NOT NULL,
	"description" text,
	CONSTRAINT "event_food_info_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "event_safety_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"simultaneous_persons_range" text NOT NULL,
	"has_temporary_constructions" boolean DEFAULT false NOT NULL,
	"constructions_description" text,
	"constructions_certificate_document_id" uuid,
	"has_read_br18_bilag11" boolean DEFAULT false NOT NULL,
	"other_considerations" text,
	CONSTRAINT "event_safety_info_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "event_sound_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"has_sound" boolean DEFAULT false NOT NULL,
	"description" text,
	"responsible_name" text,
	"responsible_phone" text,
	CONSTRAINT "event_sound_info_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "event_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"from_status" text NOT NULL,
	"to_status" text NOT NULL,
	"changed_by_user_id" uuid NOT NULL,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "event_type_tag_link" (
	"event_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "event_type_tag_link_event_id_tag_id_pk" PRIMARY KEY("event_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "event_type_tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name_da" text NOT NULL,
	"name_en" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_type_tag_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "event_waste_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"needs_waste_handling" boolean DEFAULT false NOT NULL,
	"description" text,
	CONSTRAINT "event_waste_info_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identity_type" text NOT NULL,
	"cpr" text NOT NULL,
	"mitid_uuid" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"company_cvr" text,
	"last_login_at" timestamp with time zone,
	"last_idp" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_mitid_uuid_unique" UNIQUE("mitid_uuid")
);
--> statement-breakpoint
CREATE TABLE "location_preset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"image_url" text NOT NULL,
	"address" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "location_preset_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "department_event_status" ADD CONSTRAINT "department_event_status_event_id_event_application_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "department_event_status" ADD CONSTRAINT "department_event_status_department_id_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."department"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_access_info" ADD CONSTRAINT "event_access_info_event_id_event_application_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_access_info" ADD CONSTRAINT "event_access_info_police_approval_document_id_event_document_id_fk" FOREIGN KEY ("police_approval_document_id") REFERENCES "public"."event_document"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_application" ADD CONSTRAINT "event_application_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_application" ADD CONSTRAINT "event_application_location_preset_id_location_preset_id_fk" FOREIGN KEY ("location_preset_id") REFERENCES "public"."location_preset"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_artifact" ADD CONSTRAINT "event_artifact_event_id_event_application_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_audit_log" ADD CONSTRAINT "event_audit_log_event_id_event_application_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_audit_log" ADD CONSTRAINT "event_audit_log_actor_user_id_user_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_document" ADD CONSTRAINT "event_document_event_id_event_application_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_food_info" ADD CONSTRAINT "event_food_info_event_id_event_application_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_safety_info" ADD CONSTRAINT "event_safety_info_event_id_event_application_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_safety_info" ADD CONSTRAINT "event_safety_info_constructions_certificate_document_id_event_document_id_fk" FOREIGN KEY ("constructions_certificate_document_id") REFERENCES "public"."event_document"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_sound_info" ADD CONSTRAINT "event_sound_info_event_id_event_application_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_history" ADD CONSTRAINT "event_status_history_event_id_event_application_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_status_history" ADD CONSTRAINT "event_status_history_changed_by_user_id_user_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_type_tag_link" ADD CONSTRAINT "event_type_tag_link_event_id_event_application_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_type_tag_link" ADD CONSTRAINT "event_type_tag_link_tag_id_event_type_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."event_type_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_waste_info" ADD CONSTRAINT "event_waste_info_event_id_event_application_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event_application"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "department_event_status_event_department_idx" ON "department_event_status" USING btree ("event_id","department_id");--> statement-breakpoint
CREATE INDEX "event_application_owner_user_id_status_idx" ON "event_application" USING btree ("owner_user_id","status");--> statement-breakpoint
CREATE INDEX "event_application_start_at_idx" ON "event_application" USING btree ("start_at");--> statement-breakpoint
CREATE INDEX "event_application_location_preset_id_idx" ON "event_application" USING btree ("location_preset_id");--> statement-breakpoint
CREATE INDEX "event_artifact_event_id_idx" ON "event_artifact" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_audit_log_event_id_idx" ON "event_audit_log" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_audit_log_actor_user_id_idx" ON "event_audit_log" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "event_document_event_id_kind_idx" ON "event_document" USING btree ("event_id","kind");--> statement-breakpoint
CREATE INDEX "event_status_history_event_id_idx" ON "event_status_history" USING btree ("event_id");