import { trpc } from '../utils/trpc';

export default function Page() {
  const hello = trpc.hello.useQuery({ text: 'Mark Uche!' });
  const health = trpc.healthcheck.useQuery()
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <><div>
      <p>{hello.data.greeting}</p>
    </div><div>
        <p>{health.data}</p>
      </div></>
  );
  }