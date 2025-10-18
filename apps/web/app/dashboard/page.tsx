'use client';

import { useLazyLoadQuery, graphql } from 'react-relay';
import { useRouter } from 'next/navigation';
import { clearToken } from '../../../../lib/relay/environment';

const ViewerQuery = graphql`
  query pageQuery {
    viewer {
      id
      email
      name
    }
  }
`;

export default function DashboardPage() {
  const router = useRouter();
  const data: any = useLazyLoadQuery(ViewerQuery, {});

  const handleLogout = () => {
    clearToken();
    router.push('/auth/login');
  };

  if (!data.viewer) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Email:</span> {data.viewer.email}
            </p>
            {data.viewer.name && (
              <p>
                <span className="font-semibold">Name:</span> {data.viewer.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
