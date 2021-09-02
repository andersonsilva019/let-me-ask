import { useReducer } from "react";
import { FormEvent } from "react";

import * as Yup from 'yup'
import { database } from "../../services/firebase";
import { yupErrorValidate } from "../../utils/yupErrorValidate";
import { useAuth } from "../useAuth";

type ErrorObjectValidation = {
  newQuestion?: string;
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
  newQuestion: Yup.string().required('Campo obrigatório!'),
})


export function useQuerySendQuestion(roomId: string, newQuestion: string) {

  const { user } = useAuth()

  const [{ isLoading, isError, validationErrors }, dispatch] = useReducer(reducer, INITIAL_STATE)

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    try {
      dispatch({ type: REQUEST_STATUS.PENDING })

      await schemaFormData.validate({ newQuestion }, { abortEarly: false })

      const roomRef = await database.ref(`rooms/${roomId}`).get()

      if (roomRef.val().endedAt) {
        dispatch({
          type: REQUEST_STATUS.REJECTED,
          payload: {
            isError: 'Esta sala já foi encerrada e não é possível enviar novas perguntas'
          }
        })
        return
      }

      if (!user) {
        dispatch({
          type: REQUEST_STATUS.REJECTED,
          payload: {
            isError: 'Realize o login para enviar perguntas'
          }
        })
        return
      }

      const question = {
        content: newQuestion,
        author: {
          name: user.name,
          avatar: user.avatar

        },
        isHighLighted: false,
        isAnswered: false,
      }

      await database.ref(`rooms/${roomId}/questions`).push(question)

    } catch (error) {
      console.log(error)
      if (error instanceof Yup.ValidationError) {
        let objectValidate = {}
        objectValidate = yupErrorValidate(error)
        dispatch({ type: REQUEST_STATUS.REJECTED, payload: { validationErrors: objectValidate } })
      }
    }
  }
  return { isLoading, isError, validationErrors, handleSendQuestion }
}