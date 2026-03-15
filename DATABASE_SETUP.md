# AWS RDS PostgreSQL Database Setup Guide

## Database Configuration

**RDS Instance Details:**
- Host: `derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com`
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Region: `ap-south-1`
- SSL: Required (enabled)

## Quick Setup Steps

### 1. Install Required Packages

Already included in package.json:
```bash
npm install pg aws-sdk
```

Or if needed:
```bash
npm install
```

### 2. Configure Environment Variables

Update your `.env.local` file with your actual database password:

```env
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com:5432/postgres

DB_HOST=derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=YOUR_ACTUAL_PASSWORD
DB_SSL=true
```

**⚠️ IMPORTANT:** Replace `YOUR_ACTUAL_PASSWORD` with your actual RDS master password.

### 3. Test Database Connection

Run the connection test script:

```bash
npm run test:db
```

Or with password as environment variable:
```bash
DB_PASSWORD=your_password npm run test:db
```

You should see output like:
```
✅ Database connection successful!

PostgreSQL Version:
PostgreSQL 15.x on x86_64-pc-linux-gnu...

Connected to:
Database: postgres
User: postgres

Existing tables in public schema:
(empty or list of tables)
```

### 4. Create Database Schema

Once the connection test is successful, apply the database schema:

#### Option A: Using psql
```bash
psql "postgresql://postgres:YOUR_PASSWORD@derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com:5432/postgres?sslmode=require" -f database/schema.sql
```

#### Option B: Using pgAdmin
1. Open pgAdmin
2. Add new server with connection details:
   - Host: `derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres`
   - Password: `<your-password>`
   - SSL Mode: `require`
3. Open Query Tool
4. Load and execute `database/schema.sql`

#### Option C: Using Node.js Script
```bash
node -e "
const fs = require('fs');
const { Client } = require('pg');
const schema = fs.readFileSync('database/schema.sql', 'utf8');
const client = new Client({
  host: 'derma-ai.cpacw8wwgbkg.ap-south-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});
client.connect().then(() => {
  return client.query(schema);
}).then(() => {
  console.log('Schema created successfully');
  return client.end();
}).catch(console.error);
"
```

### 5. Verify Schema Creation

Run the test script again to see the created tables:
```bash
npm run test:db
```

Expected tables:
- `profiles`
- `user_settings`
- `medical_history`
- `appointments`
- `products`
- `orders`
- `order_items`
- (and others from schema.sql)

## Connection Details

### SSL Configuration

AWS RDS requires SSL connections. The connection is configured to use SSL with `rejectUnauthorized: false` which is acceptable for development.

For production, download the AWS RDS CA certificate:
```bash
curl -o rds-ca-bundle.pem https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
```

Then update your connection:
```javascript
ssl: { 
  rejectUnauthorized: true,
  ca: fs.readFileSync('./rds-ca-bundle.pem').toString()
}
```

### Connection Pooling

The application uses connection pooling configured in `lib/aws-database.ts`:
- Max connections: 20
- Idle timeout: 30 seconds
- Connection timeout: 10 seconds

## Troubleshooting

### Connection Timeout

**Error:** `connect ETIMEDOUT`

**Solutions:**
1. Check Security Group rules in AWS RDS
   - Ensure inbound rule allows PostgreSQL (port 5432) from your IP
2. Check VPC and subnet configuration
3. Verify RDS instance is publicly accessible (if connecting from outside AWS)

### Authentication Failed

**Error:** `password authentication failed for user "postgres"`

**Solutions:**
1. Double-check your password
2. Verify the master username in RDS is `postgres`
3. Check if password contains special characters that need escaping

### SSL Connection Error

**Error:** `SSL SYSCALL error` or `no pg_hba.conf entry`

**Solutions:**
1. Ensure SSL is enabled: `ssl: { rejectUnauthorized: false }`
2. Check RDS parameter group has `rds.force_ssl = 1`
3. Try connecting with `sslmode=require` in connection string

### Database Does Not Exist

**Error:** `database "postgres" does not exist`

**Solutions:**
1. Verify the database name - default is usually `postgres`
2. Create database if needed:
   ```sql
   CREATE DATABASE dermasense_ai;
   ```
3. Update DATABASE_URL to use new database name

## AWS Console Configuration

### Security Group Rules

1. Go to **EC2 → Security Groups**
2. Find the security group attached to your RDS instance
3. Add Inbound Rule:
   - Type: PostgreSQL
   - Protocol: TCP
   - Port: 5432
   - Source: Your IP address or `0.0.0.0/0` (for testing only!)

### RDS Instance Settings

1. Go to **RDS → Databases → derma-ai**
2. Verify:
   - ✅ Publicly accessible: Yes (if connecting from outside AWS)
   - ✅ VPC security group allows access
   - ✅ Subnet group has internet gateway (if public)
   - ✅ SSL/TLS enabled

## Database Maintenance

### Backup and Restore

AWS RDS provides automated backups. To create manual snapshot:
```bash
aws rds create-db-snapshot \
  --db-instance-identifier derma-ai \
  --db-snapshot-identifier derma-ai-manual-backup-$(date +%Y%m%d) \
  --region ap-south-1
```

### Monitoring

Check database performance in AWS Console:
- **CloudWatch Metrics:** CPU, connections, IOPS
- **Performance Insights:** Query performance analysis
- **Logs:** PostgreSQL logs in CloudWatch Logs

### Managing Connections

View active connections:
```sql
SELECT * FROM pg_stat_activity;
```

Kill a connection:
```sql
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid = <pid>;
```

## Production Best Practices

1. **Use Parameter Store or Secrets Manager**
   ```bash
   aws secretsmanager create-secret \
     --name dermasense/db/password \
     --secret-string "your-secure-password" \
     --region ap-south-1
   ```

2. **Enable Multi-AZ Deployment**
   - Provides high availability
   - Automatic failover

3. **Set Up Read Replicas**
   - Offload read queries
   - Improve performance

4. **Configure Automated Backups**
   - Retention period: 7-30 days
   - Backup window: Off-peak hours

5. **Enable Enhanced Monitoring**
   - OS-level metrics
   - Real-time monitoring

6. **Use IAM Database Authentication**
   - No password management
   - Leverages IAM policies

## Next Steps

1. ✅ Test connection: `npm run test:db`
2. ✅ Apply schema: Run `database/schema.sql`
3. ✅ Verify tables: Run `npm run test:db` again
4. Configure AWS Cognito (see COGNITO_VERIFICATION.md)
5. Test authentication flow
6. Deploy application

## Support & Resources

- [AWS RDS PostgreSQL Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js pg Library](https://node-postgres.com/)
