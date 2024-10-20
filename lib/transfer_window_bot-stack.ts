import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as path from 'path';

export class TransferWindowBotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define the Lambda function using code from the external file
    const whatsappLambda = new lambda.Function(this, 'WhatsappWebhookHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      handler: 'whatsappWebhookHandler.handler',
      environment: {
      },
    });

    // Define the API Gateway REST API with a dedicated endpoint for the webhook
    const api = new apigateway.RestApi(this, 'WhatsappApiGateway', {
      restApiName: 'WhatsApp Webhook API',
      description: 'API Gateway for receiving WhatsApp webhook events.',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ['POST'],
      },
    });

    // Integrate the Lambda function with API Gateway
    const whatsappIntegration = new apigateway.LambdaIntegration(whatsappLambda);

    // Add a specific resource and method for the WhatsApp Webhook
    const webhookResource = api.root.addResource('whatsapp-webhook');
    webhookResource.addMethod('POST', whatsappIntegration, {
    });
  }
}

