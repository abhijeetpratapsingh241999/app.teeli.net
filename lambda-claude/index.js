/**
 * AWS Lambda Function for Claude Opus 4.1
 * Handles AI requests from Next.js app via AWS Bedrock
 */

const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

// Initialize Bedrock client
const client = new BedrockRuntimeClient({ 
  region: process.env.AWS_REGION || "us-east-1" 
});

/**
 * Lambda handler function
 * @param {Object} event - API Gateway event object
 * @returns {Object} Response with statusCode and body
 */
exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  try {
    // Parse request body - handle both API Gateway and Function URL formats
    let bodyData;
    if (typeof event.body === 'string') {
      bodyData = JSON.parse(event.body);
    } else if (event.body) {
      bodyData = event.body;
    } else {
      // Direct JSON payload (Function URL)
      bodyData = event;
    }
    
    const { prompt, systemPrompt, maxTokens = 4096, temperature = 1.0 } = bodyData;

    // Validate input
    if (!prompt || typeof prompt !== 'string') {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          error: "Missing or invalid 'prompt' in request body" 
        })
      };
    }

    // Prepare messages array
    const messages = [
      {
        role: "user",
        content: prompt
      }
    ];

    // Prepare request payload for Claude Opus 4.1
    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: maxTokens,
      temperature: temperature,
      messages: messages
    };

    // Add system prompt if provided
    if (systemPrompt) {
      payload.system = systemPrompt;
    }

    // Prepare Bedrock command
    const command = new InvokeModelCommand({
      modelId: "anthropic.claude-opus-4-20250514", // Opus 4.1
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload)
    });

    console.log("Calling Bedrock with payload:", JSON.stringify(payload, null, 2));

    // Call Bedrock API
    const response = await client.send(command);
    
    // Decode response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log("Bedrock response:", JSON.stringify(responseBody, null, 2));

    // Extract text from response
    const textContent = responseBody.content?.[0]?.text || "";

    // Return success response
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        response: textContent,
        usage: {
          input_tokens: responseBody.usage?.input_tokens || 0,
          output_tokens: responseBody.usage?.output_tokens || 0
        },
        model: "claude-opus-4.1",
        stopReason: responseBody.stop_reason
      })
    };

  } catch (error) {
    console.error("Error:", error);

    // Handle specific AWS errors
    let errorMessage = error.message || "Unknown error occurred";
    let statusCode = 500;

    if (error.name === "ValidationException") {
      statusCode = 400;
      errorMessage = "Invalid request to Bedrock: " + error.message;
    } else if (error.name === "ThrottlingException") {
      statusCode = 429;
      errorMessage = "Rate limit exceeded. Please try again later.";
    } else if (error.name === "AccessDeniedException") {
      statusCode = 403;
      errorMessage = "Access denied to Bedrock. Check IAM permissions.";
    }

    return {
      statusCode: statusCode,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: false,
        error: errorMessage,
        errorType: error.name || "Error"
      })
    };
  }
};

/**
 * Handle OPTIONS requests for CORS preflight
 */
exports.optionsHandler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    },
    body: ""
  };
};
