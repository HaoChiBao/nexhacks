import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL

// Check for various key names including the generic SUPABASE_KEY which might be used
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                    process.env.NEXT_PUBLIC_SUPABASE_KEY || 
                    process.env.SUPABASE_PUB_KEY || 
                    process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing! Using (non-functional) placeholders to prevent crash.")
  console.warn("Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.")
}

// Use placeholders if missing to allow app initialization
const finalUrl = supabaseUrl || "https://placeholder.supabase.co"
const finalKey = supabaseKey || "placeholder"

export const supabase = createClient(finalUrl, finalKey)
