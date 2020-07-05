import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory();

export const termActions = {
  onClickOpen: actionCreator<void>("ACTIONS_TERM_ONCLICK_OPEN"),
  /**
   * 閉じるを押下したときの処理
   */
  onClickClose: actionCreator<void>("ACTIONS_TERM_ONCLICK_CLOSE"),
};
