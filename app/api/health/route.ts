import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    services: {
      database: 'unknown',
      storage: 'unknown',
      mlApi: 'unknown',
    },
    config: {
      nodeEnv: process.env.NODE_ENV || 'development',
      mongoConfigured: !!process.env.MONGODB_URI,
      cloudinaryConfigured: !!process.env.CLOUDINARY_URL,
      mlEnabled: process.env.ENABLE_ML_PREDICTIONS === 'true',
    },
  };

  // Check MongoDB connectivity
  try {
    if (checks.config.mongoConfigured) {
      const db = await getDb();
      await db.command({ ping: 1 });
      checks.services.database = 'ok';
    } else {
      checks.services.database = 'not_configured';
    }
  } catch {
    checks.services.database = 'error';
    checks.status = 'degraded';
  }

  // Check Cloudinary configuration
  checks.services.storage = checks.config.cloudinaryConfigured
    ? 'configured'
    : 'not_configured';

  // Check ML API
  const apiUrl = process.env.API_URL;
  if (!apiUrl || apiUrl === 'disabled') {
    checks.services.mlApi = 'disabled';
  } else {
    checks.services.mlApi = 'configured';
  }

  // Overall health
  const isHealthy =
    checks.services.database === 'ok' ||
    checks.services.database === 'configured';
  checks.status = isHealthy ? 'healthy' : 'unhealthy';

  return NextResponse.json(checks, {
    status: isHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
