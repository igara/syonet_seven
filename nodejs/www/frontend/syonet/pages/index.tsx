import * as React from "react";

interface OwnProps {}

/**
 * Routing URL: //index/
 */
export const IndexPageComponent: React.SFC<OwnProps> = (props: OwnProps) => {
	return (
		<>
			なんとなくdiscordはじめてみました。ChatOps的な何かとかやってます。ご自由にご参加ください。
			<iframe
				src="https://discordapp.com/widget?id=426647501643317252&theme=light&username=anonimas"
				width="100%"
				height={300}
				frameBorder={0}
			/>
			またこのページはオフラインでも見れます。たまに左下の三表示からキャッシュを削除してご利用ください。
		</>
	);
};
