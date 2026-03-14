CREATE TABLE profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    plan TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'My Resume',
    theme TEXT DEFAULT 'dark',
    meta JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    content JSONB DEFAULT '{}',
    styles JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own resumes" ON resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes" ON resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes" ON resumes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes" ON resumes
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view blocks for their own resumes" ON blocks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM resumes
            WHERE resumes.id = blocks.resume_id AND resumes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert blocks for their own resumes" ON blocks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM resumes
            WHERE resumes.id = blocks.resume_id AND resumes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update blocks for their own resumes" ON blocks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM resumes
            WHERE resumes.id = blocks.resume_id AND resumes.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete blocks for their own resumes" ON blocks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM resumes
            WHERE resumes.id = blocks.resume_id AND resumes.user_id = auth.uid()
        )
    );
