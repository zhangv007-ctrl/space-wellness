import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Bookings API ready' })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Booking created' }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  return NextResponse.json({ message: 'Booking updated' })
}
