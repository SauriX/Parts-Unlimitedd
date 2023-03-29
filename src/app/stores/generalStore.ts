import { makeAutoObservable } from "mobx";
import { IGeneralForm } from "../models/general";
import { GeneralFormValues } from "../models/general";

export default class GeneralStore {
    constructor() {
        makeAutoObservable(this);
    }

    generalFilter: IGeneralForm = new GeneralFormValues();

    setGeneralFilter = (generalFilter: IGeneralForm) => {
        this.generalFilter = generalFilter;
    }
}