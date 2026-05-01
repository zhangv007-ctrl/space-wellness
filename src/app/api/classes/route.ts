import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../lib/supabase/server'

// GET /api/classes — list classes with live availability
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = req.nextUrl
  const from = searchParams.get('from') // ISO date string
  const to   = searchParams.get('to')

  let query = supabase
    .from('classes_with_availability')
    .select('*')
    .order('starts_at', { ascending: true })

  if (from) query = query.gte('starts_at', from)
  if (to)   query = query.lte('starts_at', to)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

// POST /api/classes — admin creates a class
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await supabase
    .from('classes')
    .insert({ ...body, created_by: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

// PATCH /api/classes — admin updates a class
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { class_id, ...updates } = await req.json()

  const { data, error } = await supabase
    .from('classes')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', class_id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
