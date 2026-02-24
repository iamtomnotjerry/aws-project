import { Redis } from 'ioredis';
import { URL } from 'url';
import dns from 'dns';

const redisUrl = process.env.REDIS_URL;

async function diagnose() {
  console.log('--- REDIS DIAGNOSTIC START ---');
  
  if (!redisUrl) {
    console.error('❌ REDIS_URL is not set!');
    process.exit(1);
  }

  const url = new URL(redisUrl);
  const host = url.hostname;
  const port = parseInt(url.port || '6379');

  console.log(`Checking host: ${host}:${port}`);
  console.log(`Protocol: ${url.protocol}`);

  // 1. DNS Check
  console.log('\n[1/3] Testing DNS resolution...');
  try {
    const addresses = await dns.promises.resolve4(host);
    console.log(`✅ DNS resolved to: ${addresses.join(', ')}`);
  } catch (err) {
    console.error(`❌ DNS resolution failed:`, err.message);
  }

  // 2. Raw Redis Connection Test (No TLS)
  console.log('\n[2/3] Testing raw connection (ioredis default)...');
  const client = new Redis(redisUrl, {
    connectTimeout: 5000,
    maxRetriesPerRequest: 0,
    family: 4
  });

  try {
    await client.ping();
    console.log('✅ Basic Redis PING successful!');
  } catch (err) {
    console.error(`❌ Basic Redis PING failed: ${err.message}`);
  } finally {
    client.disconnect();
  }

  // 3. Explicit TLS Connection Test
  console.log('\n[3/3] Testing explicit TLS connection (for ElastiCache Serverless)...');
  const tlsClient = new Redis(redisUrl, {
    connectTimeout: 5000,
    maxRetriesPerRequest: 0,
    family: 4,
    tls: {
      rejectUnauthorized: false,
      servername: host
    }
  });

  try {
    await tlsClient.ping();
    console.log('✅ TLS Redis PING successful!');
  } catch (err) {
    console.error(`❌ TLS Redis PING failed: ${err.message}`);
    console.log('\n💡 Hint: Nếu DNS ok nhưng TLS fail, hãy kiểm tra lại Security Group Inbound rules!');
  } finally {
    tlsClient.disconnect();
  }

  console.log('\n--- REDIS DIAGNOSTIC END ---');
}

diagnose();
