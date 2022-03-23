import { observer } from "mobx-react-lite";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../stores/store";
import messages from "../util/messages";

const PrivateRoute = () => {
  const { profileStore } = useStore();
  const { isLoggedIn } = profileStore;
  let location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location, message: messages.login }} />;
  }

  return <Outlet />;
};

export default observer(PrivateRoute);
