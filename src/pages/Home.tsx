import IllustrationImage from '../assets/images/illustration.svg';
import LogoImage from '../assets/images/logo.svg';
import GoogleIconImage from '../assets/images/google-icon.svg';

import '../styles/auth.scss'
import { Button } from '../components/Button';

export function Home() {
  return (
    <div id="page-auth">
      <aside>
        <img src={IllustrationImage} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={LogoImage} alt="Logo da LetMe" />
          <button className="create-room">
            <img src={GoogleIconImage} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form>
            <input
              type="text"
              placeholder="Digite o código da sala"
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}