export default () => ({
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/taro',
});
