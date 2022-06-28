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
import BranchStore from "./brancStore";
import CompanyStore from "./companyStore";
import ParameterStore from "./parameterStore";
import MaquiladorStore from "./maquiladorStore";
import StudyStore from "./studyStore";
import PriceListStore from "./priceListStore";
import PackStore from "./packStore";
import PromotionStore from "./promotionStore";
import LoyaltyStore from "./loyaltyStore";
import ModalStore from "./modalStore";
import DrawerStore from "./drawerStore";
import RouteStore from "./routeStore";
import ProcedingStore from "./procedingStore";
import ReportStore from "./reportStore";
configure({
  enforceActions: "never",
});

interface Store {
  modalStore: ModalStore;
  drawerStore: DrawerStore;
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
  parameterStore: ParameterStore;
  maquiladorStore: MaquiladorStore;
  studyStore: StudyStore;
  priceListStore: PriceListStore;
  packStore: PackStore;
  promotionStore: PromotionStore;
  loyaltyStore: LoyaltyStore;
  routeStore: RouteStore;
  procedingStore: ProcedingStore;
  reportStore: ReportStore;
}

export const store: Store = {
  modalStore: new ModalStore(),
  drawerStore: new DrawerStore(),
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
  loyaltyStore: new LoyaltyStore(),
  routeStore: new RouteStore(),
  procedingStore: new ProcedingStore(),
  reportStore: new ReportStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
