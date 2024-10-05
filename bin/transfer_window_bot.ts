#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TransferWindowBotStack } from '../lib/transfer_window_bot-stack';

const app = new cdk.App();
new TransferWindowBotStack(app, 'TransferWindowBotStack', {
  env: { account: '664418951913', region: 'eu-west-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
