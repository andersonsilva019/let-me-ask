import { useReducer } from "react";
import { FormEvent } from "react";
import { useHistory } from "react-router-dom";

import * as Yup from 'yup'
import { database } from "../../services/firebase";
import { yupErrorValidate } from "../../utils/yupErrorValidate";
import { useAuth } from "../useAuth";

type ErrorObjectValidation = {
  newRoom?: string;
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
  newRoom: Yup.string().required('Campo obrigatório!'),
})


export function useQueryNewRoom(newRoom: string) {

  const { user } = useAuth()
  const history = useHistory()

  const [{ isLoading, isError, validationErrors }, dispatch] = useReducer(reducer, INITIAL_STATE)

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()

    try {
      dispatch({ type: REQUEST_STATUS.PENDING })

      await schemaFormData.validate({ newRoom }, { abortEarly: false })

      const roomRef = database.ref('rooms')

      const firebaseRoom = await roomRef.push({
        title: newRoom,
        authorId: user?.id,
      })

      history.push(`/rooms/${firebaseRoom.key}`)

    } catch (error) {
      console.log(error)
      if (error instanceof Yup.ValidationError) {
        let objectValidate = {}
        objectValidate = yupErrorValidate(error)
        dispatch({ type: REQUEST_STATUS.REJECTED, payload: { validationErrors: objectValidate } })
      }
    }
  }
  return { isLoading, isError, validationErrors, handleCreateRoom }
}