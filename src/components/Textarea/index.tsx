import errorIcon from '../../assets/images/error.svg';

import './styles.scss'

type TextareaProps = {
  error?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ error = '', ...props }: TextareaProps) {
  return (
    <div className="container--textarea">
      <textarea {...props} className={!!error ? 'error' : ''} />
      {!!error && <div className="error-textarea">
        <img src={errorIcon} alt="Ícone de error" />
        <span>{error}</span>
      </div>}
    </div>
  )
}