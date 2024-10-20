// lambda/whatsappWebhookHandler.js

exports.handler = async (event) => {
  try {
    // Access the environment variables
    const apiKey = process.env.API_KEY;

    console.log("API Key:", apiKey);

    const body = JSON.parse(event.body || '{}');
    console.log(body)

    return {
      statusCode: 200,
      body: "test_string",
    };
  } catch (error) {
    console.error("Error processing webhook:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to process webhook." }),
    };
  }
};

