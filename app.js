const bot = require("./bot.js");
bot.setWebHook("127.0.0.1", {
  certificate: "./crt.pem",
});
const controllers = require("./controllers/controllers.js");

const { interval } = require("./config.js");

const redis = require("redis");
const redisClient = redis.createClient();

bot.onText(/\/start/, (msg) => {
  redisClient.sadd(["users", msg.chat.id], function (err, reply) {
    console.log(reply);
  });
  controllers.sendStart(msg);
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  switch (msg.text) {
    case "⭐️ ОТЗЫВЫ ⭐️":
      controllers.sendReviews(msg);
      break;
    case "❓ КАК ПОЛУЧИТЬ":
      controllers.sendHowToGet(msg);
      break;
  }
});

bot.on("callback_query", (query) => {
  const chatId = msg.chat.id;
  let type;
  let data;

  try {
    data = JSON.parse(query.data);
    type = data.type;
    console.log(type);
    if (!type) return;
    const cbTypes = {
      balance: () => controllers.sendBalance(data.tokenName, chatId),
    };
    cbTypes[type]();
  } catch {
    (err) => {
      throw new Error("data is not an object");
    };
  }
});

bot.on("polling_error", (error) => {
  console.log(error);
});

bot.on("webhook_error", (error) => {
  console.log(error.code);
});

redisClient.on("error", function (error) {
  console.error(error);
});

setInterval(() => {
  redisClient.smembers("users", function (err, users) {
    for (chatID of users) {
      controllers.sendNotification(chatID);
    }
  });
}, interval);
