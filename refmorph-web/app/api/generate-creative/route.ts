import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      reference_image_url,
      product_image_url,
      brand_logo_url,
      brand_name,
      campaign_goal,
    } = body;

    // Construct the payload to send to the FastAPI backend
    const payload = {
      reference_image_url,
      product_image_url,
      brand_logo_url,
      brand_name,
      campaign_goal,
    };

    const apiResponse = await fetch('http://127.0.0.1:8000/generate-creative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      // Forward the backend error status and message
      return NextResponse.json(
        { error: 'Backend error', details: errorText },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json(
      { error: 'Unexpected error', details: String(err) },
      { status: 500 }
    );
  }
}