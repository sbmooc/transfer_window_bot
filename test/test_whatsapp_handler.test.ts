const assert = require('assert');
const { handler } = require('../lambda/WhatsappWebhookHandler');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(() => ({
      send: jest.fn().mockResolvedValue({
        Body: {
          transformToString: jest.fn().mockResolvedValue(`
            name: John Doe
            age: 30
            occupation: Developer
          `)
        }
      }),
    })),
    GetObjectCommand: jest.fn(),
  };
});

describe('Lambda Handler Test', () => {
  it('should return status 200 and OK body', async () => {
    const mockEvent = {
      body: JSON.stringify({ message: 'test' })
    };

    // Set the environment variables as they would be in Lambda
    process.env.API_KEY = 'test-api-key';
    process.env.BUCKET_NAME = 'test-bucket';

    const result = await handler(mockEvent);

    assert.strictEqual(result.statusCode, 200);
    assert.strictEqual(result.body, 'OK');
  });

  it('should return 500 if there is an error', async () => {
    const mockEvent = {
      body: JSON.stringify({ message: 'test' })
    };

    // Simulate an error by making `s3.send` fail
    jest.spyOn(require('@aws-sdk/client-s3').S3Client.prototype, 'send').mockRejectedValueOnce(new Error('S3 error'));

    const result = await handler(mockEvent);

    assert.strictEqual(result.statusCode, 500);
    const body = JSON.parse(result.body);
    assert.strictEqual(body.message, 'Failed to process webhook.');
  });
});

