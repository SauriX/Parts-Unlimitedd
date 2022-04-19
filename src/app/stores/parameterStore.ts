import { makeAutoObservable } from "mobx";
export default class ParameterStore {
    constructor() {
      makeAutoObservable(this);
    }
}