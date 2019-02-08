import * as React from "react";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Routes } from "@F_syonet/containers/routes";
import { store, history } from "@F_syonet/stores/index";

import { checkLogin } from "@F_syonet/actions/common/login";

store.dispatch<any>(checkLogin.action());

export const component: React.SFC = () => {
	return (
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<Routes />
			</ConnectedRouter>
		</Provider>
	);
};

export default component;
