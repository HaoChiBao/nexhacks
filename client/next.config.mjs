/** @type {import('next').NextConfig} */
const nextConfig = {
    // React strict mode is enabled by default
    swcMinify: false,
};

// Validate environment variables during build
if (process.env.NODE_ENV === 'production') {
    const missing = [];
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY && !process.env.NEXT_PUBLIC_SUPABASE_KEY && !process.env.SUPABASE_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    if (missing.length > 0) {
        console.warn(`\n\x1b[33mWARN: The following environment variables seem to be missing for the production build: ${missing.join(', ')}. \nSupabase functionality may not work as expected.\x1b[0m\n`);
    }
}

export default nextConfig;
