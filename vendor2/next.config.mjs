export default (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '5000',  
          pathname: '/uploads/**',  
        },
        {
          protocol: 'https',
          hostname: '6655-183-82-111-111.ngrok-free.app',
          port: '',  
          pathname: '/**',  
        },
        {
          protocol: 'https',
          hostname: 'med1-wyou.onrender.com',
          port: '',  
          pathname: '/uploads/**',  

        },
        {
          protocol: "https",
          hostname: "*", 
          pathname: '/**', 
        },
       
        {
          protocol: 'https',
          hostname: 'ik.imagekit.io',
          port: '',  
          pathname: '/zz7harqme/**',  
        },
        {
          protocol: 'https',
          hostname: 'picsum.photos',
          port: '',  
          pathname: '/**',  
        },
        {
          protocol: 'https',
          hostname: 'media.istockphoto.com',
          port: '',  
          pathname: '/**',  
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