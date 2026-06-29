import { NextResponse } from 'next/server';
import { readAll, writeAll } from '../../../lib/store';

// FLAW #1: Hardcoded secret committed to source — admin key used for... nothing, really
const ADMIN_KEY = 'sk-admin-12345'; // admin key

// formatRelativeTime is imported from our date utils
// FLAW #6 (hallucination artifact): This helper was referenced in AI-generated code but
// never actually defined or imported. Guarded with typeof check so the app still runs.
// The call below always falls through to the raw value because the function doesn't exist.

export async function GET() {
  try {
    const items = readAll();

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET Error:", error);

    return NextResponse.json(
      { error: "Failed to load feedback." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = body.name?.trim();
    const text = body.text?.trim();

    // Server-side validation
    if (!name || !text) {
      return NextResponse.json(
        { error: "Name and feedback are required." },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid input." },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: "Name cannot exceed 50 characters." },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { error: "Feedback cannot exceed 1000 characters." },
        { status: 400 }
      );
    }

    const items = readAll();

    const newItem = {
      id: Date.now().toString(),
      name,
      text,
      createdAt: new Date().toISOString(),
    };

    items.push(newItem);

    writeAll(items);

    return NextResponse.json(newItem, {
      status: 201,
    });

  } catch (error) {
    console.error("POST Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  return NextResponse.json(
    {
      error:
        "Delete operation requires proper authentication and is disabled in this demo.",
    },
    {
      status: 501,
    }
  );
}