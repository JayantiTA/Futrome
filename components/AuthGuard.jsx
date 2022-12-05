import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/store';

const authOnlyPages = ['/profile', '/reserve', '/invoice', '/pay'];

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = React.useState(false);
  const user = useAuthStore((state) => state.session?.user);

  React.useEffect(() => {
    if (authOnlyPages.some((path) => router.pathname.startsWith(path)) && user === undefined) {
      setAuthorized(false);
      router.push({
        pathname: '/login',
      });
    } else {
      setAuthorized(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (authorized && children);
}
