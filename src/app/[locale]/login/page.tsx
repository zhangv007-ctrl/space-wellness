'use client'
import { useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const zh = locale === 'zh'
  const supabase = createClient()
  const router = useRouter()

  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(false)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const handleLogin = async () => {
    if (!email || !password) return showToast(zh ? '请填写邮箱和密码' : 'Please enter email and password')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return showToast(zh ? '登录失败，请检查邮箱和密码' : 'Login failed, check your email and password')
    router.push(`/${locale}/dashboard`)
    router.refresh()
  }

  const handleRegister = async () => {
    if (!email || !password) return showToast(zh ? '请填写邮箱和密码' : 'Please enter email and password')
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    })
    setLoading(false)
    if (error) return showToast(zh ? '注册失败：' + error.message : 'Registration failed: ' + error.message)
    showToast(zh ? '注册成功！正在跳转…' : 'Registered! Redirecting…')
    setTimeout(() => router.push(`/${locale}/dashboard`), 1000)
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
          <p style={{ color: '#8B6F52', fontSize: 13, margin: 0 }}>Studio Management</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 4px 24px rgba(61,43,31,.08)' }}>
          <div style={{ display: 'flex', background: '#F2EDE4', borderRadius: 10, padding: 3, marginBottom: 24 }}>
            {[['login', zh ? '登录' : 'Sign In'], ['register', zh ? '注册' : 'Create Account']].map(([key, label]) => (
              <div key={key} onClick={() => setTab(key)}
                style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 8, fontSize: 13, cursor: 'pointer', background: tab === key ? '#fff' : 'transparent', color: tab === key ? '#3D2B1F' : '#8B6F52', fontWeight: tab === key ? 500 : 400 }}>
                {label}
              </div>
            ))}
          </div>

          {tab === 'register' && (
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>{zh ? '姓名' : 'Full Name'}</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder={zh ? '你的姓名' : 'Your name'} style={inp} />
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>{zh ? '邮箱' : 'Email'}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" style={inp} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>{zh ? '密码' : 'Password'}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inp}
              onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())} />
          </div>

          <button
            onClick={tab === 'login' ? handleLogin : handleRegister}
            disabled={loading}
            style={{ width: '100%', background: '#3D2B1F', color: '#fff', border: 'none', padding: 12, borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? (zh ? '请稍候…' : 'Please wait…') : (tab === 'login' ? (zh ? '登录' : 'Sign In') : (zh ? '创建账号' : 'Create Account'))}
          </button>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#3D2B1F', color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 13, zIndex: 300, opacity: toast ? 1 : 0, transition: 'all .25s', pointerEvents: 'none' }}>{toast}</div>
    </div>
  )
}
