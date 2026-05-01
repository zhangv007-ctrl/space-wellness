import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../lib/supabase/server'

// GET /api/bookings?class_id=xxx  or  GET /api/bookings?client_id=xxx
export async function GET(req: NextRequest) {
  const supabase   = await createClient()
  const { searchParams } = req.nextUrl
  const class_id  = searchParams.get('class_id')
  const client_id = searchParams.get('client_id')

  let query = supabase
    .from('bookings')
    .select('*, profiles(full_name, email), classes(name, starts_at)')
    .order('created_at', { ascending: false })

  if (class_id)  query = query.eq('class_id', class_id)
  if (client_id) query = query.eq('client_id', client_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

// POST /api/bookings — create or join waitlist automatically
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { class_id } = await req.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  // Check current capacity
  const { data: cls } = await supabase
    .from('classes_with_availability')
    .select('spots_remaining, waitlist_count, max_capacity')
    .eq('id', class_id)
    .single()

  if (!cls) return NextResponse.json({ error: 'Class not found' }, { status: 404 })

  const status       = cls.spots_remaining > 0 ? 'confirmed' : 'waitlist'
  const waitlist_pos = status === 'waitlist' ? (cls.waitlist_count + 1) : null

  const { data, error } = await supabase
    .from('bookings')
    .insert({ client_id: user.id, class_id, status, waitlist_pos })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Trigger notification via Edge Function (fire-and-forget)
  const trigger = status === 'confirmed' ? 'booking_confirmed' : 'waitlist_joined'
  fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-notification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ user_id: user.id, trigger, booking_id: data.id }),
  }).catch(console.error)

  return NextResponse.json(data, { status: 201 })
}

// PATCH /api/bookings — cancel a booking
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { booking_id, status } = await req.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', booking_id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
