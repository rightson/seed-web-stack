import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from 'relay-runtime';

const HTTP_ENDPOINT = '/api/graphql';

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

const fetchFn: FetchFunction = async (request, variables) => {
  const token = getToken();

  const resp = await fetch(HTTP_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });

  return await resp.json();
};

function createEnvironment() {
  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
}

let environment: Environment | null = null;

export function getEnvironment(): Environment {
  if (typeof window === 'undefined') {
    // Server-side: always create a new environment
    return createEnvironment();
  }

  // Client-side: reuse environment
  if (!environment) {
    environment = createEnvironment();
  }

  return environment;
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}
