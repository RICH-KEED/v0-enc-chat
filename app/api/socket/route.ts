import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Socket.IO server is running on the backend",
    socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
  })
}
