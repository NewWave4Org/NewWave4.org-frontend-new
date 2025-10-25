import pino from 'pino';
const logger = pino({ level: 'info' });

export async function GET() {
  logger.info('Environment variables check initiated' + JSON.stringify(process.env));
  return new Response('Environment variables logged successfully.', {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}
