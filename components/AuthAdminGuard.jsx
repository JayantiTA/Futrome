import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/store';

const authAdminPages = ['/admin'];

export default function AuthAdminGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = React.useState(false);
  const user = useAuthStore((state) => state.session?.user);

  React.useEffect(() => {
    if (
      authAdminPages.some((path) => router.pathname.startsWith(path))
      && user === undefined) {
      setAuthorized(false);
      router.push({
        pathname: '/login',
      });
    } else if (authAdminPages.some((path) => router.pathname.startsWith(path))
    && user?.role !== 'admin') {
      setAuthorized(false);
      router.push({
        pathname: '/error',
        query: {
          statusCode: 403,
        },
      });
    } else {
      setAuthorized(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (authorized && children);
}
