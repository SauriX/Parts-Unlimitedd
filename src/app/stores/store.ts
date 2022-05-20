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
import CompanyStore from "./companyStore";
import ParameterStore from "./parameterStore"
import MaquiladorStore from "./maquiladorStore";
import StudyStore from "./studyStore";
import PriceListStore from "./priceListStore";
import PackStore from "./packStore";
import PromotionStore from "./promotionStore";
configure({
  enforceActions: "never",
});

interface Store {
  profileStore: ProfileStore;
  optionStore: OptionStore;
  userStore: UserStore;
  reagentStore: ReagentStore;
  medicsStore: MedicsStore;
  companyStore: CompanyStore;
  indicationStore: IndicationStore;
  catalogStore: CatalogStore;
  roleStore: RoleStore;
  locationStore: LocationStore;
  branchStore: BranchStore;
  parameterStore:ParameterStore; 
  maquiladorStore: MaquiladorStore;
  studyStore:StudyStore;
  priceListStore:PriceListStore;
  packStore:PackStore;
  promotionStore:PromotionStore;
}

export const store: Store = {
  profileStore: new ProfileStore(),
  optionStore: new OptionStore(),
  userStore: new UserStore(),
  reagentStore: new ReagentStore(),
  medicsStore: new MedicsStore(),
  companyStore: new CompanyStore(),
  indicationStore: new IndicationStore(),
  catalogStore: new CatalogStore(),
  roleStore: new RoleStore(),
  locationStore: new LocationStore(),
  branchStore: new BranchStore(),
  parameterStore: new ParameterStore(),
  maquiladorStore: new MaquiladorStore(),
  studyStore: new StudyStore(),
  priceListStore: new PriceListStore(),
  packStore: new PackStore(),
  promotionStore: new PromotionStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
