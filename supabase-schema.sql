-- Timer4Sport Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Workout sessions table
create table if not exists workout_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  exercise_type text not null check (exercise_type in ('plank', 'hiit')),
  duration_seconds integer not null check (duration_seconds > 0),
  hiit_config jsonb,
  started_at timestamptz not null,
  created_at timestamptz default now() not null
);

-- HIIT presets table (optional, for saving custom configurations)
create table if not exists hiit_presets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  work_seconds integer not null check (work_seconds > 0),
  rest_seconds integer not null check (rest_seconds > 0),
  rounds integer not null check (rounds > 0),
  created_at timestamptz default now() not null
);

-- Indexes for better query performance
create index if not exists idx_workout_sessions_user_id on workout_sessions(user_id);
create index if not exists idx_workout_sessions_started_at on workout_sessions(started_at desc);
create index if not exists idx_workout_sessions_exercise_type on workout_sessions(exercise_type);

-- Row Level Security (RLS) policies
alter table workout_sessions enable row level security;
alter table hiit_presets enable row level security;

-- Users can only see their own workout sessions
create policy "Users can view own workout sessions"
  on workout_sessions for select
  using (auth.uid() = user_id);

-- Users can insert their own workout sessions
create policy "Users can insert own workout sessions"
  on workout_sessions for insert
  with check (auth.uid() = user_id);

-- Users can delete their own workout sessions
create policy "Users can delete own workout sessions"
  on workout_sessions for delete
  using (auth.uid() = user_id);

-- Users can only see their own HIIT presets
create policy "Users can view own hiit presets"
  on hiit_presets for select
  using (auth.uid() = user_id);

-- Users can insert their own HIIT presets
create policy "Users can insert own hiit presets"
  on hiit_presets for insert
  with check (auth.uid() = user_id);

-- Users can update their own HIIT presets
create policy "Users can update own hiit presets"
  on hiit_presets for update
  using (auth.uid() = user_id);

-- Users can delete their own HIIT presets
create policy "Users can delete own hiit presets"
  on hiit_presets for delete
  using (auth.uid() = user_id);
