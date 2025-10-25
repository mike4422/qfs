export default function Services(){
  const items = [
    { title: 'Asset Security', desc: 'Multi‑sig, cold storage principles, recovery flows.' },
    { title: 'Wallet Sync', desc: 'Cross‑device sync and address book reconciliation.' },
    { title: 'QFS Cards', desc: 'Virtual/physical card issuance and spend controls.' },
    { title: 'Asset Recovery', desc: 'Submit incidents; track recovery updates.' },
    { title: 'Humanitarian Program', desc: 'Submit projects with milestones and KYC.' },
  ]
  return (
    <div className="container-px py-12">
      <h2 className="text-3xl font-semibold mb-6">Services</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it,i)=> (
          <div key={i} className="card"><div className="card-body">
            <h3 className="font-semibold mb-1">{it.title}</h3>
            <p className="text-sm text-gray-600">{it.desc}</p>
          </div></div>
        ))}
      </div>
    </div>
  )
}