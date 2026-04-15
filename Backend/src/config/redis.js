
// const { createClient } = require('../../../Day05/Bakend/Day05/node_modules/redis');

// const redisClient = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASS,
//     socket: {
//         host: 'redis-15903.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
//         port: 15903
//     }
// });

// module.exports = redisClient;

const { createClient } = require('redis');

const redisClient = createClient({
  username: 'default',
  password: process.env.REDIS_PASS,
  socket: {
    host: 'redis-15903.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
    port: 15903
  }
});

module.exports = redisClient;