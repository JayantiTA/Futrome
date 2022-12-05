import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../store/store';

const authOnlyPages = ['/about'];

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    if (authOnlyPages.some((path) => router.pathname.startsWith(path)) && user === undefined) {
      setIsAuthorized(false);
      router.push({
        pathname: '/login',
      });
    } else {
      setIsAuthorized(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (isAuthorized && children);
}
