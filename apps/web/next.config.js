//@ts-check

// Load environment variables from root .env file
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {
    svgr: false,
  },
  webpack: (config) => {
    // Ensure __generated__ directory is properly resolved
    config.resolve.modules = config.resolve.modules || [];
    config.resolve.modules.push(__dirname);
    return config;
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
