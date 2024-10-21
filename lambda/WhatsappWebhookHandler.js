// lambda/whatsappWebhookHandler.js
//

const yaml = require('js-yaml')
const aws = require('aws-sdk')
const s3 = new AWS.S3()

exports.handler = async (event) => {
  try {

    const apiKey = process.env.API_KEY;
    const bucket = process.env.BUCKET_NAME

    const response = await s3.send(new s3.GetObjectCommand({Bucket: bucket, key: "config.yaml"}))
    const str = response.Body.transformToString();


    console.log("Yaml file:", str);

    const body = JSON.parse(event.body || '{}');
    console.log(event)

    return {
      statusCode: 200,
      body: "OK",
    };
  } catch (error) {
    console.error("Error processing webhook:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process webhook." }),
    };
  }
};

