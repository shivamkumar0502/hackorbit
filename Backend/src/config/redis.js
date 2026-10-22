const { createClient } = require('redis');
const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST || 'redis-15903.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
    port: Number(process.env.REDIS_PORT || 15903),
    connectTimeout: 15000,
  },
});
redisClient.on('error', () => console.error('Redis connection error'));
module.exports = redisClient;
