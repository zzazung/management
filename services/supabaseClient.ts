
import { createClient } from '@supabase/supabase-js';

// 실제 환경에서는 process.env.SUPABASE_URL 및 process.env.SUPABASE_ANON_KEY를 사용해야 합니다.
// 여기서는 환경 변수가 제공된다고 가정합니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
