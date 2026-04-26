import { AppLayout } from '@/components/layout/AppLayout';

export default function CommuneLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout role="COMMUNE">{children}</AppLayout>;
}
