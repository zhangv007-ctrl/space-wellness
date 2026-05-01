'use client'
import { useState } from 'react'

const CLASSES = [
  { name: 'Morning Flow',          level: 'Beginner',     date: 'Wed Jun 18 · 7:00 am',  space: 'Studio A',       teacher: 'Emma K.', booked: 8,  max: 10, waitlist: 0 },
  { name: 'Reformer Fundamentals', level: 'Intermediate', date: 'Wed Jun 18 · 9:30 am',  space: 'Reformer Suite', teacher: 'Lisa M.', booked: 6,  max: 6,  waitlist: 2 },
  { name: 'Core & Balance',        level: 'All levels',   date: 'Wed Jun 18 · 2:00 pm',  space: 'Open Floor',     teacher: 'Emma K.', booked: 4,  max: 12, waitlist: 0 },
  { name: 'Evening Reset',         level: 'Advanced',     date: 'Wed Jun 18 · 5:30 pm',  space: 'Studio A',       teacher: 'Lisa M.', booked: 10, max: 10, waitlist: 3 },
  { name: 'Morning Stretch',       level: 'Beginner',     date: 'Thu Jun 19 · 8:00 am',  space: 'Studio A',       teacher: 'Emma K.', booked: 5,  max: 10, waitlist: 0 },
  { name: 'Power Pilates',         level: 'Advanced',     date: 'Thu Jun 19 · 6:00 pm',  space: 'Open Floor',     teacher: 'Lisa M.', booked: 9,  max: 10, waitlist: 1 },
]

