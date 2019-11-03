import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory();

export const termActions = {
  /**
   * 閉じるを押下したときの処理
   */
  onClickClose: actionCreator<boolean>("ACTIONS_TERM_ONCLICK_CLOSE"),
};
