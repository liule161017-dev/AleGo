// utils/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr'

// 请在 Supabase Dashboard -> Settings -> API 找到这两个值
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kmcccsvgdmmnituxxaej.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttY2Njc3ZnZG1tbml0dXh4YWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMTM0MTcsImV4cCI6MjA5MjU4OTQxN30.vSRMd1wsgME_EXOVQdn-iUs5awC9sS9Tj5fN7LhoVJM';

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);