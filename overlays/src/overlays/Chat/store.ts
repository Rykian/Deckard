import { action, Action, createStore, createTypedHooks } from 'easy-peasy'
import { Message } from '../../components/Chat'

const selectColor = (colorNum: number, colors: number) => {
  if (colors < 1) colors = 1 // defaults to one color - avoid divide by zero
  return 'hsl(' + ((colorNum * (360 / colors)) % 360) + ',100%,50%)'
}
const MAX_COLORS = 40

interface Model {
  messages: Message[]
  colors: Record<string, string>
}

const model: Model = { messages: [], colors: {} }
interface Actions {
  add: Action<Model, Message>
  delete: Action<Model, string>
}

const actions: Actions = {
  add: action((state, payload) => {
    state.messages.push(payload)
    if (!payload.info.username) return

    if (payload.info.color)
      state.colors[payload.info.username] = payload.info.color
    else if (!state.colors[payload.info.username])
      state.colors[payload.info.username] = selectColor(
        Math.floor(Math.random() * MAX_COLORS),
        MAX_COLORS,
      )
  }),
  delete: action((state, payload) => {
    state.messages = state.messages.filter(
      (message) => message.info.id != payload,
    )
  }),
}

interface Store extends Model, Actions {}

const store = createStore<Store>(
  {
    ...model,
    ...actions,
  },
  { name: 'ChatStore' },
)

export default store

export const { useStoreActions, useStoreState, useStoreDispatch, useStore } =
  createTypedHooks<Store>()
