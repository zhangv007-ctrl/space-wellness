import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Classes API ready' })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Class created' }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  return NextResponse.json({ message: 'Class updated' })
}
