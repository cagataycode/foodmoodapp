-- Migration to add mood scores support
-- This allows storing up to 4 moods with different scores based on order

-- Add a new column to store mood scores as JSONB
-- Format: [{"mood": "happy", "score": 4}, {"mood": "energised", "score": 3}, ...]
ALTER TABLE public.food_logs 
ADD COLUMN mood_scores JSONB DEFAULT '[]'::jsonb;

-- Add a constraint to ensure mood_scores array has at most 4 elements
ALTER TABLE public.food_logs 
ADD CONSTRAINT check_mood_scores_length 
CHECK (jsonb_array_length(mood_scores) <= 4);

-- Add a constraint to ensure each mood score object has required fields
ALTER TABLE public.food_logs 
ADD CONSTRAINT check_mood_scores_format 
CHECK (
  jsonb_array_length(mood_scores) = 0 OR
  (jsonb_array_length(mood_scores) > 0 AND 
   jsonb_array_length(mood_scores) <= 4 AND
   (SELECT bool_and(
     jsonb_typeof(value->'mood') = 'string' AND 
     jsonb_typeof(value->'score') = 'number' AND
     (value->>'score')::int >= 1 AND (value->>'score')::int <= 4
   ) FROM jsonb_array_elements(mood_scores))
  )
);

-- Create an index for mood scores queries
CREATE INDEX idx_food_logs_mood_scores ON public.food_logs USING GIN(mood_scores);

-- Update the existing moods column constraint to allow empty arrays (since we're moving to mood_scores)
ALTER TABLE public.food_logs 
DROP CONSTRAINT IF EXISTS food_logs_moods_check;

-- Add new constraint for moods array (keeping for backward compatibility)
ALTER TABLE public.food_logs 
ADD CONSTRAINT food_logs_moods_check 
CHECK (array_length(moods, 1) >= 0); 