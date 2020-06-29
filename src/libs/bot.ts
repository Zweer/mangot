import * as Telebot from 'telebot';

import { User } from '../models/user';

console.log(process.env.TELEGRAM_TOKEN);

export const bot = new Telebot(process.env.TELEGRAM_TOKEN);

bot.on('*', async (msg) => {
  const { chat } = msg;

  if (chat.type === 'private') {
    const { id } = chat;

    try {
      msg.user = await User.get({ item: { id } });
    } catch {
      msg.user = Object.assign(new User(), {
        id: `${id}`,
        username: chat.username,
        firstName: chat.first_name,
        lastName: chat.last_name,
      });

      await msg.user.put();
    }
  }
});

bot.on(['/start', '/help'], async (msg) => {
  await msg.reply.text(`
Welcome to Mangot, your favourite Manga Bot

/sites: a list of the sites available
/list: for each site, a list of manga
/profile: your profile
`);
});

bot.on('/profile', async (msg) => {
  await msg.reply.text(`
You are ${msg.user.name} (${msg.user.username})
`);
});

