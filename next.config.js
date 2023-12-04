/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["hackerconnect-images.s3.amazonaws.com"],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
  output: 'standalone'
};

module.exports = nextConfig;
