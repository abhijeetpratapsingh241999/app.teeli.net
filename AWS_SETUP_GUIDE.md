# AWS Lambda + Claude Opus 4.1 Setup Guide

Complete step-by-step guide to set up Claude Opus 4.1 integration using AWS Bedrock and Lambda.

---

## Prerequisites

- ✅ AWS Account with $180 free credits
- ✅ AWS CLI installed and configured
- ✅ Node.js 20+ installed
- ✅ VS Code with terminal access

---

## Part 1: Enable Bedrock Model Access

### Step 1: Login to AWS Console

1. Go to https://console.aws.amazon.com
2. Login with your AWS credentials
3. **Select Region: US East (N. Virginia) - us-east-1** ⚠️ Important!

### Step 2: Enable Claude Opus 4.1

1. In AWS Console, search for **"Bedrock"**
2. Click on **Amazon Bedrock** service
3. In left sidebar, click **"Model access"**
4. Click **"Manage model access"** (orange button)
5. Scroll down to **Anthropic** section
6. Check the box for:
   - ✅ **Claude Opus 4 (anthropic.claude-opus-4-20250514)**
7. Click **"Request model access"** at bottom
8. Wait 1-2 minutes for status to change to **"Access granted"** ✅

---

## Part 2: Create IAM Role for Lambda

### Step 1: Create Trust Policy File

Open PowerShell and run:

```powershell
# Create policy files directory
New-Item -ItemType Directory -Force -Path aws-policies
cd aws-policies

# Create trust policy
@'
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
'@ | Out-File -Encoding UTF8 lambda-trust-policy.json
```

### Step 2: Create Permissions Policy

```powershell
# Get your AWS account ID first
$accountId = aws sts get-caller-identity --query Account --output text
Write-Host "Your AWS Account ID: $accountId" -ForegroundColor Green

# Create permissions policy
@"
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
      "Resource": "arn:aws:logs:us-east-1:$($accountId):*"
    }
  ]
}
"@ | Out-File -Encoding UTF8 lambda-bedrock-policy.json
```

### Step 3: Create IAM Role

```powershell
# Create the role
aws iam create-role `
  --role-name lambda-bedrock-opus-role `
  --assume-role-policy-document file://lambda-trust-policy.json

# Attach permissions policy
aws iam put-role-policy `
  --role-name lambda-bedrock-opus-role `
  --policy-name BedrockAccessPolicy `
  --policy-document file://lambda-bedrock-policy.json

# Get the role ARN (SAVE THIS!)
$roleArn = aws iam get-role --role-name lambda-bedrock-opus-role --query 'Role.Arn' --output text
Write-Host "Role ARN: $roleArn" -ForegroundColor Cyan
```

**⚠️ IMPORTANT:** Copy the Role ARN - you'll need it in next step!

---

## Part 3: Deploy Lambda Function

### Step 1: Create Deployment Package

```powershell
# Go back to project root
cd ..

# Go to lambda folder
cd lambda-claude

# Create zip file
Compress-Archive -Path * -DestinationPath ../function.zip -Force

cd ..
```

### Step 2: Create Lambda Function

Replace `YOUR_ROLE_ARN` with the ARN from previous step:

```powershell
aws lambda create-function `
  --function-name claude-opus-api `
  --runtime nodejs20.x `
  --role YOUR_ROLE_ARN `
  --handler index.handler `
  --zip-file fileb://function.zip `
  --timeout 60 `
  --memory-size 512 `
  --environment Variables="{AWS_REGION=us-east-1}" `
  --region us-east-1
```

**Wait for response** - should show function details with status: Active ✅

### Step 3: Test Lambda Function

```powershell
# Test the function
aws lambda invoke `
  --function-name claude-opus-api `
  --payload '{\"body\": \"{\\\"prompt\\\": \\\"Hello! What model are you?\\\"}\" }' `
  --region us-east-1 `
  response.json

# Check response
Get-Content response.json | ConvertFrom-Json
```

Expected output:
```json
{
  "statusCode": 200,
  "body": "{\"success\":true,\"response\":\"I am Claude Opus 4.1...\",\"usage\":{...}}"
}
```

---

## Part 4: Create API Gateway

### Step 1: Get Account ID

```powershell
$accountId = aws sts get-caller-identity --query Account --output text
```

### Step 2: Create HTTP API

```powershell
# Create API Gateway
$apiId = aws apigatewayv2 create-api `
  --name claude-opus-gateway `
  --protocol-type HTTP `
  --target "arn:aws:lambda:us-east-1:$($accountId):function:claude-opus-api" `
  --region us-east-1 `
  --query 'ApiId' `
  --output text

Write-Host "API ID: $apiId" -ForegroundColor Cyan

# Get API endpoint URL
$apiUrl = aws apigatewayv2 get-apis `
  --query "Items[?ApiId=='$apiId'].ApiEndpoint" `
  --output text `
  --region us-east-1

