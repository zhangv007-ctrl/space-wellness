import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../lib/supabase/server'

// GET /api/rentals?space_id=xxx&date=2025-06-18
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = req.nextUrl
  const space_id = searchParams.get('space_id')
  const date     = searchParams.get('date')

  let query = supabase
    .from('space_rentals')
    .select('*, profiles(full_name), spaces(name, capacity)')
    .eq('status', 'confirmed')
    .order('starts_at')

  if (space_id) query = query.eq('space_id', space_id)
  if (date) {
    const start = `${date}T00:00:00Z`
    const end   = `${date}T23:59:59Z`
    query = query.gte('starts_at', start).lte('starts_at', end)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

// POST /api/rentals — teacher books a space
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { space_id, starts_at, ends_at, notes } = await req.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  // Check for conflicts
  const { data: conflicts } = await supabase
    .from('space_rentals')
    .select('id')
    .eq('space_id', space_id)
    .eq('status', 'confirmed')
    .lt('starts_at', ends_at)
    .gt('ends_at', starts_at)

  if (conflicts && conflicts.length > 0)
    return NextResponse.json({ error: 'Time slot already booked' }, { status: 409 })

  const { data, error } = await supabase
    .from('space_rentals')
    .insert({ teacher_id: user.id, space_id, starts_at, ends_at, notes })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Notify
  fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-notification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ user_id: user.id, trigger: 'rental_confirmed', rental_id: data.id }),
  }).catch(console.error)

  return NextResponse.json(data, { status: 201 })
}

// PATCH /api/rentals — cancel a rental
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { rental_id } = await req.json()

  const { data, error } = await supabase
    .from('space_rentals')
    .update({ status: 'cancelled' })
    .eq('id', rental_id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
