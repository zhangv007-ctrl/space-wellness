'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [lang, setLang] = useState('en')
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const T: any = {
    en: { sub:'Studio Management', login:'Sign In', register:'Create Account', email:'Email', password:'Password', name:'Full Name', loginBtn:'Sign In', registerBtn:'Create Account', forgot:'Forgot password?', role:'I am a…', client:'Client', teacher:'Teacher', switchReg:"Don't have an account? Sign up", switchLog:'Already have an account? Sign in', notif:'Notification preference', emailOnly:'Email only', smsOnly:'SMS only', both:'Email + SMS' },
    zh: { sub:'工作室管理系统', login:'登录', register:'注册', email:'邮箱', password:'密码', name:'姓名', loginBtn:'登录', registerBtn:'创建账户', forgot:'忘记密码？', role:'我的身份', client:'客户', teacher:'教师', switchReg:'没有账户？立即注册', switchLog:'已有账户？立即登录', notif:'通知偏好', emailOnly:'仅邮件', smsOnly:'仅短信', both:'邮件 + 短信' },
  }
  const t = T[lang]
  const inp = { width:'100%', padding:'10px 12px', border:'1px solid #E8DDD0', borderRadius:'8px', fontSize:'13px', background:'#FAF7F2', outline:'none', boxSizing:'border-box' as const }
  const lbl = { fontSize:'12px', fontWeight:500 as const, color:'#8B6F52', textTransform:'uppercase' as const, letterSpacing:'.04em', marginBottom:'6px', display:'block' }

  const handleLogin = () => {
    if (!email || !password) { showToast(lang==='en'?'Please fill in all fields':'请填写所有字段'); return }
    showToast(lang==='en'?'Signing in…':'登录中…')
    setTimeout(() => { window.location.href = `/${lang}/dashboard` }, 1000)
  }

  const handleRegister = () => {
    if (!email || !password || !name) { showToast(lang==='en'?'Please fill in all fields':'请填写所有字段'); return }
    showToast(lang==='en'?'Account created! Redirecting…':'账户已创建！正在跳转…')
    setTimeout(() => { window.location.href = `/${lang}/dashboard` }, 1200)
  }

  return (
    <div style={{minHeight:'100vh',background:'#FAF7F2',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <div style={{position:'absolute',top:'20px',right:'24px',display:'flex',gap:'8px',alignItems:'center'}}>
        <button onClick={()=>setLang('en')} style={{background:'none',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:lang==='en'?700:400,color:lang==='en'?'#3D2B1F':'#8B6F52',padding:'3px 8px'}}>EN</button>
        <span style={{color:'#C9B89E'}}>|</span>
        <button onClick={()=>setLang('zh')} style={{background:'none',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:lang==='zh'?700:400,color:lang==='zh'?'#3D2B1F':'#8B6F52',padding:'3px 8px'}}>中文</button>
      </div>
      <div style={{textAlign:'center',marginBottom:'32px'}}>
        <div style={{fontFamily:'Georgia,serif',fontSize:'32px',color:'#3D2B1F'}}>Space <span style={{color:'#7A9E87',fontStyle:'italic'}}>Wellness</span></div>
        <div style={{fontSize:'13px',color:'#8B6F52',marginTop:'4px'}}>{t.sub}</div>
      </div>
      <div style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:'16px',padding:'32px',width:'100%',maxWidth:'400px',boxShadow:'0 4px 32px rgba(61,43,31,.08)'}}>
        <div style={{display:'flex',gap:'2px',background:'#F2EDE4',borderRadius:'10px',padding:'3px',marginBottom:'24px'}}>
          {[['login',t.login],['register',t.register]].map(([key,label])=>(
            <div key={key} onClick={()=>setTab(key)} style={{flex:1,textAlign:'center',padding:'8px',borderRadius:'8px',fontSize:'13px',cursor:'pointer',background:tab===key?'#fff':'transparent',color:tab===key?'#3D2B1F':'#8B6F52',fontWeight:tab===key?500:400}}>{label}</div>
          ))}
        </div>
        {tab==='login'?(
          <>
            <div style={{marginBottom:'14px'}}><label style={lbl}>{t.email}</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" style={inp}/></div>
            <div style={{marginBottom:'8px'}}><label style={lbl}>{t.password}</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={inp}/></div>
            <div style={{textAlign:'right',marginBottom:'20px'}}><span style={{fontSize:'12px',color:'#7A9E87',cursor:'pointer'}}>{t.forgot}</span></div>
            <button onClick={handleLogin} style={{width:'100%',background:'#3D2B1F',color:'#fff',border:'none',padding:'11px',borderRadius:'8px',fontSize:'14px',fontWeight:500,cursor:'pointer'}}>{t.loginBtn}</button>
            <div style={{textAlign:'center',marginTop:'16px',fontSize:'12px',color:'#8B6F52',cursor:'pointer'}} onClick={()=>setTab('register')}>{t.switchReg}</div>
          </>
        ):(
          <>
            <div style={{marginBottom:'14px'}}><label style={lbl}>{t.name}</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Sarah Chen" style={inp}/></div>
            <div style={{marginBottom:'14px'}}><label style={lbl}>{t.email}</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" style={inp}/></div>
            <div style={{marginBottom:'14px'}}><label style={lbl}>{t.password}</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={inp}/></div>
            <div style={{marginBottom:'14px'}}><label style={lbl}>{t.role}</label><select style={{...inp,cursor:'pointer'}}><option>{t.client}</option><option>{t.teacher}</option></select></div>
            <div style={{marginBottom:'20px'}}><label style={lbl}>{t.notif}</label><select style={{...inp,cursor:'pointer'}}><option>{t.emailOnly}</option><option>{t.smsOnly}</option><option>{t.both}</option></select></div>
            <button onClick={handleRegister} style={{width:'100%',background:'#3D2B1F',color:'#fff',border:'none',padding:'11px',borderRadius:'8px',fontSize:'14px',fontWeight:500,cursor:'pointer'}}>{t.registerBtn}</button>
            <div style={{textAlign:'center',marginTop:'16px',fontSize:'12px',color:'#8B6F52',cursor:'pointer'}} onClick={()=>setTab('login')}>{t.switchLog}</div>
          </>
        )}
      </div>
      <div style={{position:'fixed',bottom:'24px',right:'24px',background:'#3D2B1F',color:'#fff',padding:'12px 20px',borderRadius:'10px',fontSize:'13px',zIndex:300,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(8px)',transition:'all .25s',pointerEvents:'none'}}>{toast}</div>
    </div>
  )
}
