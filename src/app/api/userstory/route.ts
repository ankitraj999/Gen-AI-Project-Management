import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userStory } = await request.json();
  console.log(userStory)
  try {
    const response = await fetch('https://1052-134-139-34-35.ngrok-free.app/api/userstory/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "query":userStory }),
    });

    if (!response.ok) {
      throw new Error('Failed to process user story');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred while processing the user story' }, { status: 500 });
  }
}