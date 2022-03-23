import { configure } from "mobx";
import { createContext, useContext } from "react";
import ProfileStore from "./profileStore";
import ReagentStore from "./reagentStore";
import UserStore from "./userStore";

configure({
  enforceActions: "never",
});

interface Store {
  profileStore: ProfileStore;
  userStore: UserStore;
  reagentStore: ReagentStore;
}

export const store: Store = {
  profileStore: new ProfileStore(),
  userStore: new UserStore(),
  reagentStore: new ReagentStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
