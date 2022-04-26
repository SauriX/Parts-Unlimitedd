import { makeAutoObservable } from "mobx";
import Reagent from "../api/reagent";
import Catalog from "../api/catalog";
import { ICatalogDescriptionList, ICatalogNormalList } from "../models/catalog";
import { IOptions, IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class OptionStore {
  constructor() {
    makeAutoObservable(this);
  }

  departmentOptions: IOptions[] = [];

  getDepartmentOptions = async () => {
    try {
      const departments = await Catalog.getActive<ICatalogNormalList>(
        "department"
      );
      this.departmentOptions = departments.map((x) => ({
        value: x.id,
        label: x.clave,
      }));
    } catch (error) {
      this.departmentOptions = [];
    }
  };

  clinicOptions: IOptions[] = [];

  getClinicOptions = async () => {
    try {
      const clinics = await Catalog.getActive<ICatalogNormalList>("clinic");
      console.log(clinics);
      this.clinicOptions = clinics.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.clinicOptions = [];
    }
  };
  departamentOptions: IOptions[] = [];
  getdepartamentoOptions = async () => {
    try {
      const department = await Catalog.getActive<ICatalogNormalList>(
        "department"
      );
      console.log("el depa1");
      console.log(department);
      this.departamentOptions = department.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
      console.log("los depas mapeados");
      console.log(this.departamentOptions);
    } catch (error) {
      this.departamentOptions = [];
    }
  };

  areas:IOptions[]=[];
  getareaOptions = async (id:number) => {
    console.log(id);
    try {
      const department = await Catalog.getActive<ICatalogNormalList>(
        "area/departament/"+id
      );
      console.log("el depa1");
      console.log(department);
      this.areas = department.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
      console.log("los depas mapeados");
      console.log(this.departamentOptions);
    } catch (error) {
      this.areas = [];
    }
  };

  fieldOptions: IOptions[] = [];

  getfieldsOptions = async () => {
    try {
      const field = await Catalog.getActive<ICatalogNormalList>("field");
      console.log(field);
      this.fieldOptions = field.map((x) => ({ value: x.id, label: x.nombre }));
    } catch (error) {
      this.fieldOptions = [];
    }
  };

  bankOptions: IOptions[] = [];

  getbankOptions = async () => {
    try {
      const bank = await Catalog.getActive<ICatalogNormalList>("bank");
      console.log(bank);
      this.bankOptions = bank.map((x) => ({ value: x.id, label: x.nombre }));
    } catch (error) {
      this.bankOptions = [];
    }
  };

  cfdiOptions: IOptions[] = [];

  getcfdiOptions = async () => {
    try {
      const cfdi = await Catalog.getActive<ICatalogDescriptionList>(
        "useOfCFDI"
      );
      console.log(cfdi);
      this.cfdiOptions = cfdi.map((x) => ({ value: x.id, label: x.nombre }));
    } catch (error) {
      this.cfdiOptions = [];
    }
  };

  paymentMethodOptions: IOptions[] = [];

  getpaymentMethodOptions = async () => {
    try {
      const paymentMethod = await Catalog.getActive<ICatalogNormalList>(
        "paymentMethod"
      );
      console.log(paymentMethod);
      this.paymentMethodOptions = paymentMethod.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.paymentMethodOptions = [];
    }
  };

  paymentOptions: IOptions[] = [];

  getpaymentOptions = async () => {
    try {
      const payment = await Catalog.getActive<ICatalogNormalList>("payment");
      console.log(payment);
      this.paymentOptions = payment.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.paymentOptions = [];
    }
  };

  reagents:IOptions[]=[];
  getReagentOptions = async () => {
    try {
      const payment = await Reagent.getAll("all");
      console.log(payment);
      this.reagents = payment.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.reagents = [];
    }
  };
}
