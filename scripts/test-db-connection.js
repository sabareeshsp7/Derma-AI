const { Client } = require('pg');

async function testConnection() {
  const password = process.env.DB_PASSWORD || '<Enter_DB_Password>';
  
  const client = new Client({
    host: 'derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password,
    ssl: { rejectUnauthorized: false }
  });

  console.log('Attempting to connect to AWS RDS PostgreSQL...');
  console.log('Host: derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com');
  console.log('Database: postgres');
  console.log('User: postgres');
  console.log('SSL: enabled\n');

  try {
    await client.connect();
    console.log('✅ Database connection successful!\n');
    
    const res = await client.query('SELECT version()');
    console.log('PostgreSQL Version:');
    console.log(res.rows[0].version);
    
    const dbRes = await client.query('SELECT current_database(), current_user');
    console.log('\nConnected to:');
    console.log('Database:', dbRes.rows[0].current_database);
    console.log('User:', dbRes.rows[0].current_user);
    
    const tableRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\nExisting tables in public schema:');
    if (tableRes.rows.length > 0) {
      tableRes.rows.forEach(row => console.log('-', row.table_name));
    } else {
      console.log('No tables found. Run the schema.sql to create tables.');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    throw error;
  } finally {
    await client.end();
    console.log('\n✅ Connection closed.');
  }
}

testConnection().catch(error => {
  console.error('\nTest failed:', error.message);
  process.exit(1);
});
