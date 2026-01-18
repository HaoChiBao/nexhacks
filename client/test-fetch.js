const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nuwqanlmvffqjfahxufb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_v8cAUYGVd1iPNdX4Ce6Vpg_eCID1oJU';

console.log('Testing Supabase connection...');
console.log('URL:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  try {
    const { data, error } = await supabase.from('funds').select('*');
    if (error) {
      console.error('Supabase Error:', error);
    } else {
      console.log('Success! Data fetched:', data);
    }
  } catch (err) {
    console.error('Unexpected Error:', err);
  }
}

run();
