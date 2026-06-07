// Botão reutilizável usado em toda a aplicação
// Props: children, onClick, type, disabled, variant ('primary' | 'danger' | 'ghost')
export default function Button({ children, onClick, type = 'button', disabled = false, variant = 'primary', className = '' }) {
  const styles = {
    primary:  'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60',
    danger:   'bg-red-500 text-white hover:bg-red-600 disabled:opacity-60',
    warning:  'bg-yellow-400 text-white hover:bg-yellow-500 disabled:opacity-60',
    ghost:    'text-gray-500 hover:text-red-500',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ padding: '4px 16px', borderRadius: '9999px', fontSize: '14px', whiteSpace: 'nowrap' }}
      className={`inline-flex items-center justify-center shrink-0 transition-colors disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
