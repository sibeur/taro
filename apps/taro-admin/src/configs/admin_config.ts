export default () => ({
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/taro',
  ADMIN_ENV: process.env.ADMIN_ENV || 'development',
  MEDIA_API_URL: process.env.MEDIA_API_URL || 'http://localhost:3000',
});
