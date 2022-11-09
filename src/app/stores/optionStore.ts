import { makeAutoObservable } from "mobx";
import Catalog from "../api/catalog";
import Role from "../api/role";
import {
  ICatalogAreaList,
  ICatalogDescriptionList,
  ICatalogNormalList,
} from "../models/catalog";
import { IOptions } from "../models/shared";
import Parameter from "../api/parameter";
import Reagent from "../api/reagent";
import Maquilador from "../api/maquilador";
import Tapon from "../api/tapon";
import Indication from "../api/indication";
import PriceList from "../api/priceList";
import branch from "../api/branch";
import Company from "../api/company";
import Medics from "../api/medics";
import Branch from "../api/branch";
import Promotion from "../api/promotion";
import Study from "../api/study";
import Pack from "../api/pack";
import Location from "../api/location";
import { IWorkList } from "../models/workList";

export const originOptions = [
  { label: "COMPAÑIÍA", value: 1 },
  { label: "PARTICULAR", value: 2 },
];

export const urgencyOptions = [
  { label: "Normal", value: 1 },
  { label: "Urgencia", value: 2 },
  { label: "Urgencia con cargo", value: 3 },
];

export const requestedStudyOptions = [
  { label: "Toma de Muestra", value: 2 },
  { label: "Solicitado", value: 3 },
];

