import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk/aws-s3-deployment";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as path from "path";

export class TransferWindowBotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "TransferBucket", {
      versioned: false, // Optional: Enable versioning
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });
    const whatsappLambda = new lambda.Function(this, "WhatsappWebhookHandler", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(path.join(__dirname, "../lambda")),
      handler: "WhatsappWebhookHandler.handler",
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    bucket.grantReadWrite(whatsappLambda);

    s3deploy.BucketDeployment(this, "deploy-config", {
      source: s3deploy.Source.asset("../config.yaml"),
      destinationBucket: bucket,
    });

    const api = new apigateway.RestApi(this, "WhatsappApiGateway", {
      restApiName: "WhatsApp Webhook API",
      description: "API Gateway for receiving WhatsApp webhook events.",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ["POST", "GET"],
      },
    });

    const whatsappIntegration = new apigateway.LambdaIntegration(
      whatsappLambda,
    );

    const webhookResource = api.root.addResource("whatsapp-webhook");
    webhookResource.addMethod("POST", whatsappIntegration, {});
    webhookResource.addMethod("GET", whatsappIntegration, {});
  }
}
