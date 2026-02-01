import { ThemeState } from './modules/theme'
import { ListsState } from './modules/lists'
import { TodosState } from './modules/todos'

export interface RootState {
  theme: ThemeState
  lists: ListsState
  todos: TodosState
}
