import { NextRequest, NextResponse } from 'next/server'
export async function GET(_req: NextRequest) { return NextResponse.json({ message: 'ok' }) }
export async function POST(_req: NextRequest) { return NextResponse.json({ message: 'ok' }, { status: 201 }) }
export async function PATCH(_req: NextRequest) { return NextResponse.json({ message: 'ok' }) }
