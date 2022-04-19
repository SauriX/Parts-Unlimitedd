import { configure } from "mobx";
import { createContext, useContext } from "react";
import ProfileStore from "./profileStore";
import ReagentStore from "./reagentStore";
import MedicsStore from "./medicsStore";
import UserStore from "./userStore";
import IndicationStore from "./indicationStore";
import CatalogStore from "./catalogStore";
import OptionStore from "./optionStore";
import RoleStore from "./roleStore";
import LocationStore from "./locationStore";
import BranchStore from "./brancStore"
import ParameterStore from "./brancStore"
configure({
  enforceActions: "never",
});

interface Store {
  profileStore: ProfileStore;
  optionStore: OptionStore;
  userStore: UserStore;
  reagentStore: ReagentStore;
  medicsStore: MedicsStore;
  indicationStore: IndicationStore;
  catalogStore: CatalogStore;
  roleStore: RoleStore;
  locationStore: LocationStore;
  branchStore: BranchStore;
  parameterStore:ParameterStore;
}

export const store: Store = {
  profileStore: new ProfileStore(),
  optionStore: new OptionStore(),
  userStore: new UserStore(),
  reagentStore: new ReagentStore(),
  medicsStore: new MedicsStore(),
  indicationStore: new IndicationStore(),
  catalogStore: new CatalogStore(),
  roleStore: new RoleStore(),
  locationStore: new LocationStore(),
  branchStore: new BranchStore(),
  parameterStore: new ParameterStore()
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
