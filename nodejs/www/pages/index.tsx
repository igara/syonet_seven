import Head from "next/head";
import { wrapper } from "@www/stores";
import { WrapperComponent } from "@www/components/wrapper";
import { authActions } from "@www/actions/common/auth";
import { db } from "@www/models/dexie/db";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { createOGPImage } from "@www/libs/ogp_image";
import { requestWebpush } from "@www/libs/apollo/gql/webpush";

const ogp = {
  title: "Syonetトップページ",
  path: "ogp/index",
};

type Props = {
  token: string;
};

const IndexPageComponent = (props: Props) => {
  const dispatch = useDispatch();
  const [loadCheckAuth] = useLazyQuery<CheckAuth>(CHECK_AUTH, {
    onCompleted: async checkAuth => {
      if (!checkAuth.checkAuth) {
        await db.access_tokens.clear();
      } else {
        await dispatch(authActions.checkAuth(checkAuth.checkAuth));
      }
    },
  });

  useEffect(() => {
    if (process.browser) {
      (async () => {
        await requestWebpush();

        if (props.token) {
          await db.access_tokens.clear();
          await db.access_tokens.put({
            token: props.token,
          });
        }

        await loadCheckAuth();
      })();
    }
  }, []);

  return (
    <>
      <Head>
        <title>{ogp.title}</title>
        <meta content="五十嵐翔の個人サイト" name="description"></meta>
        <meta property="og:title" content={ogp.title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${process.env.WWW_HOST}/${ogp.path}/${ogp.title}.png`} />
        <meta property="og:description" content="五十嵐翔の個人サイト" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <WrapperComponent>
        なんとなくdiscordはじめてみました。ChatOps的な何かとかやってます。ご自由にご参加ください。
        <iframe
          src="https://discordapp.com/widget?id=426647501643317252&theme=light&username=anonimas"
          width="100%"
          height={300}
          frameBorder={0}
        />
        またこのページはオフラインでも見れます。たまに左下の三表示からキャッシュを削除してご利用ください。
      </WrapperComponent>
    </>
  );
};

export default IndexPageComponent;

export const getServerSideProps = wrapper.getServerSideProps(async context => {
  const token = context.query.token;

  await createOGPImage({
    path: ogp.path,
    title: ogp.title,
  });

  return {
    props: {
      token: token || null,
    },
  };
});
