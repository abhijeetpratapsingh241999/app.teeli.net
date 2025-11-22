# AWS Setup - Step by Step Guide (Hindi)

## Overview
- Lambda function AWS pe deploy hoga (cloud server)
- Vercel sirf Next.js deploy karega
- Lambda ka URL Vercel environment variable me add karenge
- Total time: 15-20 minutes

---

## PART 1: AWS Bedrock Model Enable (5 min)

### Step 1: AWS Console Login

1. Browser me jao: https://console.aws.amazon.com
2. Login karo (email/password)
3. **Top-right me Region check karo**: 
   - Click karke **"US East (N. Virginia)"** select karo
   - Region code: `us-east-1` hona chahiye ⚠️

### Step 2: Bedrock Service Open

1. Search bar me type karo: **"Bedrock"**
2. Click: **Amazon Bedrock** service
3. Left sidebar me dekho: **"Model access"** option

### Step 3: Claude Opus Enable

1. Click: **"Model access"** (left sidebar)
2. Orange button: **"Manage model access"** click karo
3. Neeche scroll karo **"Anthropic"** section tak
4. Checkbox ✅ lagao: **"Claude Opus 4"**
   - Model ID confirm karo: `anthropic.claude-opus-4-20250514`
5. Bottom me click: **"Request model access"**
6. Wait karo 1-2 minutes
7. Status **"Access granted"** (green) hona chahiye ✅

**Screenshot location**: Console → Bedrock → Model access → Status column

---

## PART 2: IAM Role Banao (5 min)

### Step 1: Policy Files Banao (PowerShell me)

```powershell
# Project root me jao
cd E:\startup\app.teeli.net

# Policy folder banao
New-Item -ItemType Directory -Force -Path aws-policies
cd aws-policies

# Trust policy file banao
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

Write-Host "✅ Trust policy created" -ForegroundColor Green
```

### Step 2: Account ID Nikalo

```powershell
# AWS account ID check karo
$accountId = aws sts get-caller-identity --query Account --output text
Write-Host "Your AWS Account ID: $accountId" -ForegroundColor Cyan

# Agar error aaye "aws: command not found":
# Install AWS CLI: https://aws.amazon.com/cli/
# Configure karo: aws configure
```

### Step 3: Bedrock Permission Policy Banao

```powershell
# Permission policy create karo
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

Write-Host "✅ Permission policy created" -ForegroundColor Green
```

### Step 4: IAM Role Create Karo

```powershell
# Role banao
aws iam create-role `
  --role-name lambda-bedrock-opus-role `
  --assume-role-policy-document file://lambda-trust-policy.json `
  --region us-east-1

Write-Host "✅ IAM role created" -ForegroundColor Green

# Policy attach karo
aws iam put-role-policy `
  --role-name lambda-bedrock-opus-role `
  --policy-name BedrockAccessPolicy `
  --policy-document file://lambda-bedrock-policy.json `
  --region us-east-1

Write-Host "✅ Policy attached" -ForegroundColor Green

# Role ARN nikalo (SAVE THIS!)
$roleArn = aws iam get-role --role-name lambda-bedrock-opus-role --query 'Role.Arn' --output text --region us-east-1
Write-Host "`n⚠️ IMPORTANT - Copy this ARN:" -ForegroundColor Yellow
Write-Host $roleArn -ForegroundColor Cyan
Write-Host "`nPaste somewhere - next step me chahiye!`n" -ForegroundColor Yellow
```

**Output example**:
```
arn:aws:iam::123456789012:role/lambda-bedrock-opus-role
```

**Is ARN ko copy karke notepad me save karo!** ✅

---

## PART 3: Lambda Deploy (5 min)

### Step 1: Zip File Banao

```powershell
# Project root me wapas jao
cd E:\startup\app.teeli.net

# Lambda folder me jao
cd lambda-claude

# Deployment zip banao
Compress-Archive -Path * -DestinationPath ..\function.zip -Force

# Root me wapas jao
cd ..

Write-Host "✅ function.zip created" -ForegroundColor Green
```

### Step 2: Lambda Function Deploy

**Replace `YOUR_ROLE_ARN` with copied ARN from Part 2 Step 4:**

```powershell
# PASTE YOUR ROLE ARN HERE ⬇️
$roleArn = "arn:aws:iam::123456789012:role/lambda-bedrock-opus-role"  # ⚠️ CHANGE THIS!

# Lambda function create karo
aws lambda create-function `
  --function-name claude-opus-api `
  --runtime nodejs20.x `
  --role $roleArn `
  --handler index.handler `
  --zip-file fileb://function.zip `
  --timeout 60 `
  --memory-size 512 `
  --environment Variables="{AWS_REGION=us-east-1}" `
  --region us-east-1

Write-Host "✅ Lambda function deployed!" -ForegroundColor Green
```

### Step 3: Lambda Test Karo

```powershell
# Test invoke karo
aws lambda invoke `
  --function-name claude-opus-api `
  --payload '{"body": "{\"prompt\": \"Hello! What model are you?\"}"}' `
  --region us-east-1 `
  response.json

# Response dekho
$response = Get-Content response.json | ConvertFrom-Json
Write-Host "`nLambda Response:" -ForegroundColor Cyan
Write-Host ($response | ConvertTo-Json -Depth 5)
```

**Expected output**:
```json
{
  "statusCode": 200,
  "body": "{\"success\":true,\"response\":\"I am Claude Opus 4.1...\"}"
}
```

Agar ye dikha, toh **Lambda working!** ✅

---

## PART 4: API Gateway Banao (5 min)

### Step 1: Account ID Re-confirm

```powershell
$accountId = aws sts get-caller-identity --query Account --output text
Write-Host "Account ID: $accountId" -ForegroundColor Cyan
```

### Step 2: HTTP API Create

```powershell
# API Gateway banao
$apiResponse = aws apigatewayv2 create-api `
  --name claude-opus-gateway `
  --protocol-type HTTP `
  --target "arn:aws:lambda:us-east-1:$($accountId):function:claude-opus-api" `
  --region us-east-1 | ConvertFrom-Json

$apiId = $apiResponse.ApiId
$apiUrl = $apiResponse.ApiEndpoint

Write-Host "`n✅ API Gateway created!" -ForegroundColor Green
Write-Host "API ID: $apiId" -ForegroundColor Cyan
Write-Host "`n⚠️ IMPORTANT - Your API URL:" -ForegroundColor Yellow
Write-Host $apiUrl -ForegroundColor Green
Write-Host "`nCopy this URL - Vercel me add karenge!`n" -ForegroundColor Yellow

# Clipboard me copy karo (optional)
$apiUrl | Set-Clipboard
Write-Host "✅ URL copied to clipboard!" -ForegroundColor Green
```

### Step 3: Lambda Permission Add

```powershell
# API Gateway ko Lambda invoke permission do
aws lambda add-permission `
  --function-name claude-opus-api `
  --statement-id apigateway-invoke `
  --action lambda:InvokeFunction `
  --principal apigateway.amazonaws.com `
  --source-arn "arn:aws:execute-api:us-east-1:$($accountId):$apiId/*/*" `
  --region us-east-1

Write-Host "✅ Lambda permission added" -ForegroundColor Green
```

### Step 4: API Test Karo

```powershell
# Direct API call test
$testBody = @{
    prompt = "Hello from API Gateway!"
} | ConvertTo-Json

$apiTest = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $testBody -ContentType 'application/json'