export default function ClassesPage() {
  const [showModal, setShowModal] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState('')
  const [toast, setToast] = useState('')
  const [tab, setTab] = useState('thisWeek')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  return (
    <div style={{padding:8}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
        <div>
          <h1 style={{fontFamily:'Georgia,serif',fontSize:28,color:'#3D2B1F',margin:0}}>Classes</h1>
          <p style={{color:'#8B6F52',margin:'4px 0 0',fontSize:13}}>Manage schedule, capacity, and waitlists</p>
        </div>
        <button onClick={()=>setShowModal(true)} style={{background:'#3D2B1F',color:'#fff',border:'none',padding:'8px 16px',borderRadius:8,cursor:'pointer',fontSize:13}}>+ Create Class</button>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:2,background:'#F2EDE4',borderRadius:10,padding:3,marginBottom:20,width:'fit-content'}}>
        {[['thisWeek','This Week'],['upcoming','Upcoming'],['past','Past']].map(([key,label])=>(
          <div key={key} onClick={()=>setTab(key)} style={{padding:'7px 16px',borderRadius:8,fontSize:13,cursor:'pointer',background:tab===key?'#fff':'transparent',color:tab===key?'#3D2B1F':'#8B6F52',fontWeight:tab===key?500:400,boxShadow:tab===key?'0 1px 4px rgba(61,43,31,.1)':'none'}}>
            {label}
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{background:'#fff',border:'1px solid #E8DDD0',borderRadius:12,overflow:'hidden'}}>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
            <thead>
              <tr style={{borderBottom:'1px solid #E8DDD0'}}>
                {['Class','Date & Time','Space','Teacher','Capacity','Waitlist','Status',''].map(h=>(
                  <th key={h} style={{textAlign:'left',padding:'10px 16px',fontSize:11,letterSpacing:'.07em',textTransform:'uppercase',color:'#C9B89E',fontWeight:500}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLASSES.map((c,i)=>{
                const full = c.booked >= c.max
                const pct = Math.round(c.booked/c.max*100)
                return (
                  <tr key={i} style={{borderBottom:'1px solid #F2EDE4'}}>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{fontWeight:500,color:'#3D2B1F'}}>{c.name}</div>
                      <div style={{fontSize:11,color:'#C9B89E',marginTop:2}}>{c.level}</div>
                    </td>
                    <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{c.date}</td>
                    <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{c.space}</td>
                    <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{c.teacher}</td>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{color:'#3D2B1F'}}>{c.booked}/{c.max}</div>
                      <div style={{height:4,background:'#F2EDE4',borderRadius:2,marginTop:4,width:80}}>
                        <div style={{height:'100%',borderRadius:2,background:full?'#C0544A':'#7A9E87',width:`${pct}%`}}/>
                      </div>
                    </td>
                    <td style={{padding:'12px 16px',color:'#3D2B1F'}}>{c.waitlist}</td>
                    <td style={{padding:'12px 16px'}}>
                      {full
                        ? <span style={{background:'#FAEBE9',color:'#C0544A',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>Full</span>
                        : <span style={{background:'#E8F2EA',color:'#3D7A4E',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>Open</span>
                      }
                    </td>
                    <td style={{padding:'12px 16px'}}>
                      {c.waitlist > 0
                        ? <button onClick={()=>setShowWaitlist(c.name)} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer',color:'#3D2B1F'}}>Waitlist</button>
                        : <button onClick={()=>showToast('Opening editor…')} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer',color:'#3D2B1F'}}>Edit</button>
                      }
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Class Modal */}
      {showModal && (
        <div onClick={e=>e.target===e.currentTarget&&setShowModal(false)} style={{position:'fixed',inset:0,background:'rgba(42,35,32,.4)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(2px)'}}>
          <div style={{background:'#fff',borderRadius:16,padding:28,width:440,maxWidth:'92vw',boxShadow:'0 4px 32px rgba(61,43,31,.12)'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F',marginBottom:4}}>Create Class</div>
            <div style={{fontSize:12,color:'#8B6F52',marginBottom:20}}>Set up a new class on the schedule</div>
            {[['Class name','text','e.g. Morning Flow'],['Date','date',''],['Start time','time','']].map(([label,type,ph])=>(
              <div key={label} style={{marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>{label}</div>
                <input type={type} placeholder={ph} style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',boxSizing:'border-box'}}/>
              </div>
            ))}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
              <div>
                <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>Space</div>
                <select style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}>
                  <option>Studio A</option><option>Reformer Suite</option><option>Zone C</option><option>Open Floor</option><option>Therapy Room</option>
                </select>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>Teacher</div>
                <select style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}>
                  <option>Emma K.</option><option>Lisa M.</option><option>Mark T.</option>
                </select>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
              <div>
                <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>Max capacity</div>
                <input type="number" defaultValue={10} style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2',outline:'none',boxSizing:'border-box'}}/>
              </div>
              <div>
                <div style={{fontSize:12,fontWeight:500,color:'#8B6F52',textTransform:'uppercase',letterSpacing:'.04em',marginBottom:6}}>Level</div>
                <select style={{width:'100%',padding:'9px 12px',border:'1px solid #E8DDD0',borderRadius:8,fontSize:13,background:'#FAF7F2'}}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>All levels</option>
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',paddingTop:16,borderTop:'1px solid #E8DDD0'}}>
              <button onClick={()=>setShowModal(false)} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>Cancel</button>
              <button onClick={()=>{setShowModal(false);showToast('Class created and added to schedule.')}} style={{background:'#3D2B1F',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>Create Class</button>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div onClick={e=>e.target===e.currentTarget&&setShowWaitlist('')} style={{position:'fixed',inset:0,background:'rgba(42,35,32,.4)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(2px)'}}>
          <div style={{background:'#fff',borderRadius:16,padding:28,width:400,maxWidth:'92vw',boxShadow:'0 4px 32px rgba(61,43,31,.12)'}}>
            <div style={{fontFamily:'Georgia,serif',fontSize:22,color:'#3D2B1F',marginBottom:4}}>Waitlist — {showWaitlist}</div>
            <div style={{fontSize:12,color:'#8B6F52',marginBottom:20}}>2 people currently on waitlist</div>
            {[{name:'Anna Park',email:'anna@email.com',pos:1},{name:'James Ko',email:'james@email.com',pos:2}].map(p=>(
              <div key={p.email} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #F2EDE4'}}>
                <div>
                  <div style={{fontWeight:500,color:'#3D2B1F'}}>{p.name}</div>
                  <div style={{fontSize:11,color:'#C9B89E'}}>{p.email}</div>
                </div>
                <div style={{display:'flex',gap:10,alignItems:'center'}}>
                  <span style={{background:'#FDF3E0',color:'#8A6020',padding:'2px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>#{p.pos}</span>
                  <button onClick={()=>{setShowWaitlist('');showToast(`${p.name} confirmed. Notification sent.`)}} style={{background:'#7A9E87',color:'#fff',border:'none',borderRadius:8,padding:'5px 12px',fontSize:12,cursor:'pointer'}}>Confirm</button>
                </div>
              </div>
            ))}
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:20,paddingTop:16,borderTop:'1px solid #E8DDD0'}}>
              <button onClick={()=>setShowWaitlist('')} style={{background:'transparent',border:'1px solid #E8DDD0',borderRadius:8,padding:'8px 16px',fontSize:13,cursor:'pointer'}}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div style={{position:'fixed',bottom:24,right:24,background:'#3D2B1F',color:'#fff',padding:'12px 20px',borderRadius:10,fontSize:13,boxShadow:'0 4px 32px rgba(61,43,31,.12)',zIndex:300,opacity:toast?1:0,transform:toast?'translateY(0)':'translateY(8px)',transition:'all .25s',pointerEvents:'none'}}>
        {toast}
      </div>
    </div>
  )
}
