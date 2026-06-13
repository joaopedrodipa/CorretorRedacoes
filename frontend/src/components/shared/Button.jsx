// Botão reutilizável usado em toda a aplicação
// Props: children, onClick, type, disabled, variant ('primary' | 'danger' | 'ghost')
export default function Button({ children, onClick, type = 'button', disabled = false, variant = 'primary', className = '', style = {} }) {
  const variantStyles = {
    primary: { backgroundColor: 'var(--color-primary)', color: '#fff' },
    danger:  { backgroundColor: '#ef4444', color: '#fff' },
    warning: { backgroundColor: '#f59e0b', color: '#fff' },
    ghost:   { backgroundColor: 'transparent', color: '#6b7280' },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center shrink-0 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variant === 'primary' ? 'btn-primary-hover' : ''} ${className}`}
      style={{
        padding: '4px 16px',
        borderRadius: '9999px',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </button>
  )
}
