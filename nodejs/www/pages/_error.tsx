import { WrapperComponent } from "@www/components/wrapper";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { CHECK_AUTH, CheckAuth } from "@www/libs/apollo/gql/auth";
import { db } from "@www/models/dexie/db";
import { authActions } from "@www/actions/common/auth";

const NotFoundPageComponent = () => {
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
        await loadCheckAuth();
      })();
    }
  }, []);

  return <WrapperComponent>存在しないページです</WrapperComponent>;
};

export default NotFoundPageComponent;
