import { reducerWithInitialState } from "typescript-fsa-reducers";

export interface FooterState {}

const initialState: FooterState = {};

export const footerReducer = reducerWithInitialState(initialState);
