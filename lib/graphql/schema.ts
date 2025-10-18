import { createSchema } from 'graphql-yoga';
import { prisma } from '../prisma';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type User {
      id: ID!
      email: String!
      name: String
      createdAt: String!
    }

    type AuthPayload {
      token: String!
      user: User!
    }

    type Query {
      me: User
      viewer: User
    }

    type Mutation {
      register(email: String!, password: String!, name: String): AuthPayload!
      login(email: String!, password: String!): AuthPayload!
    }
  `,
  resolvers: {
    Query: {
      me: async (_, __, context) => {
        if (!context.userId) {
          return null;
        }
        return prisma.user.findUnique({
          where: { id: context.userId },
        });
      },
      viewer: async (_, __, context) => {
        if (!context.userId) {
          return null;
        }
        return prisma.user.findUnique({
          where: { id: context.userId },
        });
      },
    },
    Mutation: {
      register: async (_, { email, password, name }) => {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
          },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);

        return {
          token,
          user,
        };
      },
      login: async (_, { email, password }) => {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);

        return {
          token,
          user,
        };
      },
    },
  },
});

export function getContext(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return { userId: decoded.userId };
    } catch (err) {
      return {};
    }
  }

  return {};
}
