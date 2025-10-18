//@ts-check

// Load environment variables from root .env file
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  webpack: (config) => {
    // Ensure __generated__ directory is properly resolved
    config.resolve.modules = config.resolve.modules || [];
    config.resolve.modules.push(__dirname);
    return config;
  },
};

module.exports = nextConfig;
