'use client'
import { useState } from 'react'
const CLIENTS = [
  { name: 'Mia Liu',       email: 'mia@email.com',   phone: '647-555-0192', role: 'client',  classes: 12, active: true },
  { name: 'Mark Torres',   email: 'mark@email.com',  phone: '416-555-0847', role: 'teacher', classes: 0,  active: true },
  { name: 'Anna Park',     email: 'anna@email.com',  phone: '905-555-0311', role: 'client',  classes: 3,  active: true },
  { name: 'Tom Walsh',     email: 'tom@email.com',   phone: '647-555-0024', role: 'client',  classes: 7,  active: false },
  { name: 'Emma Kowalski', email: 'emma@email.com',  phone: '416-555-0199', role: 'teacher', classes: 0,  active: true },
  { name: 'Lisa Martini',  email: 'lisa@email.com',  phone: '905-555-0482', role: 'teacher', classes: 0,  active: true },
  { name: 'James Ko',      email: 'james@email.com', phone: '416-555-0301', role: 'client',  classes: 5,  active: true },
]
export default function ClientsPage({ params }: { params: { locale: string } }) {
  const zh = params.locale === 'zh'
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const filtered = CLIENTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
  const roleLabel = (r: string) => r === 'client' ? (zh?'客户':'Client') : r === 'teacher' ? (zh?'教师':'Teacher') : (zh?'管理员':'Admin')
  const roleColor = (r: string) => r === 'client' ? '#E8EFF8' : r === 'teacher' ? '#FDF3E0' : '#F2EDE4'
  const roleText = (r: string) => r === 'client' ? '#3A5F96' : r === 'teacher' ? '#8A6020' : '#8B6F52'
  return (
    <div style={{padding:8}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
        <div>
          <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>{zh?'客户管理':'Clients'}</h1>
          <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>84 {zh?'位活跃会员':'active members'}</p>
        </div>
        <button onClick={()=>setShowModal(true)} style={{background:'#3D2B1F',color:'#fff',border:'none',padding:'8px 16px',borderRadius:8,cursor:'pointer',fontSize:13}}>{zh?'+ 添加客户':'+ Add Client'}</button>
      </div>
      <div style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'16px 16px 0',display:'flex',gap:10}}>
          <input placeholder={zh?'搜索姓名或邮箱…':'Search by name or email…'} value={search} onChange={e=>setSearch(e.target.value)} style={{padding:'8px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',width:260}}/>
          <select style={{padding:'8px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}>
            <option>{zh?'全部状态':'All statuses'}</option>
            <option>{zh?'有效':'Active'}</option>
            <option>{zh?'停用':'Inactive'}</option>
          </select>
        </div>
        <div style={{overflowX:'auto',marginTop:12}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead><tr style={{borderBottom:'1px solid #E8DDD0'}}>
              {[zh?'姓名':'Name',zh?'邮箱':'Email',zh?'电话':'Phone',zh?'角色':'Role',zh?'课程数':'Classes',zh?'状态':'Status',''].map(h=><th key={h} style={{textAlign:'left',padding:'10px 16px',fontSize:11,letterSpacing:'.07em',textTransform:'uppercase',color:'#C9B89E',fontWeight:500}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.map((c,i)=>(
                <tr key={i} style={{borderBottom:'1px solid #F2EDE4',cursor:'pointer'}}>
                  <td style={{padding:'12px 16px',fontWeight:500,color:'#3D2B1F'}}>{c.name}</td>
                  <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{c.email}</td>
                  <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{c.phone}</td>
                  <td style={{padding:'12px 16px'}}><span style={{background:roleColor(c.role),color:roleText(c.role),padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>{roleLabel(c.role)}</span></td>
                  <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{c.classes||'—'}</td>
                  <td style={{padding:'12px 16px'}}><span style={{background:c.active?'#E8F2EA':'#FAEBE9',color:c.active?'#3D7A4E':'#C0544A',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>{c.active?(zh?'有效':'Active'):(zh?'停用':'Inactive')}</span></td>
                  <td style={{padding:'12px 16px'}}><button onClick={()=>showToast((zh?'正在打开':'Opening ')+c.name+(zh?'的档案…':"'s profile…"))} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer',color:'#3D2B1F'}}>{zh?'查看':'View'}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal&&(
        <div onClick={e=>e.target===e.currentTarget&&setShowModal(false)} style={{position:'fixed',inset:0,background:'rgba(42,35,32,.4)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(2px)'}}>
          <div style={{background:'#fff',borderRadius:16,padding:28,width:440,maxWidth:'92vw',boxShadow:'0 4px 32px rgba(61,43,31,.12)'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F',marginBottom:4}}>{zh?'新建客户档案':'New Client Profile'}</div>
            <div style={{fontSize:12,color:'#8B6F52',marginBottom:20}}>{zh?'填写以下信息创建账户':'Fill in the details to create a new account'}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
              {[zh?'名字':'First name',zh?'姓氏':'Last name'].map(l=><div key={l}><div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>{l}</div><input style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',boxSizing:'border-box' as const}}/></div>)}
            </div>
            {[zh?'邮箱':'Email',zh?'电话':'Phone'].map(l=><div key={l} style={{marginBottom:14}}><div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>{l}</div><input style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',boxSizing:'border-box' as const}}/></div>)}
            <div style={{marginBottom:14}}><div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>{zh?'角色':'Role'}</div><select style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>{zh?'客户':'Client'}</option><option>{zh?'教师':'Teacher'}</option><option>{zh?'管理员':'Admin'}</option></select></div>
            <div style={{marginBottom:20}}><div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>{zh?'通知偏好':'Notification preference'}</div><select style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}><option>{zh?'仅邮件':'Email only'}</option><option>{zh?'仅短信':'SMS only'}</option><option>{zh?'邮件 + 短信':'Email + SMS'}</option></select></div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',paddingTop:16,borderTop:'1px solid #E8DDD0'}}>
              <button onClick={()=>setShowModal(false)} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>{zh?'取消':'Cancel'}</button>
              <button onClick={()=>{setShowModal(false);showToast(zh?'客户档案已创建，欢迎邮件已发送。':'Client profile created. Welcome email sent.')}} style={{background:'#3D2B1F',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>{zh?'创建档案':'Create Profile'}</button>
            </div>
          </div>
        </div>
      )}
      <div style={{position:'fixed',bottom:24,right:24,background:'#3D2B1F',color:'#fff',padding:'12px 20px',borderRadius:10,fontSize:13,zIndex:300,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(8px)',transition:'all .25s',pointerEvents:'none'}}>{toast}</div>
    </div>
  )
}
