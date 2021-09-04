import errorIcon from '../../assets/images/error.svg';
import './styles.scss'

type TextInputProps = {
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ error = '', ...props }: TextInputProps) {
  return (
    <div className="container--input">
      <input {...props} className={!!error ? 'error' : ''} />
      {!!error && <div className="error-input">
        <img src={errorIcon} alt="Ícone de error" />
        <span>{error}</span>
      </div>}
    </div>
  )
}