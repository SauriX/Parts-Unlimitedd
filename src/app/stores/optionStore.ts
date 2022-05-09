import { makeAutoObservable } from "mobx";
import Company from "../../views/Company";
import Catalog from "../api/catalog";
import Role from "../api/role";
import { ICatalogNormalList } from "../models/catalog";
import { IOptions, IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";
import Parameter from "../api/parameter";
import Reagent from "../api/reagent";
import Maquilador from "../api/maquilador";
import Tapon from "../api/tapon";
import Indication from "../api/indication";

export default class OptionStore {
  constructor() {
    makeAutoObservable(this);
  }

  departmentOptions: IOptions[] = [];

  getDepartmentOptions = async () => {
    try {
      const departments = await Catalog.getActive<ICatalogNormalList>("department");
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
      this.clinicOptions = clinics.map((x) => ({ value: x.id, label: x.nombre }));
    } catch (error) {
      this.clinicOptions = [];
    }
  };
  departamentOptions: IOptions[] = [];
  getdepartamentoOptions = async () => {
    try {
      const department = await Catalog.getActive<ICatalogNormalList>("department");
      console.log("el depa1");
      console.log(department);
      this.departamentOptions = department.map((x) => ({ value: x.id, label: x.nombre }));
      console.log("los depas mapeados");
      console.log(this.departamentOptions);
    } catch (error) {
      this.departamentOptions = [];
    }
  };
  reagents: IOptions[] = [];
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

  areas: IOptions[] = [];
  getareaOptions = async (id?: number) => {
    console.log(id);
    try {
      const department = await Catalog.getActive<ICatalogNormalList>("area/department/" + id);
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

  printFormat: IOptions[] = [];
  getPrintFormatsOptions = async (id?: number) => {
    console.log(id);
    try {
      const department = await Catalog.getActive<ICatalogNormalList>("format");
      console.log("el depa1");
      console.log(department);
      this.printFormat = department.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
      console.log("los depas mapeados");
    } catch (error) {
      this.printFormat = [];
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
      const cfdi = await Catalog.getActive<ICatalogNormalList>("useOfCFDI");
      console.log(cfdi);
      this.cfdiOptions = cfdi.map((x) => ({ value: x.id, label: x.nombre }));
    } catch (error) {
      this.cfdiOptions = [];
    }
  };

  paymentMethodOptions: IOptions[] = [];

  getpaymentMethodOptions = async () => {
    try {
      const paymentMethod = await Catalog.getActive<ICatalogNormalList>("paymentMethod");
      console.log(paymentMethod);
      this.paymentMethodOptions = paymentMethod.map((x) => ({ value: x.id, label: x.nombre }));
    } catch (error) {
      this.paymentMethodOptions = [];
    }
  };

  paymentOptions: IOptions[] = [];

  getpaymentOptions = async () => {
    try {
      const payment = await Catalog.getActive<ICatalogNormalList>("payment");
      console.log(payment);
      this.paymentOptions = payment.map((x) => ({ value: x.id, label: x.nombre }));
    } catch (error) {
      this.paymentOptions = [];
    }
  };

  roleOptions: IOptions[] = [];

  getRoleOptions = async () => {
    try {
      const roles = await Role.getActive();
      this.roleOptions = roles.map((x) => ({ value: x.id, label: x.nombre }));
    } catch (error) {
      this.paymentOptions = [];
    }
  };

  parameterOptions: IOptions[] = [];

  getParameterOptions = async () => {
    try {
      const parameter = await Parameter.getAll("all");
      console.log("parameters");
      console.log(parameter);
      this.parameterOptions = parameter.map((x) => ({
        value: x.clave,
        label: x.nombre,
      }));
    } catch (error) {
      this.parameterOptions = [];
    }
  };
  MaquiladorOptions:IOptions[]=[];
  getMaquiladorOptions=async()=>{
    try{
      const maquilador = Maquilador.getAll("");
      this.MaquiladorOptions= (await maquilador).map((x)=>({
        value:x.id,
        label:x.nombre
      }));
    }catch(error){
      this.MaquiladorOptions=[];
    }
  };
  MethodOptions: IOptions[] = [];

  getMethodOptions = async () => {
    try {
      const Method = await Catalog.getActive<ICatalogNormalList>(
        "Method"
      );
      console.log(Method);
      this.MethodOptions = Method.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.MethodOptions = [];
    }
  };
  taponOption:IOptions[]=[];
  getTaponOption = async () =>{
    try {
      const tapon = await Tapon.getAll();
      this.taponOption = tapon.map((x) => ({
        value: x.id,
        label: x.name,
      }));
    } catch (error) {
      this.taponOption = [];
    }
  };
  indicationOptions:IOptions[] = [];
  getIndication = async () =>{
    try {
      const indication = await Indication.getAll("");
      console.log(indication);
      this.indicationOptions = indication.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.indicationOptions = [];
    }
  };

  workListOptions: IOptions[] = [];

  getworkListOptions = async () => {
    try {
      const workList = await Catalog.getActive<ICatalogNormalList>(
        "workList"
      );
      console.log(workList);
      this.workListOptions = workList.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.workListOptions = [];
    }
  };

  sampleTypeOptions: IOptions[] = [];

  getsampleTypeOptions = async () => {
    try {
      const sampleType = await Catalog.getActive<ICatalogNormalList>(
        "sampleType"
      );
      console.log(sampleType);
      this.sampleTypeOptions = sampleType.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.sampleTypeOptions = [];
    }
  };
}
