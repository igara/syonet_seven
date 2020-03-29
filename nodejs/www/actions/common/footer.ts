import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory();

export const footerActions = {
  /**
   * LinkIconを押下したときの処理
   */
  onClickLinkIcon: actionCreator<boolean>("ACTIONS_FOOTER_ONCLICK_LINKICON"),
};
