// supabase/functions/send-notification/index.ts
// Deploy with: supabase functions deploy send-notification
//
// Required env vars (set in Supabase Dashboard → Settings → Edge Functions):
//   RESEND_API_KEY      — from resend.com
//   TWILIO_ACCOUNT_SID  — from twilio.com
//   TWILIO_AUTH_TOKEN
//   TWILIO_FROM_NUMBER  — your Twilio phone number
//   STUDIO_EMAIL        — e.g. hello@spacewellness.ca

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TEMPLATES: Record<string, { subject: string; body: (data: any) => string }> = {
  booking_confirmed: {
    subject: 'Your booking is confirmed ✓',
    body: (d) => `Hi ${d.name},\n\nYour spot in "${d.class_name}" on ${d.date} at ${d.time} is confirmed.\n\nSee you on the mat!\n— Space Wellness`,
  },
  waitlist_joined: {
    subject: 'You\'re on the waitlist',
    body: (d) => `Hi ${d.name},\n\nYou're #${d.pos} on the waitlist for "${d.class_name}" on ${d.date}.\n\nWe'll notify you immediately if a spot opens up.\n— Space Wellness`,
  },
  waitlist_promoted: {
    subject: 'Great news — a spot opened up!',
    body: (d) => `Hi ${d.name},\n\nA spot just opened in "${d.class_name}" on ${d.date} at ${d.time}. You're confirmed!\n\n— Space Wellness`,
  },
  booking_cancelled: {
    subject: 'Booking cancellation confirmed',
    body: (d) => `Hi ${d.name},\n\nYour booking for "${d.class_name}" on ${d.date} has been cancelled.\n\n— Space Wellness`,
  },
  rental_confirmed: {
    subject: 'Space rental confirmed',
    body: (d) => `Hi ${d.name},\n\nYour rental of ${d.space_name} on ${d.date} from ${d.start_time} to ${d.end_time} is confirmed.\n\n— Space Wellness`,
  },
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { user_id, trigger, booking_id, rental_id } = await req.json()

  // Load user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, phone, notif_pref')
    .eq('id', user_id)
    .single()

  if (!profile) return new Response('User not found', { status: 404 })

  // Build template data
  let templateData: Record<string, any> = { name: profile.full_name }

  if (booking_id) {
    const { data: booking } = await supabase
      .from('bookings')
      .select('waitlist_pos, classes(name, starts_at)')
      .eq('id', booking_id)
      .single()
    if (booking) {
      const cls = booking.classes as any
      const dt  = new Date(cls.starts_at)
      templateData = {
        ...templateData,
        class_name: cls.name,
        date: dt.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' }),
        time: dt.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }),
        pos:  booking.waitlist_pos,
      }
    }
  }

  if (rental_id) {
    const { data: rental } = await supabase
      .from('space_rentals')
      .select('starts_at, ends_at, spaces(name)')
      .eq('id', rental_id)
      .single()
    if (rental) {
      const space = rental.spaces as any
      const start = new Date(rental.starts_at)
      const end   = new Date(rental.ends_at)
      templateData = {
        ...templateData,
        space_name: space.name,
        date:       start.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' }),
        start_time: start.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' }),
        end_time:   end.toLocaleTimeString('en-CA',   { hour: '2-digit', minute: '2-digit' }),
      }
    }
  }

  const template = TEMPLATES[trigger]
  if (!template) return new Response('Unknown trigger', { status: 400 })

  const subject = template.subject
  const body    = template.body(templateData)
  const results: string[] = []

  // ── Send Email via Resend ──
  if (profile.notif_pref === 'email' || profile.notif_pref === 'both') {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from:    `Space Wellness <${Deno.env.get('STUDIO_EMAIL')}>`,
        to:      [profile.email],
        subject,
        text:    body,
      }),
    })
    const ok = res.ok
    results.push(`email:${ok}`)

    await supabase.from('notifications').insert({
      user_id,
      type:    'email',
      subject,
      body,
      trigger,
      success: ok,
    })
  }

  // ── Send SMS via Twilio ──
  if ((profile.notif_pref === 'sms' || profile.notif_pref === 'both') && profile.phone) {
    const sid   = Deno.env.get('TWILIO_ACCOUNT_SID')!
    const token = Deno.env.get('TWILIO_AUTH_TOKEN')!
    const from  = Deno.env.get('TWILIO_FROM_NUMBER')!

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${sid}:${token}`)}`,
        },
        body: new URLSearchParams({ To: profile.phone, From: from, Body: `${subject}\n\n${body}` }),
      }
    )
    const ok = res.ok
    results.push(`sms:${ok}`)

    await supabase.from('notifications').insert({
      user_id,
      type:    'sms',
      body:    `${subject}\n\n${body}`,
      trigger,
      success: ok,
    })
  }

  return new Response(JSON.stringify({ sent: results }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
