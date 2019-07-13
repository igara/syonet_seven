import * as React from "react";

interface OwnProps {}

/**
 * Routing URL: //tools/
 */
export const ToolsPageComponent: React.SFC<OwnProps> = () => {
	return (
		<ul>
			<li>
				<a href="/games/ssb" target="_blank" rel="noopener">
					SUPER SUPER BROS.
				</a>
				<ul>
					<li>
						<a href="/tools/ssb" target="_blank" rel="noopener">
							チュートリアル
						</a>
					</li>
				</ul>
			</li>
		</ul>
	);
};
