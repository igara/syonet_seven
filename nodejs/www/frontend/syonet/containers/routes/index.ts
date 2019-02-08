import { Action } from "typescript-fsa";
import { connect } from "react-redux";
import { AppState } from "@F_syonet/stores";
import { footerActions } from "@F_syonet/actions/common/footer";
import { sidebarActions } from "@F_syonet/actions/common/sidebar";
import { termActions } from "@F_syonet/actions/common/term";
import { logout } from "@F_syonet/actions/common/login";
import { RoutesComponent } from "@F_syonet/routes";

export interface RoutesActions {
	Actions: {
		footer: {
			onClickLinkIcon: () => Action<boolean>;
		};
		sidebar: {
			onClickClose: () => Action<boolean>;
			onClickTerm: () => Action<boolean>;
			onClickHome: () => Action<boolean>;
			onClickLogin: () => Action<boolean>;
			onClickLogout: () => Action<any>;
			onClickTools: () => Action<boolean>;
			onClickCacheClear: () => Action<boolean>;
		};
		term: {
			onClickClose: () => Action<boolean>;
		};
	};
}

const mapDispatchToProps = dispatch => {
	return {
		Actions: {
			footer: {
				onClickLinkIcon: () => dispatch(footerActions.onClickLinkIcon(false))
			},
			sidebar: {
				onClickClose: () => dispatch(sidebarActions.onClickClose(false)),
				onClickTerm: () => dispatch(sidebarActions.onClickTerm(true)),
				onClickHome: () => dispatch(sidebarActions.onClickHome(false)),
				onClickLogin: () => dispatch(sidebarActions.onClickLogin(false)),
				onClickLogout: () => dispatch(logout.action()),
				onClickTools: () => dispatch(sidebarActions.onClickTools(false)),
				onClickCacheClear: () =>
					dispatch(sidebarActions.onClickCacheClear(false))
			},
			term: {
				onClickClose: () => dispatch(termActions.onClickClose(false))
			}
		}
	};
};

const mapStateToProps = (appState: AppState) => {
	return { ...appState };
};

export const Routes = connect(
	mapStateToProps,
	mapDispatchToProps
)(RoutesComponent);

export default Routes;
