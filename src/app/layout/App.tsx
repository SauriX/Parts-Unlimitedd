import { Route, Routes } from "react-router-dom";
import "../../App.less";
import ReagentDetail from "../../components/reagent/detail/ReagentDetail";
import MedicsDetail from "../../components/medics/detail/MedicsDetail";
import IndicationDetail from "../../components/indication/detail/IndicationDetail";
import UserDetail from "../../components/user/detail/UserDetail";
import UserForm from "../../components/user/detail/UserForm";
import NewUser from "../../components/user/detail/NewUser";
import Home from "../../views/Home";
import Reagent from "../../views/Reagent";
import Medics from "../../views/Medics";
import Role from "../../views/Role";
import User from "../../views/User";
import Login from "../../views/Login";
import messages from "../util/messages";
import ErrorComponent from "./ErrorComponent";
import LayoutComponent from "./LayoutComponent";
import PrivateRoute from "./PrivateRoute";
import Catalog from "../../views/Catalog";
import CatalogDetail from "../../components/catalog/detail/CatalogDetail";
import Indication from "../../views/Indications";
import NewRole from "../../components/role/detail/NewRole";
function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        <Route element={<LayoutComponent />}>
          <Route path="" element={<Home />} />
          <Route path="users" element={<User />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="new-user" element={<NewUser />} />
          <Route path="roles" element={<Role />} />
          <Route path="reagent" element={<Reagent />} />
          <Route path="reagent/:id" element={<ReagentDetail />} />
          <Route path="catalogs" element={<Catalog />} />
          <Route path="catalogs/:id" element={<CatalogDetail />} />
          <Route path="medics" element={<Medics />} />
          <Route path="medics/:id" element={<MedicsDetail />} />
          <Route path="indication" element={<Indication />} />
          <Route path="indication/:id" element={<IndicationDetail />} />
          <Route path="roles/new-role" element={<NewRole/>}/>
          <Route path="roles/:id" element={<NewRole/>}/>
          <Route path="forbidden" element={<ErrorComponent status={403} message={messages.forbidden} />} />
          <Route path="error" element={<ErrorComponent status={500} message={messages.serverError} />} />
          <Route path="*" element={<ErrorComponent status={404} message={messages.notFound} />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
