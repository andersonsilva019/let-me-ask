import { useReducer } from "react";
import { FormEvent } from "react";

import * as Yup from 'yup'
import { database } from "../../services/firebase";
import { yupErrorValidate } from "../../utils/yupErrorValidate";
import { useAuth } from "../useAuth";

type ErrorObjectValidation = {
  newQuestion?: string;
}

type PayloadType = {
  error?: string
  validationErrors?: ErrorObjectValidation
}

type ReducerStateType = {
  isLoading: boolean,
  error?: string,
  validationErrors?: ErrorObjectValidation,
  status: 'idle' | 'pending' | 'resolved' | 'rejected'
}

type ReducerActionType = {
  type: 'idle' | 'pending' | 'resolved' | 'rejected',
  payload?: PayloadType
}

const REQUEST_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
} as const

const initialState = {
  isLoading: false,
  error: '',
  validationErrors: {},
  status: REQUEST_STATUS.IDLE
}

function reducer(state: ReducerStateType, action: ReducerActionType) {
  switch (action.type) {
    case REQUEST_STATUS.PENDING:
      return {
        ...state,
        isLoading: true,
        status: REQUEST_STATUS.PENDING
      };
    case REQUEST_STATUS.RESOLVED:
      return {
        ...state,
        isLoading: false,
        status: REQUEST_STATUS.RESOLVED
      };
    case REQUEST_STATUS.REJECTED:
      return {
        ...state,
        isLoading: false,
        error: action.payload?.error,
        validationErrors: action.payload?.validationErrors,
        status: REQUEST_STATUS.REJECTED
      }
    default:
      return state;
  }
}

const schemaFormData = Yup.object().shape({
  newQuestion: Yup.string().required('Campo obrigatório!'),
})

export function useQuerySendQuestion(roomId: string, newQuestion: string) {

  const { user } = useAuth()

  const [state, dispatch] = useReducer(reducer, initialState)

  const { isLoading, error, validationErrors, status } = state

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
            error: 'Esta sala já foi encerrada e não é possível enviar novas perguntas'
          }
        })
        return
      }

      if (!user) {
        dispatch({
          type: REQUEST_STATUS.REJECTED,
          payload: {
            error: 'Realize o login para enviar perguntas'
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

      dispatch({ type: REQUEST_STATUS.RESOLVED })

    } catch (error) {
      console.log(error)
      if (error instanceof Yup.ValidationError) {
        let objectValidate = {}
        objectValidate = yupErrorValidate(error)
        dispatch({
          type: REQUEST_STATUS.REJECTED,
          payload: {
            validationErrors: objectValidate,
            error: 'Opss... Você não preencheu o campo de perguntas!'
          }
        })
      }
    }
  }
  return {
    isLoading,
    error,
    isError: status === REQUEST_STATUS.REJECTED,
    isSuccess: status === REQUEST_STATUS.RESOLVED,
    validationErrors,
    handleSendQuestion
  }
}