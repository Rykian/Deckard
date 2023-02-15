import { createStore, createTypedHooks } from 'easy-peasy'
import buttonStart, {
  Store as ButtonStartStore,
} from './screens/ServerDashboard/buttons/Start/store'

interface Store {
  buttons: {
    start: ButtonStartStore
  }
}

export default createStore({
  buttons: {
    start: buttonStart,
  },
})

const typedHooks = createTypedHooks<Store>()

export const useStoreActions = typedHooks.useStoreActions
export const useStoreDispatch = typedHooks.useStoreDispatch
export const useStoreState = typedHooks.useStoreState
