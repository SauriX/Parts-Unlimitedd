import { Route, Routes } from "react-router-dom";
import "../../App.less";
import ReagentDetail from "../../components/reagent/detail/ReagentDetail";
import MedicsDetail from "../../components/medics/detail/MedicsDetail";
import UserDetail from "../../components/user/detail/UserDetail";
import UserForm from "../../components/user/detail/UserForm";
import Home from "../../views/Home";
import Reagent from "../../views/Reagent";
import Medics from "../../views/Medics";
import Role from "../../views/Role";
import User from "../../views/User";
import messages from "../util/messages";
import ErrorComponent from "./ErrorComponent";
import LayoutComponent from "./LayoutComponent";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="login" element={<div>Login</div>} />
      <Route element={<PrivateRoute />}>
        <Route element={<LayoutComponent />}>
          <Route path="" element={<Home />} />
          <Route path="users" element={<User />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="roles" element={<Role />} />
          <Route path="reagent" element={<Reagent />} />
          <Route path="reagent/:id" element={<ReagentDetail />} />
          <Route path="medics" element={<Medics />} />
          <Route path="medics/:id" element={<MedicsDetail />} />
          <Route path="forbidden" element={<ErrorComponent status={403} message={messages.forbidden} />} />
          <Route path="error" element={<ErrorComponent status={500} message={messages.serverError} />} />
          <Route path="*" element={<ErrorComponent status={404} message={messages.notFound} />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
