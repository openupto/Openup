-- Migration to extend link_bio_theme_settings table
-- This should be run in the Supabase SQL Editor

ALTER TABLE link_bio_theme_settings 
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS avatar_url text,
ADD COLUMN IF NOT EXISTS show_avatar boolean DEFAULT true,

ADD COLUMN IF NOT EXISTS bg_image_url text,
ADD COLUMN IF NOT EXISTS bg_blur integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS bg_opacity integer DEFAULT 100,
ADD COLUMN IF NOT EXISTS bg_overlay_color text DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS bg_overlay_opacity integer DEFAULT 0,

ADD COLUMN IF NOT EXISTS font_size integer DEFAULT 16,
ADD COLUMN IF NOT EXISTS font_weight integer DEFAULT 400,
ADD COLUMN IF NOT EXISTS text_color text DEFAULT '#000000',

ADD COLUMN IF NOT EXISTS button_radius integer DEFAULT 8,
ADD COLUMN IF NOT EXISTS button_padding_y integer DEFAULT 16,
ADD COLUMN IF NOT EXISTS button_padding_x integer DEFAULT 24,
ADD COLUMN IF NOT EXISTS button_bg text,
ADD COLUMN IF NOT EXISTS button_border_color text DEFAULT 'transparent',
ADD COLUMN IF NOT EXISTS button_shadow integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS button_hover_effect text DEFAULT 'none', -- none, lift, glow, invert

ADD COLUMN IF NOT EXISTS page_width text DEFAULT 'md', -- sm, md, lg
ADD COLUMN IF NOT EXISTS align text DEFAULT 'center', -- left, center
ADD COLUMN IF NOT EXISTS spacing integer DEFAULT 16,
ADD COLUMN IF NOT EXISTS show_link_icons boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS open_in_new_tab boolean DEFAULT true,

ADD COLUMN IF NOT EXISTS entrance_animation text DEFAULT 'none', -- none, fade, slide, pop
ADD COLUMN IF NOT EXISTS reduce_motion_respects_os boolean DEFAULT true,

ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS show_social_icons boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS social_icon_style text DEFAULT 'colored'; -- mono, colored, glass
