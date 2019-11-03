import { reducerWithInitialState } from "typescript-fsa-reducers";
import { sidebarActions } from "@www/actions/common/sidebar";
import { termActions } from "@www/actions/common/term";

export type TermState = {
  dispFlag: boolean;
};

const initialState: TermState = {
  dispFlag: false,
};

export const termReducer = reducerWithInitialState(initialState)
  /**
   * 利用規約を押下したときの処理
   */
  .case(sidebarActions.onClickTerm, state => {
    return { ...state, dispFlag: true };
  })
  /**
   * 閉じるを押下したときの処理
   */
  .case(termActions.onClickClose, state => {
    return { ...state, dispFlag: false };
  });