export default (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    publicRuntimeConfig: {
      MEDUSA_BACKEND_URL: 'http://localhost:9000',  
    },
    images: {
      domains: ['localhost','ik.imagekit.io'],
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '9000',  
          pathname: '/uploads/**',  
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8003',  
          pathname: '/uploads/**',  
        },
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8004',  
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