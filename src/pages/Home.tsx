import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify';
import BeatLoader from 'react-spinners/BeatLoader'

import IllustrationImage from '../assets/images/illustration.svg';
import LogoImage from '../assets/images/logo.svg';
import GoogleIconImage from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';

import { useAuth } from '../hooks/useAuth';
import { useJoinRoom } from '../hooks/query/useJoinRoom';

import '../styles/auth.scss'

export function Home() {

  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState('')
  const {
    isLoading,
    isError,
    handleJoinRoom,
    validationErrors
  } = useJoinRoom(roomCode)

  useEffect(() => {
    if (isError) {
      toast.error(isError)
    }
  }, [isError])

  async function handleCreateRoom() {

    if (!user) {
      await signInWithGoogle()
    }

    history.push('/rooms/new');

  }

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
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={GoogleIconImage} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <TextInput
              type="text"
              placeholder="Digite o código da sala"
              error={validationErrors?.roomCode}
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button type="submit">
              {!isLoading ? 'Entrar na sala' :
                (<BeatLoader loading={isLoading} size={12} margin={2} color="#FFF" />)}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}