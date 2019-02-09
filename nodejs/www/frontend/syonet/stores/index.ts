import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { RouterState, connectRouter } from "connected-react-router";
import { History, createBrowserHistory } from "history";
import thunk from "redux-thunk";
import { footerReducer, FooterState } from "@F_syonet/states/common/footer";
import { sidebarReducer, SidebarState } from "@F_syonet/states/common/sidebar";
import { termReducer, TermState } from "@F_syonet/states/common/term";
import { loginReducer, LoginState } from "@F_syonet/states/common/login";

export interface AppState {
	Footer: FooterState;
	Sidebar: SidebarState;
	Term: TermState;
	Login: LoginState;
	router: RouterState;
}

const createCompose =
	process.env.WWW_ENV === "production"
		? compose(applyMiddleware(thunk))
		: compose(
				applyMiddleware(thunk),
				(window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
					(window as any).__REDUX_DEVTOOLS_EXTENSION__()
		  );

export const rootReducer = (history: History) =>
	combineReducers<AppState>({
		Footer: footerReducer,
		Sidebar: sidebarReducer,
		Term: termReducer,
		Login: loginReducer,
		router: connectRouter(history)
	});
export const history = createBrowserHistory();
export const store = createStore(
	rootReducer(history),
	compose(
		applyMiddleware(thunk),
		createCompose
	)
);
export default store;
