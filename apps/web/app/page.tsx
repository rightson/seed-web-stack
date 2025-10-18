import Link from 'next/link';

export default function Index() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Auth App</h1>
        <p className="text-gray-600 mb-6">
          A Next.js app with GraphQL Yoga, Relay, Prisma, and Tailwind CSS
        </p>
        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
