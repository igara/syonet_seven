import { WrapperComponent } from "@www/components/wrapper";
import { NextPageContext } from "next";
import { AppProps } from "next-redux-wrapper";
import { AppState } from "@www/stores";

type Props = AppState;

const NotFoundPageComponent = (props: Props) => {
  return <WrapperComponent {...props}>存在しないページです</WrapperComponent>;
};

NotFoundPageComponent.getInitialProps = async (context: NextPageContext & AppProps) => {
  try {
  } catch (error) {
    console.error(error);
  }
  return { ...context.store.getState() };
};

export default NotFoundPageComponent;
