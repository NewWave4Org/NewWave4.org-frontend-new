import { connection } from 'next/server';
import { readServerPublicEnv, serializePublicEnv } from '@/utils/runtime-env';

/*
  Hands the server's public runtime config to the browser (see
  utils/runtime-env.ts). Render it in the <head> of every root layout.

  `connection()` makes the page render per request: without it a page Next
  prerenders at build time would freeze the build machine's (empty) values into
  its HTML.
*/
export default async function PublicEnvScript() {
  await connection();

  return (
    <script
      id="nw-public-env"
      dangerouslySetInnerHTML={{
        __html: serializePublicEnv(readServerPublicEnv()),
      }}
    />
  );
}
