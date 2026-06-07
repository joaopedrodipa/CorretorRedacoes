// Logo.jsx
export default function Logo() {
  return (
    <div className="flex flex-col items-center mb-5">
      <svg viewBox="0 0 64 64" width="40" height="40" className="mb-2">
        <rect x="10" y="6" width="44" height="52" rx="4" fill="#4f46e5"/>
        <rect x="6" y="6" width="8" height="52" rx="3" fill="#312e81"/>
        <line x1="22" y1="22" x2="48" y2="22" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
        <line x1="22" y1="32" x2="48" y2="32" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
        <line x1="22" y1="42" x2="40" y2="42" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7"/>
        <circle cx="10" cy="18" r="2.5" fill="#4f46e5"/>
        <circle cx="10" cy="32" r="2.5" fill="#4f46e5"/>
        <circle cx="10" cy="46" r="2.5" fill="#4f46e5"/>
      </svg>
      <span className="text-lg font-bold text-indigo-600">CorretorTextual</span>
    </div>
  )
}