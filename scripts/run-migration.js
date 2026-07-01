const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const connectionString =
  'postgres://postgres.ibjzssvimsmdxxekqshy:lGyVYuaIreHuD5UC@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require&uselibpqcompat=true';

const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
const targetFile = process.argv[2];

const files = targetFile
  ? [targetFile]
  : fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database');

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await client.query(sql);
      console.log(`Applied ${file}`);
    }

    console.log('All migrations applied successfully');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
