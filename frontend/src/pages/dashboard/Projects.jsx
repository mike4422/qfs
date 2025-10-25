import api from '../../lib/api'
import { useEffect, useState } from 'react'

export default function Projects(){
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')

  useEffect(()=>{(async()=>{
    const { data } = await api.get('/projects')
    setItems(data)
  })()},[])

  const submit = async (e) => {
    e.preventDefault()
    const { data } = await api.post('/projects', { title })
    setItems(prev=>[data, ...prev])
    setTitle('')
  }

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="card">
        <div className="card-body flex gap-2">
          <input className="border rounded px-3 py-2 flex-1" placeholder="Project title" value={title} onChange={e=>setTitle(e.target.value)} />
          <button className="btn-primary">Submit</button>
        </div>
      </form>
      <div className="grid gap-3">
        {items.map(p=> (
          <div key={p.id} className="card"><div className="card-body">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-gray-600">Status: {p.status}</div>
          </div></div>
        ))}
      </div>
    </div>
  )
}