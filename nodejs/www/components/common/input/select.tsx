import { selectStyle } from "@www/styles";

type Props = {
  children: Array<React.ReactNode>;
  OnChangeHandler?: Function;
};

export const SelectComponent = (props: Props) => {
  return (
    <select
      className={selectStyle.select}
      onChange={event => (props.OnChangeHandler ? props.OnChangeHandler(event) : null)}
    >
      {props.children}
    </select>
  );
};
