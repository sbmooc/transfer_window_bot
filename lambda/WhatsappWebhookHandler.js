// lambda/whatsappWebhookHandler.js

exports.handler = async (event) => {
  try {
    // Access the environment variables
    const apiKey = process.env.API_KEY;

    console.log("API Key:", apiKey);

    const body = JSON.parse(event.body || '{}');
    console.log(event)

    return {
      statusCode: 200,
      body: event.queryStringParameters["hub.verify_token"],
    };
  } catch (error) {
    console.error("Error processing webhook:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process webhook." }),
    };
  }
};

