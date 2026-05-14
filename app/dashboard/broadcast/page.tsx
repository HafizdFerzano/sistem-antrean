import { redirect } from 'next/navigation';

// Fitur Broadcast telah dihapus. Redirect ke dashboard.
export default function BroadcastPage() {
  redirect('/dashboard');
}
