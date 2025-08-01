import { cookies } from 'next/headers';

async function Users() {
  const session = (await cookies()).get('accessToken')?.value
  console.log('session', session)
  return (
    <div>
      asd
    </div>
  );
}

export default Users;