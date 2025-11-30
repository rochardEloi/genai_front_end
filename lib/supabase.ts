'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = typeof window !== 'undefined'
  ? process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ffuqcwcevlqpwdtronqu.supabase.co'
  : 'https://ffuqcwcevlqpwdtronqu.supabase.co';

const supabaseAnonKey = typeof window !== 'undefined'
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdXFjd2NldmxxcHdkdHJvbnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NDAzNDcsImV4cCI6MjA3OTUxNjM0N30.zfRlVAZPYvNJXyzggaXHWvU5SlOkfk5w1T10zVfM3NM'
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdXFjd2NldmxxcHdkdHJvbnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NDAzNDcsImV4cCI6MjA3OTUxNjM0N30.zfRlVAZPYvNJXyzggaXHWvU5SlOkfk5w1T10zVfM3NM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
