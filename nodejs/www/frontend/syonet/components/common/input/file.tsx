import * as React from 'react'
import { ButtonStyle } from '@F_syonet/styles'

interface OwnProps {
	Key: string
	OnInputHandler: any
	Multiple?: boolean
	Accept: string
}

/**
 * ファイル入力を表示するコンポーネント
 */
export const FileComponent: React.SFC<OwnProps> = (props: OwnProps) => {
	return (
		<button className={ButtonStyle.button}>
			<label htmlFor={`file_${props.Key}`}>
				＋写真を選択
				{props.Multiple === true ? (
					<input
						type="file"
						onChange={props.OnInputHandler}
						multiple
						style={{ display: 'none' }}
						id={`file_${props.Key}`}
						accept={props.Accept}
					/>
				) : (
					<input
						type="file"
						onChange={props.OnInputHandler}
						style={{ display: 'none' }}
						id={`file_${props.Key}`}
						accept={props.Accept}
					/>
				)}
			</label>
		</button>
	)
}