export const studyStatusOptions = [
  { label: "Pendiente", value: 1 },
  { label: "Toma de muestra", value: 2 },
  { label: "Solicitado", value: 3 },
  { label: "Capturado", value: 4 },
  { label: "Validado", value: 5 },
  { label: "Liberado", value: 6 },
  { label: "Enviado", value: 7 },
  { label: "En ruta", value: 8 },
  { label: "Cancelado", value: 9 },
  { label: "Entregado", value: 10 },
];

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
        label: x.nombre,
      }));
      return departments.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.departmentOptions = [];
    }
  };
  UnitOptions: IOptions[] = [];

  getUnitOptions = async () => {
    try {
      const departments = await Catalog.getActive<ICatalogNormalList>("units");
      this.UnitOptions = departments.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
      return departments.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.UnitOptions = [];
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
  reagents: IOptions[] = [];
  getReagentOptions = async () => {
    try {
      const reagent = await Reagent.getAll("all");
      console.log(reagent);
      this.reagents = reagent.map((x) => ({
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
      let ruta = `area/department/${id}`;
      if (id == 0) {
        ruta = "area";
      }
      const area = await Catalog.getActive<ICatalogNormalList>(ruta);
      console.log("el depaAreas");
      console.log(area);
      var areas = area.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
      this.areas = areas;
      return areas;
    } catch (error) {
      this.areas = [];
    }
  };

  printFormat: IOptions[] = [];
  getPrintFormatsOptions = async (id?: number) => {
    console.log(id);
    try {
      const department = await Catalog.getActive<ICatalogNormalList>("format");
      console.log("el depa optionStore");
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

  getPaymentOptions = async () => {
    try {
      const payment = await Catalog.getActive<ICatalogDescriptionList>(
        "payment"
      );
      console.log(payment);
      this.paymentOptions = payment.map((x) => ({
        value: x.id,
        label: x.clave + " " + x.descripcion,
      }));
    } catch (error) {
      this.paymentOptions = [];
    }
  };

  provenanceOptions: IOptions[] = [];

  getprovenanceOptions = async () => {
    try {
      const procedencia = await Catalog.getActive<ICatalogNormalList>(
        "provenance"
      );
      console.log(procedencia);
      this.provenanceOptions = procedencia.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.provenanceOptions = [];
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
  parameterOptions2: IOptions[] = [];
  getParameterOptions = async () => {
    try {
      const parameter = await Parameter.getAll("all");
      console.log("parameters");
      console.log(parameter);
      this.parameterOptions = parameter.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));

      this.parameterOptions2 = parameter.map((x) => ({
        value: x.clave,
        label: x.nombre,
      }));
    } catch (error) {
      this.parameterOptions = [];
      this.parameterOptions2 = [];
    }
  };
  MaquiladorOptions: IOptions[] = [];
  getMaquiladorOptions = async () => {
    try {
      const maquilador = Maquilador.getAll("");
      this.MaquiladorOptions = (await maquilador).map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.MaquiladorOptions = [];
    }
  };

  MethodOptions: IOptions[] = [];

  getMethodOptions = async () => {
    try {
      const Method = await Catalog.getActive<ICatalogNormalList>("Method");
      console.log(Method);
      this.MethodOptions = Method.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.MethodOptions = [];
    }
  };

  taponOption: IOptions[] = [];
  getTaponOption = async () => {
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
  indicationOptions: IOptions[] = [];
  getIndication = async () => {
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
      const workList = await Catalog.getActive<ICatalogNormalList>("workList");
      console.log(workList);
      this.workListOptions = workList.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.workListOptions = [];
    }
  };
  workListOptions2: IWorkList[] = [];

  getworkListOptions2 = async () => {
    try {
      const workList = await Catalog.getActive<ICatalogNormalList>("workList");
      console.log(workList);
      this.workListOptions2 = workList.map((x) => ({
        id: x.id,
        nombre: x.nombre,
        clave:x.clave,
        activo:x.activo
      }));
    } catch (error) {
      this.workListOptions2 = [];
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

  priceListOptions: IOptions[] = [];

  getPriceListOptions = async () => {
    try {
      const priceListOptions = await PriceList.getActive();
      console.log(priceListOptions);
      this.priceListOptions = priceListOptions.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.priceListOptions = [];
    }
  };

  sucursales: IOptions[] = [];
  sucursalesClave: any = [];

  getSucursalesOptions = async () => {
    try {
      const priceListOptions1 = await branch.getAll("all");
      console.log(priceListOptions1);
      this.sucursales = priceListOptions1.map((x) => ({
        value: x.idSucursal,
        label: x.nombre,
      }));
      this.sucursalesClave = priceListOptions1.map((x) => ({
        value: x.idSucursal,
        clave: x.clave,
      }));
    } catch (error) {
      this.sucursales = [];
    }
  };

  BranchOptions: IOptions[] = [];
  cityOptions:IOptions[]=[];
  getBranchOptions = async () => {
    try {
      const branch = Branch.getAll("");
      this.BranchOptions = (await branch).map((x) => ({
        value: x.idSucursal,
        label: x.nombre,
      }));
      this.cityOptions=  (await branch).map((x)=>({
        value:x.ciudad, 
        label:x.ciudad
      }));
    } catch (error) {
      this.BranchOptions = [];
      this.cityOptions = [];
    }
  };

  DeliveryOptions: IOptions[] = [];
  getDeliveryOptions = async () => {
    try {
      const Delivery = await Catalog.getActive<ICatalogNormalList>("Delivery");
      console.log(Delivery);
      this.DeliveryOptions = Delivery.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.DeliveryOptions = [];
    }
  };

  promotionOptions: IOptions[] = [];

  getPromotionOptions = async () => {
    try {
      const promotionOptions = await Promotion.getActive();
      this.promotionOptions = promotionOptions.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.promotionOptions = [];
    }
  };

  studyOptions: IOptions[] = [];

  getStudyOptions = async () => {
    try {
      const studyOptions = await Study.getActive();
      this.studyOptions = studyOptions.map((x) => ({
        key: "study-" + x.id,
        value: "study-" + x.id,
        label: x.clave + " - " + x.nombre,
        group: "study",
      }));
    } catch (error) {
      this.studyOptions = [];
    }
  };
  studyOptionscita: IOptions[] = [];

  getStudyOptionscita = async (area: string) => {
    try {
      const studyOptions = await Study.getActive();
      console.log(studyOptions, "studis");
      var studyOptionsf = studyOptions.filter((x) =>
        x.departamento.includes(area)
      );
      console.log(studyOptionsf, "filter");
      var test = studyOptionsf.map((x) => ({
        key: "study-" + x.id,
        value: "study-" + x.id,
        label: x.clave + " - " + x.nombre,
        group: "study",
      }));
      this.packOptionscita = test;
      console.log(test, "final");
    } catch (error) {
      this.studyOptionscita = [];
    }
  };
  packOptions: IOptions[] = [];

  getPackOptions = async () => {
    try {
      const packOptions = await Pack.getActive();
      this.packOptions = packOptions.map((x) => ({
        key: "pack-" + x.id,
        value: "pack-" + x.id,
        label: x.clave + " - " + x.nombre,
        group: "pack",
      }));
    } catch (error) {
      this.packOptions = [];
    }
  };
  packOptionscita: IOptions[] = [];

  getPackOptionscita = async (area: string) => {
    try {
      const packOptions = await Pack.getActive();
      var packOptionsf = packOptions.filter((x) => x.departamento == area);
      this.packOptionscita = packOptionsf.map((x) => ({
        key: "pack-" + x.id,
        value: "pack-" + x.id,
        label: x.clave + " - " + x.nombre,
        group: "pack",
      }));
    } catch (error) {
      this.packOptionscita = [];
    }
  };
  CompanyOptions: IOptions[] = [];
  companyOptions: IOptions[] = [];

  getCompanyOptions = async () => {
    try {
      const CompanyOptions = await Company.getActive();
      console.log(CompanyOptions);
      this.companyOptions = CompanyOptions.map((x) => ({
        value: x.id,
        label: x.nombreComercial,
        group: x.procedenciaId,
      }));
    } catch (error) {
      this.companyOptions = [];
    }
  };

  medicOptions: IOptions[] = [];

  getMedicOptions = async () => {
    try {
      const MedicOptions = await Medics.getActive();
      this.medicOptions = MedicOptions.map((x) => ({
        value: x.idMedico,
        label: x.nombreCompleto,
      }));
    } catch (error) {
      this.medicOptions = [];
    }
  };

  branchCityOptions: IOptions[] = [];
  getBranchCityOptions = async () => {
    try {
      const branch = Branch.getBranchByCity();
      this.branchCityOptions = (await branch).map((x) => ({
        value: x.ciudad,
        label: x.ciudad,
        disabled: true,
        options: x.sucursales.map((y) => ({
          value: y.idSucursal,
          label: y.nombre,
        })),
      }));
    } catch (error) {
      this.branchCityOptions = [];
    }
  };

  studiesOptions: any[] = [];
  getStudiesOptions = async () => {
    try {
      const study = await Study.getActive();
      this.studiesOptions = study.map((x) => ({
        key: x.id,
        value: x.id,
        label: x.clave + " - " + x.nombre,
        area: x.areaId,
      }));
    } catch (error) {
      this.studiesOptions = [];
    }
  };

  departmentAreaOptions: IOptions[] = [];
  getDepartmentAreaOptions = async () => {
    try {
      const areas = await Catalog.getActive<ICatalogAreaList>("area");
      let groupby = areas.reduce((group: any, area) => {
        const { departamento } = area;
        group[departamento] = group[departamento] ?? [];
        group[departamento].push(area);
        return group;
      }, {});

      this.departmentAreaOptions = Object.keys(groupby).map((x) => ({
        value: x,
        label: x,
        disabled: true,
        options: groupby[x].map((a: ICatalogAreaList) => ({
          value: a.id,
          label: a.nombre,
        })),
      }));
    } catch (error) {
      this.departmentAreaOptions = [];
    }
  };

  CityOptions: IOptions[] = [];
  getCityOptions = async () => {
    try {
      const branch = Location.getCities();
      this.CityOptions = (await branch).map((x) => ({
        value: x.id,
        label: x.ciudad,
      }));
    } catch (error) {
      this.CityOptions = [];
    }
  };

  typeValue: IOptions[] = [];
  getTypeValues = async (id: string, tipo: string) => {
    try{
      const type = Parameter.getAllValues(id, tipo);
      this.typeValue = (await type).map((x) => ({
        value: x.id!,
        label: x.descripcionTexto as string,
      }))
    } catch(error) {
      this.typeValue = [];
    }
  }
}
