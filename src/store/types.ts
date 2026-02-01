import { ThemeState } from './modules/theme';
import { ListsState } from './modules/lists';

export interface RootState {
  theme: ThemeState;
  lists: ListsState;
}
