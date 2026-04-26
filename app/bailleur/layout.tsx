import { AppLayout } from '@/components/layout/AppLayout';

export default function BailleurLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout role="BAILLEUR">{children}</AppLayout>;
}
