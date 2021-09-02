import { useState } from 'react';
import { Link } from 'react-router-dom'

import IllustrationImage from '../assets/images/illustration.svg';
import LogoImage from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { TextInput } from '../components/TextInput';

import BeatLoader from 'react-spinners/BeatLoader';
import { useQueryNewRoom } from '../hooks/query/useQueryNewRoom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

import '../styles/auth.scss'

export function NewRoom() {

  const [newRoom, setNewRoom] = useState('')

  const {
    isLoading,
    isError,
    handleCreateRoom,
    validationErrors
  } = useQueryNewRoom(newRoom)

  useEffect(() => {
    if (isError) {
      toast.error(isError)
    }
  }, [isError])

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
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <TextInput
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setNewRoom(event.target.value)}
              value={newRoom}
              error={validationErrors?.newRoom}
            />
            <Button type="submit">
              {!isLoading ? 'Criar sala' :
                (<BeatLoader loading={isLoading} size={12} margin={2} color="#FFF" />)}
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente ? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}