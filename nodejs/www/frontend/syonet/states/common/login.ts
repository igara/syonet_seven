import { reducerWithInitialState } from "typescript-fsa-reducers";
import { checkLogin, logout, Login } from "@F_syonet/actions/common/login";

export interface StoreData<T> {
	data: T;
	loading?: boolean;
	error?: any;
}

export interface LoginState {
	login: StoreData<Login>;
}

const initialState: LoginState = {
	login: { data: { status: 0, user: null }, loading: false }
};

export const loginReducer = reducerWithInitialState(initialState)
	.case(checkLogin.async.started, state => {
		return {
			...state,
			login: {
				...state.login,
				data: { status: 0, user: null },
				loading: true,
				error: null
			}
		};
	})
	.case(checkLogin.async.done, (state, payload) => {
		return {
			...state,
			login: {
				...state.login,
				data: payload.result,
				loading: false,
				error: null
			}
		};
	})
	.case(checkLogin.async.failed, (state, payload) => {
		return {
			...state,
			login: {
				...state.login,
				data: { status: 0, user: null },
				loading: false,
				error: payload.error
			}
		};
	})
	.case(logout.async.started, state => {
		return {
			...state,
			login: {
				...state.login,
				loading: true,
				error: null
			}
		};
	})
	.case(logout.async.done, state => {
		return {
			...state,
			login: {
				...state.login,
				data: { status: 0, user: null },
				loading: false,
				error: null
			}
		};
	})
	.case(logout.async.failed, (state, payload) => {
		return {
			...state,
			login: {
				...state.login,
				loading: false,
				error: payload.error
			}
		};
	});
