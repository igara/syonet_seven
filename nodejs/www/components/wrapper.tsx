import { HeaderComponent } from "@www/components/common/header";
import { SidebarComponent } from "@www/components/common/sidebar";
import { FooterComponent } from "@www/components/common/footer";
import { TermComponent } from "@www/components/common/term";
import { contentStyle } from "@www/styles";
import { AppState } from "@www/stores";

export type Props = AppState & {
  children: React.ReactNode;
};

export const WrapperComponent = (props: Props) => {
  return (
    <>
      <HeaderComponent {...props} />
      <SidebarComponent {...props} />
      <TermComponent />
      <div className={contentStyle.content_wrap_div}>{props.children}</div>
      <FooterComponent />
    </>
  );
};