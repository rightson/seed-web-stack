import { createYoga } from 'graphql-yoga';
import { schema, getContext } from '../../../../../lib/graphql/schema';

const { handleRequest } = createYoga({
  schema,
  context: ({ request }) => getContext(request),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
});

export { handleRequest as GET, handleRequest as POST };
