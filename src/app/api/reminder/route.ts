import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: Request) {
  // 验证 cron secret 防止未授权访问
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const now = new Date()
  
  // 找出 24 小时内即将开始的课程
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const in23h = new Date(now.getTime() + 23 * 60 * 60 * 1000)

  const { data: upcomingClasses } = await supabase
    .from('classes')
    .select('*, spaces(name)')
    .gte('start_time', in23h.toISOString())
    .lte('start_time', in24h.toISOString())
    .eq('is_active', true)

  if (!upcomingClasses || upcomingClasses.length === 0) {
    return NextResponse.json({ message: 'No upcoming classes in 24h', sent: 0 })
  }

  let sent = 0

  for (const cls of upcomingClasses) {
    // 找出该课程所有已确认的预约
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*, profiles(full_name, email)')
      .eq('class_id', cls.id)
      .eq('status', 'confirmed')

    if (!bookings || bookings.length === 0) continue

    const start = new Date(cls.start_time)
    const dateStr = start.toLocaleDateString('en-US', { 
      weekday: 'long', month: 'long', day: 'numeric' 
    }) + ' at ' + start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    for (const booking of bookings) {
      const email = booking.profiles?.email
      const name = booking.profiles?.full_name || 'there'
      if (!email) continue

      try {
        await resend.emails.send({
          from: 'Space Wellness <onboarding@resend.dev>',
          to: email,
          subject: `Reminder: ${cls.title} tomorrow`,
          html: `
            <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;color:#3D2B1F">
              <h1 style="font-size:24px;margin-bottom:8px">Space <em style="color:#8B6F52">Wellness</em></h1>
              <p style="color:#8B6F52;font-size:13px;margin-bottom:24px">Studio Management</p>
              <h2 style="font-size:20px;margin-bottom:16px">Class Reminder ⏰</h2>
              <p>Hi ${name},</p>
              <p>This is a friendly reminder that your class is coming up tomorrow!</p>
              <div style="background:#F2EDE4;border-radius:10px;padding:16px 20px;margin:20px 0">
                <div style="font-size:18px;font-weight:bold;margin-bottom:8px">${cls.title}</div>
                <div style="margin-bottom:6px">📅 <strong>${dateStr}</strong></div>
                <div>📍 <strong>${cls.spaces?.name || 'Studio'}</strong></div>
              </div>
              <p style="color:#8B6F52;font-size:13px">Please arrive 5 minutes early. See you soon!</p>
              <hr style="border:none;border-top:1px solid #E8DDD0;margin:24px 0"/>
              <p style="color:#C9B89E;font-size:12px">Space Wellness Studio · info@spacewellness.ca</p>
            </div>
          `
        })
        sent++
      } catch (e) {
        console.error('Failed to send reminder to', email, e)
      }
    }
  }

  return NextResponse.json({ 
    message: `Reminders sent`, 
    classes: upcomingClasses.length,
    sent 
  })
}
