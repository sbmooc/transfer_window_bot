// lambda/whatsappWebhookHandler.js

exports.handler = async (event) => {
  try {
    // Access the environment variables
    const apiKey = process.env.API_KEY;
    const dbConnectionString = process.env.DB_CONNECTION_STRING;

    console.log("API Key:", apiKey);

    const body = JSON.parse(event.body || '{}');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Webhook received successfully!" }),
    };
  } catch (error) {
    console.error("Error processing webhook:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process webhook." }),
    };
  }
};

