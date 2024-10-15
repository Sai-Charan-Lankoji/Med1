export default (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    publicRuntimeConfig: {
      MEDUSA_BACKEND_URL: 'http://localhost:9000',  
    },
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '9000',  
          pathname: '/uploads/**',  
        },
        {
          protocol: 'https',
          hostname: 'medusa-public-images.s3.eu-west-1.amazonaws.com',
          pathname: '/**',  
        },
      ],
    },
  };
  return nextConfig
}