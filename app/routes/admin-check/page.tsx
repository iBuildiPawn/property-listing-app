import { AdminStatusChecker } from '@/app/components/admin/admin-status-checker';

export default function AdminCheckPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Status Check</h1>
      <p className="mb-6">
        This page allows you to check if your account has admin privileges and make yourself an admin if needed.
      </p>
      
      <div className="max-w-md mx-auto">
        <AdminStatusChecker />
      </div>
      
      <div className="mt-10 p-4 bg-muted rounded-md max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting</h2>
        <p className="mb-4">If you're having trouble accessing the admin dashboard, try the following:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Make sure you're logged in with the correct account</li>
          <li>Check if your account has admin privileges using the tool above</li>
          <li>If the tool shows you're an admin but you still can't access the dashboard, try logging out and logging back in</li>
          <li>Clear your browser cache and cookies</li>
          <li>If all else fails, use the "Make Me Admin" button above to set your admin status directly</li>
        </ol>
      </div>
    </div>
  );
} 