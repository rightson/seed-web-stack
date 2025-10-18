import { createYoga } from 'graphql-yoga';
import { schema, getContext } from '../../../../../lib/graphql/schema';
import { verifyDatabaseConnection } from '../../../../../lib/verify-db';

// Verify database connection on server startup
let dbVerified = false;
if (!dbVerified) {
  verifyDatabaseConnection()
    .then(() => {
      dbVerified = true;
    })
    .catch((error) => {
      console.error('Failed to connect to database on startup');
    });
}

const { handleRequest } = createYoga({
  schema,
  context: ({ request }) => getContext(request),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
});

export { handleRequest as GET, handleRequest as POST };