Write-Host "API URL: $apiUrl" -ForegroundColor Green
Write-Host "⚠️ SAVE THIS URL - You need it for Vercel!" -ForegroundColor Yellow
```

### Step 3: Add Lambda Permission

```powershell
aws lambda add-permission `
  --function-name claude-opus-api `
  --statement-id apigateway-invoke `
  --action lambda:InvokeFunction `
  --principal apigateway.amazonaws.com `
  --source-arn "arn:aws:execute-api:us-east-1:$($accountId):$apiId/*/*" `
  --region us-east-1
```

### Step 4: Test API Gateway

```powershell
# Test API endpoint
Invoke-RestMethod -Uri "$apiUrl" -Method Post -Body '{"prompt":"Hello from API Gateway!"}' -ContentType 'application/json' | ConvertTo-Json
```

---

## Part 5: Configure Vercel

### Step 1: Add Environment Variable

1. Go to https://vercel.com/dashboard
2. Select your **app.teeli.net** project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `LAMBDA_API_URL`
   - **Value:** Your API Gateway URL (from Part 4 Step 2)
   - **Environment:** Production, Preview, Development (select all)
5. Click **Save**

### Step 2: Redeploy

```powershell
# In project root, push changes
git add .
git commit -m "Add AI integration with Claude Opus 4.1"
git push origin main
```

Vercel will automatically redeploy with new environment variable.

---

## Part 6: Test Integration

### Test 1: Health Check

```powershell
# Test if API is configured
Invoke-RestMethod -Uri "https://app.teeli.net/api/ai" -Method Get | ConvertTo-Json
```

Expected:
```json
{
  "status": "ready",
  "message": "AI service is ready",
  "model": "claude-opus-4.1"
}
```

### Test 2: AI Request

```powershell
Invoke-RestMethod -Uri "https://app.teeli.net/api/ai" -Method Post -Body '{"prompt":"Analyze this: I need design help"}' -ContentType 'application/json' | ConvertTo-Json
```

Expected:
```json
{
  "success": true,
  "response": "AI response text...",
  "usage": {
    "input_tokens": 15,
    "output_tokens": 123
  },
  "model": "claude-opus-4.1"
}
```

---

## Usage in Your App

### Frontend Example (React Component)

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask AI anything..."
      />
      <Button onClick={askAI} disabled={loading}>
        {loading ? 'Thinking...' : 'Ask AI'}
      </Button>
      {response && <p>{response}</p>}
    </div>
  );
}
```

### Server Action Example

```typescript
'use server';

export async function analyzeDesign(modelData: string) {
  const response = await fetch(process.env.LAMBDA_API_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: `Analyze this 3D model data: ${modelData}`,
      systemPrompt: 'You are a professional 3D design assistant.',
      maxTokens: 2000,
    }),
  });

  return response.json();
}
```

---

## Cost Monitoring

### Check Lambda Invocations

```powershell
aws cloudwatch get-metric-statistics `
  --namespace AWS/Lambda `
  --metric-name Invocations `
  --dimensions Name=FunctionName,Value=claude-opus-api `
  --start-time (Get-Date).AddDays(-7).ToString('yyyy-MM-ddTHH:mm:ssZ') `
  --end-time (Get-Date).ToString('yyyy-MM-ddTHH:mm:ssZ') `
  --period 86400 `
  --statistics Sum `
  --region us-east-1
```

### Check Bedrock Usage

1. Go to AWS Console → Bedrock
2. Click "Metrics" in left sidebar
3. View token usage and costs

---

## Troubleshooting

### Error: "Access Denied"

**Solution:**
- Check IAM role has correct Bedrock permissions
- Verify model access is enabled in Bedrock console
- Confirm region is `us-east-1`

### Error: "Model not found"

**Solution:**
- Model ID must be exactly: `anthropic.claude-opus-4-20250514`
- Check Bedrock model access status
- Wait 2-3 minutes after enabling model

### Error: "Timeout"

**Solution:**
- Increase Lambda timeout (max 15 minutes)
- Reduce `maxTokens` in request
- Check network connectivity

### Error: "Rate limit exceeded"

**Solution:**
- Implement retry logic with exponential backoff
- Add rate limiting in your app
- Consider using reserved capacity

---

## Update Lambda Code

If you change `lambda-claude/index.js`:

```powershell
cd lambda-claude
Compress-Archive -Path * -DestinationPath ../function.zip -Force
cd ..

aws lambda update-function-code `
  --function-name claude-opus-api `
  --zip-file fileb://function.zip `
  --region us-east-1
```

---

## Security Best Practices

1. ✅ Never commit AWS credentials to Git
2. ✅ Use environment variables for sensitive data
3. ✅ Enable CloudWatch logging for debugging
4. ✅ Set up billing alerts in AWS Console
5. ✅ Rotate IAM credentials regularly
6. ✅ Use API Gateway rate limiting
7. ✅ Implement authentication in your app

---

## Next Steps

- [ ] Add AI features to dashboard
- [ ] Implement chat interface
- [ ] Add model analysis feature
- [ ] Create design suggestion system
- [ ] Set up usage analytics

---

## Resources

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Claude API Reference](https://docs.anthropic.com/claude/reference)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

---

**Setup Complete! 🎉**

Your app now has Claude Opus 4.1 integration using your $180 AWS credits.
