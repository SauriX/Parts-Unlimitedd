import { makeAutoObservable } from "mobx";
import Catalog from "../api/catalog";
import Role from "../api/role";
import { ICatalogNormalList } from "../models/catalog";
import { IOptions,  } from "../models/shared";
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
import Location from "../api/location";
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
        label: x.nombre, 
      }));
      return  departments.map((x) => ({
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
      return  departments.map((x) => ({
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
      this.clinicOptions = clinics.map((x) => ({ value: x.id, label: x.nombre }));
    } catch (error) {
      this.clinicOptions = [];
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
      let ruta =`area/department/${id}`
      if(id==0){
        ruta="area"
      }
      const area = await Catalog.getActive<ICatalogNormalList>(ruta);
      console.log("el depaAreas");
      console.log(area);
       var areas= area.map((x) => ({
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

  provenanceOptions: IOptions[] = [];

  getprovenanceOptions = async () => {
    try {
      const procedencia = await Catalog.getActive<ICatalogNormalList>("provenance");
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
      this.parameterOptions2 =[];
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

  priceListOptions:IOptions[]=[];

  getPriceListOptions = async () => {
    try{
      const priceListOptions =await PriceList.getActive();
      console.log(priceListOptions);
      this.priceListOptions= priceListOptions.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    }catch(error){
      this.priceListOptions=[]
    }
  };

  sucursales:IOptions[]=[];

  getSucursalesOptions = async () => {
    try{
      const priceListOptions1 =await branch.getAll("all");;
      console.log(priceListOptions1);
      this.sucursales= priceListOptions1.map((x) => ({
        value: x.idSucursal,
        label: x.nombre,
      }));
    }catch(error){
      this.sucursales=[]
    }
  };
  
  BranchOptions:IOptions[]=[];
  getBranchOptions=async()=>{
    try{
      const branch = Branch.getAll("");
      this.BranchOptions= (await branch).map((x)=>({
        value:x.idSucursal,
        label:x.nombre
      }));
    }catch(error){
      this.BranchOptions=[];
    }
  };

  DeliveryOptions:IOptions[]=[];
  getDeliveryOptions = async () => {
    try {
      const Delivery = await Catalog.getActive<ICatalogNormalList>(
        "Delivery"
      );
      console.log(Delivery);
      this.DeliveryOptions = Delivery.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    } catch (error) {
      this.DeliveryOptions = [];
    }
  };

  PromotionOptions:IOptions[]=[];

  getPromotionOptions = async () => {
    try{
      const PromotionOptions =await Promotion.getActive();
      console.log(PromotionOptions);
      this.PromotionOptions= PromotionOptions.map((x) => ({
        value: x.id,
        label: x.nombre,
      }));
    }catch(error){
      this.PromotionOptions=[]
    }
  };

  CompanyOptions:IOptions[]=[];

  getCompanyOptions = async () => {
    try{
      const CompanyOptions =await Company.getAll("");
      console.log(CompanyOptions);
      this.CompanyOptions= CompanyOptions.map((x) => ({
        value: x.id,
        label: x.nombreComercial,
      }));
    }catch(error){
      this.CompanyOptions=[]
    }
  };

  MedicOptions:IOptions[]=[];

  getMedicOptions = async () => {
    try{
      const MedicOptions =await Medics.getAll("");
      console.log(MedicOptions);
      this.MedicOptions= MedicOptions.map((x) => ({
        value: x.idMedico,
        label: x.nombre,
      }));
    }catch(error){
      this.MedicOptions=[]
    }
  };

  BranchCityOptions:IOptions[]=[];
  getBranchCityOptions=async()=>{
    try{
      const branch = Branch.getBranchByCity();
      this.BranchOptions= (await branch).map((x)=>({
        value:x.idSucursal,
        label:x.nombre
      }));
    }catch(error){
      this.BranchOptions=[];
    }
  };
  CityOptions:IOptions[]=[];
  getCityOptions=async()=>{
    try{
      const branch = Location.getCities();
      this.CityOptions= (await branch).map((x)=>({
        value:x.id,
        label:x.ciudad
      }));
    }catch(error){
      this.CityOptions=[];
    }
  };

}
