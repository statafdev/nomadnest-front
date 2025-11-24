import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function missingApiUrlResponse() {
  return NextResponse.json(
    { status: "error", message: "NEXT_PUBLIC_API_URL is not configured" },
    { status: 500 }
  );
}

export async function GET() {
  if (!API_BASE) {
    return missingApiUrlResponse();
  }

  try {
    const response = await fetch(`${API_BASE}/listings`, {
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Unable to reach listings service" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!API_BASE) {
    return missingApiUrlResponse();
  }

  const token = (await cookies()).get("session")?.value;
  if (!token) {
    return NextResponse.json(
      { status: "error", message: "Authentication required to create listings" },
      { status: 401 }
    );
  }

  const payload = await request.json();

  try {
    const response = await fetch(`${API_BASE}/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Unable to publish listing right now" },
      { status: 500 }
    );
  }
}

