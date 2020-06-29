import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { bot } from '../libs/bot';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const success = true;

  const { body } = event;

  await bot.receiveUpdates([JSON.parse(body)]);

  return {
    statusCode: 200,
    body: JSON.stringify({ success }),
  };
};

export const setWebhook = async () => {
  const endpoints = require('../../endpoints.json');

  await bot.setWebhook(endpoints.telegram.POST);
};
