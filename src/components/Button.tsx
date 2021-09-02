import BeatLoader from 'react-spinners/BeatLoader'
import '../styles/button.scss'

type ButtonProps = {
  children: React.ReactNode;
  isOutline?: boolean;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ children, loading, isOutline = false, ...props }: ButtonProps) {
  return (
    <button
      className={`button ${isOutline ? 'outlined' : ''}`}
      {...props}
    >
      {!loading ? children :
        (<BeatLoader loading={loading} size={12} margin={2} color="#FFF" />)
      }
    </button>
  )
}