import './Buttons.css'

export function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  block = false,
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
