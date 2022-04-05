/** @type {import('next').NextConfig} */

const APP = 'RISK';
//const APP = 'CLIENT';

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer } ) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
    return config;
  },
  webpackDevMiddleware: config => {
    return config;
  },
  rewrites: async () => {
    if(APP === 'RISK') {
      return [
        {
          source: '/graphql',
          destination: 'https://risk.anchorage-development.com/graphql',
        }
      ];
    }
    if(APP === 'CLIENT') {
      return [
        {
          source: '/graphql',
          destination: 'https://clientdashboard.anchorage-development.com/graphql',
        },
      ]
    }
  }
};

module.exports = nextConfig;
