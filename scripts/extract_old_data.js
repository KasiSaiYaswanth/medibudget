import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Assuming this script runs from the project root and dotenv is loaded
// dotenv removed; we are using --env-file=.env on the command line instead

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TABLES_TO_EXTRACT = [
  'medicines',
  'hospitals',
  'government_schemes',
  'insurance_providers'
];

async function extractData() {
  const exportDir = path.join(process.cwd(), 'supabase_export');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  for (const table of TABLES_TO_EXTRACT) {
    console.log(`Extracting data from ${table}...`);
    // Fetch all rows
    const { data, error } = await supabase.from(table).select('*');
    
    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
      continue;
    }
    
    if (data) {
      console.log(`Successfully fetched ${data.length} rows from ${table}`);
      fs.writeFileSync(
        path.join(exportDir, `${table}.json`),
        JSON.stringify(data, null, 2),
        'utf-8'
      );
    }
  }
  
  console.log('Extraction complete! Data saved to supabase_export folder.');
}

extractData();
