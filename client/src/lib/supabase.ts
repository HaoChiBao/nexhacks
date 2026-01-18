import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL

// Check for various key names including the generic SUPABASE_KEY which might be used
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_KEY || 
                    process.env.SUPABASE_PUB_KEY || 
                    process.env.SUPABASE_KEY

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Please set NEXT_PUBLIC_SUPABASE_URL in your environment variables.')
}

if (!supabaseKey) {
  throw new Error('Missing Supabase Key. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_KEY) in your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
