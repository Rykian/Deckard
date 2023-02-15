import { action, Action, Computed, computed } from 'easy-peasy'

interface Model {
  checklist: Record<string, boolean>
}

const model: Model = {
  checklist: {
    'Check sound sources': false,
    'Check video sources': false,
    'Check webcam display': false,
  },
}

interface Actions {
  toggle: Action<Model, string>
}

const actions: Actions = {
  toggle: action((store, title) => {
    store.checklist[title] = !store.checklist[title]
  }),
}

interface Computeds {
  allChecked: Computed<Model, boolean | undefined>
}

const computeds: Computeds = {
  allChecked: computed((state) =>
    Object.values(state.checklist).every((v) => !!v),
  ),
}

export interface Store extends Model, Actions, Computeds {}

const store: Store = {
  ...model,
  ...actions,
  ...computeds,
}

export default store
