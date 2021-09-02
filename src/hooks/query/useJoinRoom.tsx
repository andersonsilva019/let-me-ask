import { useReducer } from "react";
import { FormEvent } from "react";
import { useHistory } from "react-router-dom";

import * as Yup from 'yup'
import { database } from "../../services/firebase";
import { yupErrorValidate } from "../../utils/yupErrorValidate";

type ErrorObjectValidation = {
  roomCode?: string;
}

type InitialStateType = {
  isLoading?: boolean,
  isError?: string,
  validationErrors?: ErrorObjectValidation
}

const INITIAL_STATE = {
  isLoading: false,
  isError: '',
  validationErrors: {}
}

const REQUEST_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
} as const

function reducer(
  state: InitialStateType,
  action: { type: 'pending' | 'resolved' | 'rejected', payload?: InitialStateType }
) {
  switch (action.type) {
    case REQUEST_STATUS.PENDING:
      return { isLoading: true };
    case REQUEST_STATUS.RESOLVED:
      return { isLoading: false };
    case REQUEST_STATUS.REJECTED:
      return {
        isLoading: false,
        isError: action.payload?.isError,
        validationErrors: action.payload?.validationErrors
      }
    default:
      throw Error(`Unhandled action ${action.type}`)
  }
}

const schemaFormData = Yup.object().shape({
  roomCode: Yup.string().required('O código da sala é obrigatório!'),
})


export function useJoinRoom(roomCode: string) {

  const history = useHistory()

  const [{ isLoading, isError, validationErrors }, dispatch] = useReducer(reducer, INITIAL_STATE)

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    try {
      dispatch({ type: REQUEST_STATUS.PENDING })

      await schemaFormData.validate({ roomCode }, { abortEarly: false })

      const roomRef = await database.ref(`rooms/${roomCode}`).get()

      if (!roomRef.exists()) {
        dispatch({
          type: REQUEST_STATUS.REJECTED,
          payload: {
            isError: 'Sala não encontrada!'
          }
        })
        return
      }

      if (roomRef.val().endedAt) {
        dispatch({
          type: REQUEST_STATUS.REJECTED,
          payload: {
            isError: 'Essa sala já foi encerrada!'
          }
        })
        return
      }

      history.push(`/rooms/${roomCode}`);

    } catch (error) {

      if (error instanceof Yup.ValidationError) {
        let objectValidate = {}
        if (!roomCode) {
          objectValidate = yupErrorValidate(error)
          dispatch({ type: REQUEST_STATUS.REJECTED, payload: { validationErrors: objectValidate } })
        }
      }
    }


  }

  return { isLoading, isError, validationErrors, handleJoinRoom }
}