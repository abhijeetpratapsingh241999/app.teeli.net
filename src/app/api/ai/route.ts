/**
 * AI API Route - Claude Opus 4.1 Integration
 * Proxies requests to AWS Lambda function
 */

import { NextRequest, NextResponse } from 'next/server';

// Lambda function URL from environment variables
const LAMBDA_URL = process.env.LAMBDA_API_URL;

/**
 * POST /api/ai
 * Send prompts to Claude Opus 4.1 via Lambda
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Lambda URL is configured
    if (!LAMBDA_URL) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI service not configured. Please set LAMBDA_API_URL environment variable.',
        },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { prompt, systemPrompt, maxTokens, temperature } = body;

    // Validate prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or missing prompt',
        },
        { status: 400 }
      );
    }

    // Call Lambda function
    const lambdaResponse = await fetch(LAMBDA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        systemPrompt,
        maxTokens: maxTokens || 4096,
        temperature: temperature !== undefined ? temperature : 1.0,
      }),
    });

    // Handle Lambda errors
    if (!lambdaResponse.ok) {
      const errorData = await lambdaResponse.json().catch(() => ({}));
      console.error('Lambda error:', errorData);
      
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || 'AI service error',
          errorType: errorData.errorType,
        },
        { status: lambdaResponse.status }
      );
    }

    // Parse Lambda response
    const data = await lambdaResponse.json();

    // Return success response
    return NextResponse.json({
      success: true,
      response: data.response,
      usage: data.usage,
      model: data.model,
      stopReason: data.stopReason,
    });

  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai
 * Health check endpoint
 */
export async function GET() {
  const isConfigured = !!LAMBDA_URL;
  
  return NextResponse.json({
    status: isConfigured ? 'ready' : 'not-configured',
    message: isConfigured 
      ? 'AI service is ready' 
      : 'AI service not configured. Set LAMBDA_API_URL environment variable.',
    model: 'claude-opus-4.1',
  });
}
