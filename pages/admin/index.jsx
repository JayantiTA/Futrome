import { useRouter } from 'next/router';

export default function DashboardAdmin() {
  const router = useRouter();
  return (router.push('/admin/users'));
}
