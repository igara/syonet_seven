import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory();

export const linkActions = {
  onClickLink: actionCreator<void>("ACTIONS_LINK_ONCLICK_LINK"),
};
