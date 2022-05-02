import { Route, Routes } from "react-router-dom";
import "../../App.less";
import ReagentDetail from "../../components/reagent/detail/ReagentDetail";
import MedicsDetail from "../../components/medics/detail/MedicsDetail";
import IndicationDetail from "../../components/indication/detail/IndicationDetail";
import UserDetail from "../../components/user/detail/UserDetail";
import UserFormValues from "../../components/user/detail/UserForm";
import NewUser from "../../components/user/detail/NewUser";
import Home from "../../views/Home";
import Reagent from "../../views/Reagent";
import Medics from "../../views/Medics";
import Role from "../../views/Role";
import User from "../../views/User";
import Login from "../../views/Login";
import Branch from "../../views/Branch";
import messages from "../util/messages";
import ErrorComponent from "./ErrorComponent";
import LayoutComponent from "./LayoutComponent";
import PrivateRoute from "./PrivateRoute";
import Catalog from "../../views/Catalog";
import CatalogDetail from "../../components/catalog/detail/CatalogDetail";
import Indication from "../../views/Indications";
import NewRole from "../../components/role/detail/NewRole";
import RoleDetail from "../../components/role/detail/RoleDetail";
import BranchDetail from "../../components/branch/detail/BranchDetail";
import Company from "../../views/Company";
import CompanyDetail from "../../components/company/detail/CompanyDetail";
import Parameters from "../../views/Parameters";
import ParameterDetail from "../../components/parameter/detail/ParameterDetail";
import { useStore } from "../stores/store";
import { useCallback, useEffect, useState } from "react";
import { Spin } from "antd";
import { observer } from "mobx-react-lite";

function App() {
  const { profileStore } = useStore();
  const { token, getProfile, getMenu } = profileStore;

  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    await Promise.all([getMenu(), getProfile()]);
    setLoading(false);
  }, [getMenu, getProfile, setLoading]);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token, setLoading, loadUser]);

  if (loading)
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" spinning={loading} />
      </div>
    );

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
          <Route path="reagents" element={<Reagent />} />
          <Route path="reagents/new" element={<ReagentDetail />} />
          <Route path="reagents/:id" element={<ReagentDetail />} />
          <Route path="catalogs" element={<Catalog />} />
          <Route path="catalogs/:id" element={<CatalogDetail />} />
          <Route path="medics" element={<Medics />} />
          <Route path="medics/:id" element={<MedicsDetail />} />
          <Route path="companies" element={<Company />} />
          <Route path="companies/:id" element={<CompanyDetail />} />
          <Route path="indications" element={<Indication />} />
          <Route path="indications/:id" element={<IndicationDetail />} />
          <Route path="roles/new-role" element={<NewRole />} />
          <Route path="roles/:id" element={<RoleDetail />} />
          <Route path="branches" element={<Branch />} />
          <Route path="branches/new-sucursal" element={<BranchDetail />} />
          <Route path="branches/:id" element={<BranchDetail />} />
          <Route path="parameters" element={<Parameters />} />
          <Route path="parameters/new-parameter" element={<ParameterDetail />} />
          <Route path="parameters/:id" element={<ParameterDetail />} />
          <Route path="forbidden" element={<ErrorComponent status={403} message={messages.forbidden} />} />
          <Route path="error" element={<ErrorComponent status={500} message={messages.serverError} />} />
          <Route path="*" element={<ErrorComponent status={404} message={messages.notFound} />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default observer(App);
