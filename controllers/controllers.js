const { reject } = require("bluebird");
const { resolve } = require("path/posix");
const bot = require("../bot.js");

const texts = require("../texts.js");
function getChatID(msg) {
  return msg.chat.id;
}

function sendReply(chatID, reply) {
  return new Promise((resolve, reject) => {
    if (reply.photo !== undefined)
      bot.sendPhoto(chatID, reply.photo).then((res) => {
        //console.log(res);
        resolve();
      });
    else if (reply.text)
      bot
        .sendMessage(chatID, reply.text, {
          reply_markup: {
            resize_keyboard: true,
            inline_keyboard: reply.inline_keyboard,
            keyboard: reply.keyboard,
          },
        })
        .then((res) => {
          //console.log(res);
          resolve();
        });
  });
}

async function sendFromMas(chatID, mas) {
  for (reply of mas) {
    await sendReply(chatID, reply);
  }
}

function sendStart(msg) {
  let chatID = getChatID(msg);
  sendFromMas(chatID, texts.start);
}

function sendHowToGet(msg) {
  let chatID = getChatID(msg);
  sendFromMas(chatID, texts.howToGet);
}

function sendReviews(msg) {
  let chatID = getChatID(msg);
  for (reply of texts.reviews) {
    if (reply.photo !== undefined) bot.sendPhoto(chatID, reply.photo);
    else if (reply.text)
      bot.sendMessage(chatID, reply.text, {
        reply_markup: { inline_keyboard: reply.inline_keyboard },
      });
    else if (reply.constructor.name == "Array") sendFromMas(chatID, reply);
  }
}

function sendNotification(chatID) {
  sendFromMas(chatID, texts.notification);
}

module.exports = { sendStart, sendHowToGet, sendReviews, sendNotification };
