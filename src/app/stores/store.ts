import { configure } from "mobx";
import { createContext, useContext } from "react";
import ProfileStore from "./profileStore";
import ReagentStore from "./reagentStore";
import MedicstStore from "./medicsStore";
import UserStore from "./userStore";
import MedicsStore from "./medicsStore";
import IndicationStore from "./indicationStore";

configure({
  enforceActions: "never",
});

interface Store {
  profileStore: ProfileStore;
  userStore: UserStore;
  reagentStore: ReagentStore;
  medicsStore: MedicsStore;
  indicationStore:IndicationStore;
}

export const store: Store = {
  profileStore: new ProfileStore(),
  userStore: new UserStore(),
  reagentStore: new ReagentStore(),
  medicsStore: new MedicsStore(),
  indicationStore: new IndicationStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
