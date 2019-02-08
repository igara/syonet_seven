import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./admin";
import User from "./admin/user";

import { injectGlobal } from "styled-components";

injectGlobal`
  html {
    height: 100%;
    width: 100%;
		body {
			height: 100%;
	    width: 100%;
  	  font-size: 2vh;
			margin: 0;
		}
  }
`;

const Routes = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/manage" component={Home} />
				<Route exact path="/manage/user" component={User} />
			</Switch>
		</BrowserRouter>
	);
};

export default Routes;
