# Lambda Function for Claude Opus 4.1

AWS Lambda function to access Claude Opus 4.1 via AWS Bedrock for app.teeli.net.

## Features

- ✅ Claude Opus 4.1 integration via AWS Bedrock
- ✅ CORS enabled for Next.js app
- ✅ Error handling with specific AWS error types
- ✅ Token usage tracking
- ✅ Configurable temperature and max tokens
- ✅ System prompt support

## Setup Steps

### 1. Install Dependencies

```powershell
cd lambda-claude
npm install
```

### 2. Create Deployment Package

```powershell
# Zip everything for Lambda
npm run zip
```

This creates `function.zip` in the parent directory.

### 3. Create IAM Role

Create an IAM role for Lambda with these permissions:

**Trust policy** (lambda-trust-policy.json):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Permissions policy** (lambda-bedrock-policy.json):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-opus-4-20250514"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

**Create role via AWS CLI:**
```powershell
# Create role
aws iam create-role --role-name lambda-bedrock-opus-role --assume-role-policy-document file://lambda-trust-policy.json

# Attach Bedrock policy
aws iam put-role-policy --role-name lambda-bedrock-opus-role --policy-name BedrockAccessPolicy --policy-document file://lambda-bedrock-policy.json

# Get role ARN (save this!)
aws iam get-role --role-name lambda-bedrock-opus-role --query 'Role.Arn' --output text
```

### 4. Deploy Lambda Function

```powershell
# Replace YOUR_ACCOUNT_ID with your AWS account ID
aws lambda create-function \
  --function-name claude-opus-api \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/lambda-bedrock-opus-role \
  --handler index.handler \
  --zip-file fileb://../function.zip \
  --timeout 60 \
  --memory-size 512 \
  --environment Variables={AWS_REGION=us-east-1}
```

### 5. Enable Bedrock Model Access

1. Go to AWS Console → Bedrock
2. Click "Model access" in left sidebar
3. Click "Enable specific models"
4. Check **"Claude Opus 4 (anthropic.claude-opus-4-20250514)"**
5. Click "Save changes"
6. Wait for status to change to "Access granted" (may take 1-2 minutes)

### 6. Create API Gateway

```powershell
# Create REST API
aws apigatewayv2 create-api \
  --name claude-opus-gateway \
  --protocol-type HTTP \
  --target arn:aws:lambda:us-east-1:YOUR_ACCOUNT_ID:function:claude-opus-api

# Get API endpoint (save this!)
aws apigatewayv2 get-apis --query 'Items[?Name==`claude-opus-gateway`].ApiEndpoint' --output text
```

### 7. Add Lambda Permissions for API Gateway

```powershell
aws lambda add-permission \
  --function-name claude-opus-api \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com
```

### 8. Test Lambda Function

```powershell
# Test locally
aws lambda invoke \
  --function-name claude-opus-api \
  --payload '{"body": "{\"prompt\": \"Hello, what model are you?\"}"}' \
  response.json

# Check response
cat response.json
```

## Update Function Code

After making changes to `index.js`:

```powershell
npm run zip
npm run deploy
```

## Environment Variables

Set in Lambda console or via CLI:

- `AWS_REGION`: AWS region (default: us-east-1)

## API Usage

**Endpoint:** `https://YOUR_API_GATEWAY_URL/`

**Method:** POST

**Request:**
```json
{
  "prompt": "Analyze this 3D model",
  "systemPrompt": "You are a helpful 3D design assistant",
  "maxTokens": 4096,
  "temperature": 1.0
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI response text here...",
  "usage": {
    "input_tokens": 123,
    "output_tokens": 456
  },
  "model": "claude-opus-4.1",
  "stopReason": "end_turn"
}
```

## Cost Tracking

Your $180 AWS credits will be used. Monitor usage:

```powershell
# Check Lambda invocations
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=claude-opus-api \
  --start-time 2025-01-01T00:00:00Z \
  --end-time 2025-12-31T23:59:59Z \
  --period 86400 \
  --statistics Sum
```

## Troubleshooting

**Error: Access Denied**
- Check IAM role has Bedrock permissions
- Verify model access is enabled in Bedrock console

**Error: Model not found**
- Confirm model ID: `anthropic.claude-opus-4-20250514`
- Check region is `us-east-1`

**Timeout errors**
- Increase Lambda timeout (max 15 minutes)
- Reduce `maxTokens` in request

## Next Steps

1. Add Lambda URL to Vercel environment variables
2. Create Next.js API route to call this Lambda
3. Add AI features to dashboard
