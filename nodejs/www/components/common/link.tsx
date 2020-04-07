import Link, { LinkProps } from "next/link";
import { linkActions } from "@www/actions/common/link";
import { useDispatch } from "react-redux";

type Props = {
  children: React.ReactNode;
  OnClickHandler?: Function;
} & LinkProps;

export const LinkComponent = (props: Props) => {
  const dispatch = useDispatch();

  return (
    <Link href={props.href} as={props.as}>
      <a
        onClick={async event => {
          props.OnClickHandler ? props.OnClickHandler(event) : null;
          await dispatch(linkActions.onClickLink());
        }}
      >
        {props.children}
      </a>
    </Link>
  );
};
