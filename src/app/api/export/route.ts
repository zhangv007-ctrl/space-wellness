import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'bookings'

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let csv = ''
  let filename = ''

  if (type === 'bookings') {
    const { data } = await supabase
      .from('bookings')
      .select('*, profiles(full_name, email, phone), classes(title, start_time, price)')
      .order('created_at', { ascending: false })
    
    filename = 'bookings.csv'
    csv = 'Client,Email,Phone,Class,Date,Price,Status,Booked At\n'
    csv += (data || []).map(b => [
      b.profiles?.full_name || '',
      b.profiles?.email || '',
      b.profiles?.phone || '',
      b.classes?.title || '',
      b.classes?.start_time ? new Date(b.classes.start_time).toLocaleDateString() : '',
      b.classes?.price || 0,
      b.status,
      new Date(b.created_at).toLocaleDateString()
    ].map(v => `"${v}"`).join(',')).join('\n')

  } else if (type === 'clients') {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    
    filename = 'clients.csv'
    csv = 'Name,Email,Phone,Role,Joined\n'
    csv += (data || []).map(c => [
      c.full_name || '',
      c.email || '',
      c.phone || '',
      c.role || 'client',
      new Date(c.created_at).toLocaleDateString()
    ].map(v => `"${v}"`).join(',')).join('\n')

  } else if (type === 'rentals') {
    const { data } = await supabase
      .from('rentals')
      .select('*, profiles(full_name, email), spaces(name)')
      .order('created_at', { ascending: false })
    
    filename = 'rentals.csv'
    csv = 'Client,Email,Space,Start Time,End Time,Total Price,Status\n'
    csv += (data || []).map(r => [
      r.profiles?.full_name || '',
      r.profiles?.email || '',
      r.spaces?.name || '',
      new Date(r.start_time).toLocaleString(),
      new Date(r.end_time).toLocaleString(),
      r.total_price || 0,
      r.status
    ].map(v => `"${v}"`).join(',')).join('\n')

  } else if (type === 'revenue') {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*, classes(title, price)')
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })
    
    const { data: rentals } = await supabase
      .from('rentals')
      .select('*, spaces(name)')
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })

    filename = 'revenue.csv'
    csv = 'Type,Item,Amount,Date\n'
    csv += (bookings || []).map(b => [
      'Class Booking',
      b.classes?.title || '',
      b.classes?.price || 0,
      new Date(b.created_at).toLocaleDateString()
    ].map(v => `"${v}"`).join(',')).join('\n')
    csv += '\n'
    csv += (rentals || []).map(r => [
      'Space Rental',
      r.spaces?.name || '',
      r.total_price || 0,
      new Date(r.created_at).toLocaleDateString()
    ].map(v => `"${v}"`).join(',')).join('\n')
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    }
  })
}
