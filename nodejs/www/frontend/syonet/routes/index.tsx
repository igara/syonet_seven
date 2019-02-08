import * as React from 'react'
import { Route, Switch } from 'react-router-dom'
import { IndexPageComponent } from '@F_syonet/pages/index'
import { LoginPageComponent } from '@F_syonet/pages/login'
import { ToolsPageComponent } from '@F_syonet/pages/tools/index'
import { NotFoundPageComponent } from '@F_syonet/pages/not_found'

import { AppState } from '@F_syonet/stores/index'
import { RoutesActions } from '@F_syonet/containers/routes'
import { HeaderComponent } from '@F_syonet/components/common/header'
import { SidebarComponent } from '@F_syonet/components/common/sidebar'
import { FooterComponent } from '@F_syonet/components/common/footer'
import { TermComponent } from '@F_syonet/components/common/term'
import { ContentStyle } from '@F_syonet/styles'

interface OwnProps {}

type RoutesProps = OwnProps & AppState & RoutesActions

/**
 * ルーティング兼共通のレイアウトを扱う
 */
export const RoutesComponent: React.SFC<RoutesProps> = (props: RoutesProps) => {
	return (
		<>
			<HeaderComponent {...props} />
			<SidebarComponent {...props} />
			<TermComponent {...props} />
			<div className={ContentStyle.content_wrap_div}>
				<Switch>
					<Route exact path="/" component={IndexPageComponent} />
					<Route path="/login" component={LoginPageComponent} />
					<Route exact path="/tools" component={ToolsPageComponent} />
					<Route component={NotFoundPageComponent} />
				</Switch>
			</div>
			<FooterComponent {...props} />
		</>
	)
}

export default RoutesComponent
