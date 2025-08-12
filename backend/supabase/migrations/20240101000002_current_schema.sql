-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create food_logs table
CREATE TABLE public.food_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    food_name TEXT NOT NULL CHECK (char_length(food_name) <= 100),
    food_id TEXT, -- For Open Food Facts integration
    moods TEXT[] NOT NULL CHECK (array_length(moods, 1) > 0), -- Multiple moods as array
    meal_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    portion_size TEXT CHECK (char_length(portion_size) <= 50),
    notes TEXT CHECK (char_length(notes) <= 500),
    meal_type TEXT CHECK (meal_type = ANY (ARRAY['breakfast'::text, 'lunch'::text, 'dinner'::text, 'snack'::text])),
    image_base64 TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table (extends auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE CHECK (char_length(username) <= 50),
    email TEXT UNIQUE CHECK (char_length(email) <= 255),
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create insights table for storing generated insights
CREATE TABLE public.insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    insight_type TEXT NOT NULL CHECK (insight_type IN ('weekly', 'monthly')),
    title TEXT NOT NULL CHECK (char_length(title) <= 200),
    description TEXT NOT NULL CHECK (char_length(description) <= 1000),
    data JSONB DEFAULT '{}'::jsonb, -- Contains patterns, educational content, and statistics
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_food_logs_user_id ON public.food_logs(user_id);
CREATE INDEX idx_food_logs_meal_time ON public.food_logs(meal_time DESC);
CREATE INDEX idx_food_logs_moods ON public.food_logs USING GIN(moods);
CREATE INDEX idx_food_logs_food_id ON public.food_logs(food_id);

CREATE INDEX idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_subscription ON public.user_profiles(subscription_tier);

CREATE INDEX idx_insights_user_id ON public.insights(user_id);
CREATE INDEX idx_insights_period ON public.insights(period_start, period_end);
CREATE INDEX idx_insights_type ON public.insights(insight_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_food_logs_updated_at BEFORE UPDATE ON public.food_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Food logs policies
CREATE POLICY "Users can view their own food logs" ON public.food_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own food logs" ON public.food_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food logs" ON public.food_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food logs" ON public.food_logs
    FOR DELETE USING (auth.uid() = user_id);

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Insights policies
CREATE POLICY "Users can view their own insights" ON public.insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own insights" ON public.insights
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, username, email)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();