export default function FeatureCard({ title, desc }){
  return (
    <div className="card h-full">
      <div className="card-body">
        <div className="h-10 w-10 rounded bg-primary-100 mb-3"/>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  )
}