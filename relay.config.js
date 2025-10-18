module.exports = {
  src: './apps/web',
  language: 'typescript',
  schema: './schema.graphql',
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__generated__/**'],
  artifactDirectory: './apps/web/__generated__',
};
