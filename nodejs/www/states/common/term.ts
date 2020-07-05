import { reducerWithInitialState } from "typescript-fsa-reducers";
import { linkActions } from "@www/actions/common/link";
import { termActions } from "@www/actions/common/term";

export type TermState = {
  dispFlag: boolean;
  chengedDispFlag: boolean;
};

const initialState: TermState = {
  dispFlag: false,
  chengedDispFlag: false,
};

export const termReducer = reducerWithInitialState(initialState)
  /**
   * 利用規約を押下したときの処理
   */
  .case(termActions.onClickOpen, state => {
    return { ...state, dispFlag: true, chengedDispFlag: true };
  })
  /**
   * 閉じるを押下したときの処理
   */
  .case(termActions.onClickClose, state => {
    return { ...state, dispFlag: false, chengedDispFlag: true };
  })
  .case(linkActions.onClickLink, state => {
    return { ...state, dispFlag: false, chengedDispFlag: false };
  });
