import * as React from "react";
import { getApiHost } from "@www/libs/api";
import { ButtonComponent as Button } from "@F_syonet/components/common/input/button";

interface OwnProps {}

/**
 * Routing URL: //login/
 */
export const LoginPageComponent: React.SFC<OwnProps> = (props: OwnProps) => {
	const host = getApiHost();
	return (
		<>
			ログイン画面です
			<Button>
				<a href={`${host}/auth/google`}>Google</a>
			</Button>
			<Button>
				<a href={`${host}/auth/facebook`}>facebook</a>
			</Button>
			<Button>
				<a href={`${host}/auth/twitter`}>twitter</a>
			</Button>
			<Button>
				<a href={`${host}/auth/github`}>github</a>
			</Button>
		</>
	);
};
