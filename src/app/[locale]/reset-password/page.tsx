'use client'
import { useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const zh = locale === 'zh'
  const supabase = createClient()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleReset = async () => {
    if (!password || !confirm) return showToast(zh ? '请填写所有字段' : 'Please fill all fields')
    if (password !== confirm) return showToast(zh ? '两次密码不一致' : 'Passwords do not match')
    if (password.length < 6) return showToast(zh ? '密码至少6位' : 'Password must be at least 6 characters')
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return showToast(zh ? '重置失败：' + error.message : 'Reset failed: ' + error.message)
    showToast(zh ? '密码已重置！正在跳转…' : 'Password reset! Redirecting…')
    setTimeout(() => router.push(`/${locale}/dashboard`), 1500)
  }

  const inp = { width: '100%', padding: '10px 12px', border: '1px solid #E8DDD0', borderRadius: 8, fontSize: 14, background: '#FAF7F2', outline: 'none', boxSizing: 'border-box' as const }
  const lbl = { fontSize: 11, fontWeight: 500, color: '#8B6F52', textTransform: 'uppercase' as const, letterSpacing: '.04em', marginBottom: 6, display: 'block' }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 32, color: '#3D2B1F', margin: '0 0 4px' }}>
            Space <em style={{ color: '#8B6F52' }}>Wellness</em>
          </h1>
          <p style={{ color: '#8B6F52', fontSize: 13, margin: 0 }}>{zh ? '重置密码' : 'Reset Password'}</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 4px 24px rgba(61,43,31,.08)' }}>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>{zh ? '新密码' : 'New Password'}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inp} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={lbl}>{zh ? '确认密码' : 'Confirm Password'}</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" style={inp}
              onKeyDown={e => e.key === 'Enter' && handleReset()} />
          </div>
          <button onClick={handleReset} disabled={loading}
            style={{ width: '100%', background: '#3D2B1F', color: '#fff', border: 'none', padding: 12, borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? (zh ? '请稍候…' : 'Please wait…') : (zh ? '重置密码' : 'Reset Password')}
          </button>
        </div>
      </div>
      <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
