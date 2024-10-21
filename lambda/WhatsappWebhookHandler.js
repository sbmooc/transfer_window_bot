const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const yaml = require('js-yaml');

const s3 = new S3Client(); // Create a new S3 client

exports.handler = async (event) => {
  try {
    const apiKey = process.env.API_KEY;
    const bucket = process.env.BUCKET_NAME;

    const response = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: "config.yaml" }));
    const str = await streamToString(response.Body); // Convert the response stream to string

    console.log("Yaml file:", str);

    const config = yaml.load(str); // Parse the YAML string
    console.log("Parsed YAML:", config);

    const body = JSON.parse(event.body || '{}');
    console.log(event);

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

// Helper function to convert stream to string
const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });

