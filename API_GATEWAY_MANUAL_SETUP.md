# API Gateway Manual Setup Guide

Your AWS CLI user doesn't have API Gateway permissions. Follow these steps in AWS Console:

## Step-by-Step:

### 1. Open API Gateway Console
- Go to: https://console.aws.amazon.com/apigateway
- Make sure region is: **US East (N. Virginia)**

### 2. Create HTTP API
- Click: **"Create API"**
- Choose: **"HTTP API"** → Click **"Build"**

### 3. Add Integration
- **Integrations:** Click **"Add integration"**
- **Integration type:** Select **"Lambda"**
- **Lambda function:** Type and select: `claude-opus-api`
- **Version:** Keep as **"2.0"**
- Click **"Next"**

### 4. Configure Routes
- **API name:** `claude-opus-gateway`
- **Method:** Keep **"ANY"**
- **Resource path:** Keep **"/{proxy+}"** or change to **"/"**
- Click **"Next"**

### 5. Configure Stages
- **Stage name:** `$default` (auto-filled)
- **Auto-deploy:** ✅ Check this
- Click **"Next"**

### 6. Review and Create
- Review settings
- Click **"Create"**

### 7. Get Your API URL
- After creation, you'll see: **"Invoke URL"**
- Example: `https://abc123xyz.execute-api.us-east-1.amazonaws.com`
- **COPY THIS URL** - paste it here when done!

---

## Alternative: Use Lambda Function URL (Easier)

### Lambda Console Method:

1. Go to: https://console.aws.amazon.com/lambda
2. Click on function: **claude-opus-api**
3. Go to **"Configuration"** tab
4. Click **"Function URL"** in left menu
5. Click **"Create function URL"**
6. **Auth type:** Select **"NONE"** (public access)
7. Click **"Save"**
8. Copy the **Function URL** that appears

This URL will work same as API Gateway!

---

**Once you have the URL, paste it here!**
