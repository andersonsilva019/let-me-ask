import { useReducer } from "react";

import { database } from "../../services/firebase";
import { useAuth } from "../useAuth";

const REQUEST_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
} as const

type PayloadType = {
  error: string
}

type ReducerStateType = {
  isLoading: boolean;
  error?: string;
  status: 'idle' | 'pending' | 'resolved' | 'rejected';
}

type ReducerActionType = {
  type: 'idle' | 'pending' | 'resolved' | 'rejected';
  payload?: PayloadType
}

const initalState: ReducerStateType = {
  isLoading: false,
  error: '',
  status: 'idle'
}


function reducer(state: ReducerStateType, action: ReducerActionType) {
  switch (action.type) {
    case REQUEST_STATUS.PENDING: {
      return {
        ...state,
        isLoading: true,
        status: REQUEST_STATUS.PENDING
      };
    }
    case REQUEST_STATUS.RESOLVED: {
      return {
        ...state,
        isLoading: false,
        status: REQUEST_STATUS.RESOLVED
      };
    }
    case REQUEST_STATUS.REJECTED: {
      return {
        ...state,
        isLoading: false,
        error: action.payload?.error,
        status: REQUEST_STATUS.REJECTED
      }
    }
    default:
      return state;

  }
}

export function useQueryLikeQuestion(roomId: string) {

  const [state, dispatch] = useReducer(reducer, initalState)

  const { user } = useAuth()

  const { isLoading, error, status } = state

  async function handleLikeQuestion(questionId: string, likeId?: string) {

    try {
      dispatch({ type: REQUEST_STATUS.PENDING })

      if (likeId) {
        await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
        dispatch({ type: REQUEST_STATUS.RESOLVED })
      } else {
        await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
          authorId: user?.id
        })
        dispatch({ type: REQUEST_STATUS.RESOLVED })
      }
    } catch (error) {
      console.error(error.message)
      dispatch({
        type: REQUEST_STATUS.REJECTED,
        payload: {
          error: 'Ocorreu um erro ao enviar seu like, tente novamente.'
        }
      })
    }
  }
  return {
    isLoading,
    error,
    handleLikeQuestion,
    isSucess: status === REQUEST_STATUS.RESOLVED,
    isError: status === REQUEST_STATUS.REJECTED
  }
}