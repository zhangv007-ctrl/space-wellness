import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { type, to, name, className, date, space } = await request.json()

  const subjects: Record<string, string> = {
    booking_confirmed: `Booking Confirmed – ${className}`,
    booking_cancelled: `Booking Cancelled – ${className}`,
    rental_confirmed: `Space Rental Confirmed – ${space}`,
  }

  const bodies: Record<string, string> = {
    booking_confirmed: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;color:#3D2B1F">
        <h1 style="font-size:24px;margin-bottom:8px">Space <em style="color:#8B6F52">Wellness</em></h1>
        <p style="color:#8B6F52;font-size:13px;margin-bottom:24px">Studio Management</p>
        <h2 style="font-size:20px;margin-bottom:16px">Your booking is confirmed ✦</h2>
        <p>Hi ${name},</p>
        <p>Your spot in <strong>${className}</strong> has been confirmed.</p>
        <div style="background:#F2EDE4;border-radius:10px;padding:16px 20px;margin:20px 0">
          <div style="margin-bottom:8px">📅 <strong>${date}</strong></div>
          <div>📍 <strong>${space}</strong></div>
        </div>
        <p style="color:#8B6F52;font-size:13px">We look forward to seeing you. Please arrive 5 minutes early.</p>
        <hr style="border:none;border-top:1px solid #E8DDD0;margin:24px 0"/>
        <p style="color:#C9B89E;font-size:12px">Space Wellness Studio</p>
      </div>
    `,
    booking_cancelled: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;color:#3D2B1F">
        <h1 style="font-size:24px;margin-bottom:8px">Space <em style="color:#8B6F52">Wellness</em></h1>
        <p style="color:#8B6F52;font-size:13px;margin-bottom:24px">Studio Management</p>
        <h2 style="font-size:20px;margin-bottom:16px">Booking Cancelled</h2>
        <p>Hi ${name},</p>
        <p>Your booking for <strong>${className}</strong> on <strong>${date}</strong> has been cancelled.</p>
        <p style="color:#8B6F52;font-size:13px">If you have any questions, please contact us.</p>
        <hr style="border:none;border-top:1px solid #E8DDD0;margin:24px 0"/>
        <p style="color:#C9B89E;font-size:12px">Space Wellness Studio</p>
      </div>
    `,
    rental_confirmed: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;color:#3D2B1F">
        <h1 style="font-size:24px;margin-bottom:8px">Space <em style="color:#8B6F52">Wellness</em></h1>
        <p style="color:#8B6F52;font-size:13px;margin-bottom:24px">Studio Management</p>
        <h2 style="font-size:20px;margin-bottom:16px">Space Rental Confirmed ✦</h2>
        <p>Hi ${name},</p>
        <p>Your rental of <strong>${space}</strong> has been confirmed.</p>
        <div style="background:#F2EDE4;border-radius:10px;padding:16px 20px;margin:20px 0">
          <div style="margin-bottom:8px">📅 <strong>${date}</strong></div>
          <div>📍 <strong>${space}</strong></div>
        </div>
        <p style="color:#8B6F52;font-size:13px">Please arrive on time. Contact us if you need to make changes.</p>
        <hr style="border:none;border-top:1px solid #E8DDD0;margin:24px 0"/>
        <p style="color:#C9B89E;font-size:12px">Space Wellness Studio</p>
      </div>
    `,
  }

  try {
    await resend.emails.send({
      from: 'Space Wellness <onboarding@resend.dev>',
      to,
      subject: subjects[type] || 'Notification from Space Wellness',
      html: bodies[type] || '<p>Thank you for using Space Wellness.</p>',
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
