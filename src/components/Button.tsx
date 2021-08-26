import '../styles/button.scss'

type ButtonProps = {
  children: React.ReactNode;
  isOutline?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, isOutline = false, ...props }: ButtonProps) {
  return (
    <button
      className={`button ${isOutline && 'outlined'}`}
      {...props}
    >
      {children}
    </button>
  )
}