Write-Host "`nAPI Gateway Test Response:" -ForegroundColor Cyan
Write-Host ($apiTest | ConvertTo-Json -Depth 3)
```

**Expected**: JSON response with `success: true` ✅

---

## PART 5: Vercel Environment Variable (3 min)

### Step 1: Vercel Dashboard Open

1. Browser me jao: https://vercel.com/dashboard
2. Login karo
3. **app.teeli.net** project click karo

### Step 2: Environment Variable Add

1. Click: **Settings** tab (top navigation)
2. Left sidebar: **Environment Variables**
3. Click: **"Add New"** button
4. Fill karo:
   - **Name**: `LAMBDA_API_URL`
   - **Value**: API URL paste karo (Part 4 se copied)
     - Example: `https://abc123xyz.execute-api.us-east-1.amazonaws.com`
   - **Environment**: Select ALL checkboxes ✅
     - ✅ Production
     - ✅ Preview
     - ✅ Development
5. Click: **"Save"**

### Step 3: Redeploy Trigger

```powershell
# Git commit + push (auto-redeploy hoga)
cd E:\startup\app.teeli.net

git add .
git commit -m "Add Claude Opus 4.1 integration"
git push origin main
```

Vercel automatically redeploy karega (2-3 minutes) ⏳

---

## PART 6: Final Testing (2 min)

### Test 1: Health Check

```powershell
# Wait for Vercel deployment complete hone ka (2 min)
Start-Sleep -Seconds 120

# Health check API
$health = Invoke-RestMethod -Uri "https://app.teeli.net/api/ai" -Method Get

Write-Host "`nHealth Check Response:" -ForegroundColor Cyan
Write-Host ($health | ConvertTo-Json)
```

**Expected**:
```json
{
  "status": "ready",
  "message": "AI service is ready",
  "model": "claude-opus-4.1"
}
```

### Test 2: Real AI Request

```powershell
# AI request test
$aiRequest = @{
    prompt = "Analyze this: I need help with 3D model design"
} | ConvertTo-Json

$aiResponse = Invoke-RestMethod `
  -Uri "https://app.teeli.net/api/ai" `
  -Method Post `
  -Body $aiRequest `
  -ContentType 'application/json'

Write-Host "`nAI Response:" -ForegroundColor Green
Write-Host "Success: $($aiResponse.success)"
Write-Host "Model: $($aiResponse.model)"
Write-Host "Response: $($aiResponse.response)"
Write-Host "`nTokens Used:"
Write-Host "  Input: $($aiResponse.usage.input_tokens)"
Write-Host "  Output: $($aiResponse.usage.output_tokens)"
```

**Agar response mila, toh DONE!** 🎉

---

## Summary - Kya Hua:

✅ **Lambda function**: AWS cloud pe deploy (independent server)
✅ **API Gateway**: Public URL mil gaya
✅ **Vercel**: Environment variable add (Lambda URL)
✅ **Next.js app**: `/api/ai` route Lambda ko call karega
✅ **Billing**: $180 credits AWS account se use honge

---

## Important Points:

### Lambda Folder Vercel Me?
**❌ NAHI!** 
- `lambda-claude/` folder sirf AWS deployment ke liye
- Vercel sirf `src/` folder deploy karega
- Lambda alag server hai, Next.js alag server

### .gitignore Me Add?
**Haan, optional:**
```
lambda-claude/node_modules/
function.zip
aws-policies/
response.json
```

### Kisi Aur Project Me Use?
**✅ Haan!**
- API URL public hai
- Koi bhi project us URL ko call kar sakta hai
- Sirf environment variable add karo

---

## Troubleshooting:

### Error: "aws: command not found"
```powershell
# AWS CLI install karo
winget install Amazon.AWSCLI

# Configure karo
aws configure
# Enter: Access Key ID, Secret Key, Region (us-east-1), Output (json)
```

### Error: "Access Denied"
- IAM role permissions check karo
- Bedrock model access enabled hai confirm karo
- Region `us-east-1` confirm karo

### Error: "Function not found"
- Function name exactly: `claude-opus-api`
- Region: `us-east-1`
- Wait 30 seconds and retry

---

## Next Steps After Setup:

1. Dashboard me AI button add karo
2. Project analysis feature banao
3. Chat interface implement karo

Complete! 🚀
