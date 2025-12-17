-- Add updated_at column to link_bio_links and link_bio_pages if they don't exist

ALTER TABLE link_bio_links 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

ALTER TABLE link_bio_pages
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
