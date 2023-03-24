import { makeAutoObservable, reaction } from "mobx";
import PriceList from "../api/priceList";
import Proceding from "../api/proceding";
import Quotation from "../api/quotation";
import { IPriceListInfoFilter } from "../models/priceList";
import { ISearchMedical } from "../models/Proceeding";
import {
  IQuotation,
  IQuotationFilter,
  IQuotationGeneral,
  IQuotationInfo,
  IQuotationPack,
  IQuotationStudy,
  IQuotationStudyUpdate,
  IQuotationTotal,
  QuotationFilterForm,
  QuotationStudyUpdate,
  QuotationTotal,
} from "../models/quotation";
import alerts from "../util/alerts";
import { status } from "../util/catalogs";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import views from "../util/view";

export default class QuotationStore {
  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.studies.slice(),
      (studies) => {
        this.calculateTotals();
      }
    );

    reaction(
      () => this.packs.slice(),
      (packs) => {
        this.calculateTotals();
      }
    );
  }

  filter: IQuotationFilter = new QuotationFilterForm();
  studyFilter: IPriceListInfoFilter = {};
  quotations: IQuotationInfo[] = [];
  quotation?: IQuotation;
  totals: IQuotationTotal = new QuotationTotal();
  studies: IQuotationStudy[] = [];
  packs: IQuotationPack[] = [];
  loadingQuotations: boolean = false;
  loadingTabContentCount: number = 0;
  readonly: boolean = false;

  get loadingTabContent() {
    return this.loadingTabContentCount > 0;
  }

  get studyUpdate() {
    if (this.quotation) {
      const data: IQuotationStudyUpdate = {
        cotizacionId: this.quotation.cotizacionId,
        expedienteId: this.quotation.expedienteId,
        paquetes: this.packs,
        estudios: this.studies,
        total: {
          ...this.totals,
          cotizacionId: this.quotation.cotizacionId,
          expedienteId: this.quotation.expedienteId,
        },
      };
      return data;
    }
    return new QuotationStudyUpdate();
  }

  get allStudies() {
    const packStudies = this.packs
      .flatMap((x) => x.estudios)
      .map((x) => {
        x.type = "pack";
        return x;
      });
    const studies = this.studies.map((x) => {
      x.type = "study";
      return x;
    });

    return [...studies, ...packStudies];
  }

  clearDetailData = () => {
    this.quotation = undefined;
    this.studies = [];
    this.packs = [];
    this.totals = new QuotationTotal();
  };

  isPack(obj: IQuotationStudy | IQuotationPack): obj is IQuotationPack {
    return obj.type === "pack";
  }

  isStudy(obj: IQuotationStudy | IQuotationPack): obj is IQuotationStudy {
    return obj.type === "study";
  }

  setFilter = (filter: IQuotationFilter) => {
    this.filter = { ...filter };
  };

  setStudyFilter = (
    branchId?: string,
    doctorId?: string,
    companyId?: string
  ) => {
    this.studyFilter = {
      sucursalId: branchId,
      medicoId: doctorId,
      compañiaId: companyId,
    };
  };

  setStudy = (study: IQuotationStudy) => {
    const index = this.studies.findIndex((x) => x.id === study.id);

    if (index > -1) {
      this.studies[index] = study;
    }

    this.packs = this.packs.map((x) => {
      const index = x.estudios.findIndex((x) => x.id === study.id);
      if (index > -1) {
        x.estudios[index] = study;
      }
      return x;
    });
  };

  setPack = (pack: IQuotationPack) => {
    const index = this.packs.findIndex((x) => x.id === pack.id);

    if (index > -1) {
      this.packs[index] = pack;
    }
  };

  getById = async (quotationId: string) => {
    try {
      const quotation = await Quotation.getById(quotationId);
      this.quotation = quotation;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/notFound");
    }
  };

  getQuotations = async (filter: IQuotationFilter) => {
    try {
      this.loadingQuotations = true;
      const quotations = await Quotation.getQuotations(filter);
      this.quotations = quotations;
      return quotations;
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingQuotations = false;
    }
  };

  getGeneral = async (quotationId: string) => {
    try {
      this.loadingTabContentCount++;
      const quotation = await Quotation.getGeneral(quotationId);
      quotation.metodoEnvio = [];
      if (quotation.correo) {
        quotation.metodoEnvio.push("correo");
        quotation.correos = quotation.correo.split(",");
      }
      if (quotation.whatsapp) {
        quotation.metodoEnvio.push("whatsapp");
        quotation.whatsapps = quotation.whatsapp.split(",");
      }
      if (quotation.metodoEnvio.length === 2)
        quotation.metodoEnvio.push("ambos");
      return quotation;
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingTabContentCount--;
    }
  };

  getStudies = async (quotationId: string) => {
    try {
      this.loadingTabContentCount++;
      const data = await Quotation.getStudies(quotationId);
      if (data.paquetes && data.paquetes.length > 0) {
        this.packs = data.paquetes;
      }
      this.studies = data.estudios;
      this.totals = data.total ?? new QuotationTotal();
      this.calculateTotals();
      return data;
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
    } finally {
      this.loadingTabContentCount--;
    }
  };

  getPriceStudy = async (studyId: number, filter: IPriceListInfoFilter) => {
    try {
      filter.estudioId = studyId;
      const price = await PriceList.getPriceStudy(filter);

      const study: IQuotationStudy = {
        ...price,
        type: "study",
        aplicaCargo: false,
      };

      const repeated = this.studies.filter(function (item) {
        return (
          item.parametros
            .map((x) => x.id)
            .filter((x) => study.parametros.map((y) => y.id).indexOf(x) !== -1)
            .length > 0
        );
      });

      if (repeated && repeated.length > 0) {
        alerts.confirm(
          "Coincidencias en estudios",
          "Se encuentran coincidencias en parámetros de solicitud, en estudios: " +
            repeated.map((x) => x.clave).join(", "),
          async () => {
            this.studies.push(study);
          }
        );
      } else {
        this.studies.push(study);
      }

      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  getPricePack = async (packId: number, filter: IPriceListInfoFilter) => {
    try {
      filter.paqueteId = packId;
      const price = await PriceList.getPricePack(filter);

      const pack: IQuotationPack = {
        ...price,
        type: "pack",
        aplicaCargo: false,
        estudios: price.estudios.map((x) => ({
          ...x,
          type: "study",
          aplicaCargo: false,
        })),
      };

      this.packs.push(pack);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  getRecords = async (filter: ISearchMedical) => {
    try {
      const records = await Proceding.getNow(filter);
      return records;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return [];
    }
  };

  sendTestEmail = async (quotationId: string, email: string[]) => {
    try {
      this.loadingTabContentCount++;
      await Quotation.sendTestEmail(quotationId, email);
      alerts.info("El correo se está enviando");
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingTabContentCount--;
    }
  };

  sendTestWhatsapp = async (quotationId: string, phone: string[]) => {
    try {
      this.loadingTabContentCount++;
      await Quotation.sendTestWhatsapp(quotationId, phone);
      alerts.info("El whatsapp se está enviando");
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingTabContentCount--;
    }
  };

  create = async (quotation: IQuotation) => {
    try {
      const id = await Quotation.create(quotation);
      return id;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  convertToRequest = async (quotationId: string) => {
    try {
      const id = await Quotation.convertToRequest(quotationId);
      return id;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  updateGeneral = async (quotation: IQuotationGeneral, autoSave: boolean) => {
    try {
      if (!autoSave) this.loadingTabContentCount++;
      await Quotation.updateGeneral(quotation);
      if (!autoSave) alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
      if (!autoSave) this.loadingTabContentCount--;
    }
  };

  assignRecord = async (
    quotationId: string,
    autoSave: boolean,
    recordId?: string
  ) => {
    try {
      if (!autoSave) this.loadingTabContentCount++;
      await Quotation.assignRecord(quotationId, recordId);
      if (!autoSave) alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
      if (!autoSave) this.loadingTabContentCount--;
    }
  };

  updateTotals = async (quotation: IQuotationTotal) => {
    try {
      await Quotation.updateTotals(quotation);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  updateStudies = async (
    quotation: IQuotationStudyUpdate,
    autoSave: boolean
  ) => {
    try {
      if (!autoSave) this.loadingTabContentCount++;
      const response = await Quotation.updateStudies(quotation);
      this.packs = response.paquetes ?? [];
      this.studies = response.estudios;
      if (!autoSave) alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
      if (!autoSave) this.loadingTabContentCount--;
    }
  };

  changeStudyPromotion = (study: IQuotationStudy, promoId?: number) => {
    const index = this.studies.findIndex(
      (x) => x.id === study.id && x.identificador === study.identificador
    );
    if (index > -1) {
      const _study = { ...this.studies[index] };
      const promo = this.studies[index].promociones.find(
        (x) => x.promocionId === promoId
      );
      this.studies[index] = {
        ..._study,
        promocionId: promoId,
        promocion: promo?.promocion,
        descuento: promo?.descuento,
        descuentoPorcentaje: promo?.descuentoPorcentaje,
        precioFinal: _study.precio - (promo?.descuento ?? 0),
      };
      this.calculateTotals();
    }
  };

  changePackPromotion = (pack: IQuotationPack, promoId?: number) => {
    const index = this.packs.findIndex(
      (x) => x.id === pack.id && x.identificador === pack.identificador
    );
    if (index > -1) {
      const promo = this.packs[index].promociones.find(
        (x) => x.promocionId === promoId
      );
      this.packs[index] = {
        ...this.packs[index],
        promocionId: promoId,
        promocion: promo?.promocion,
        promocionDescuento: promo?.descuento,
        promocionDescuentoPorcentaje: promo?.descuentoPorcentaje,
      };
      this.calculateTotals();
    }
  };

  deleteStudy = async (id: string) => {
    this.studies = this.studies.filter((x) => x.identificador !== id);
  };

  deletePack = async (id: number | string) => {
    this.packs = this.packs.filter((x) => x.identificador !== id);
  };

  cancelQuotation = async (quotationId: string) => {
    try {
      await Quotation.cancelQuotation(quotationId);
      if (this.quotation) {
        this.quotation.estatusId = status.quotation.cancelado;
        this.quotation.activo = false;
      }
      history.push(`/${views.quotation}`);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  deleteCurrentQuotation = async () => {
    try {
      if (this.quotation?.cotizacionId) {
        await Quotation.deleteQuotation(this.quotation.cotizacionId);
        this.quotations = this.quotations.filter(
          (x) => x.cotizacionId !== this.quotation?.cotizacionId
        );
        return true;
      }
      alerts.warning("No hay cotización por eliminar");
      return false;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  deleteStudies = async (quotation: IQuotationStudyUpdate) => {
    try {
      await Quotation.deleteStudies(quotation);
      alerts.success(messages.updated);

      this.studies = this.studies.filter((x) => {
        const exists = quotation.estudios.find(
          (s) => s.id === x.id && s.identificador === x.identificador
        );
        if (exists) return false;
        return true;
      });

      this.packs = this.packs.filter((x) => {
        const exists = quotation.paquetes?.find(
          (s) => s.id === x.id && s.identificador === x.identificador
        );
        if (exists) return false;
        return true;
      });

      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  getQuotationPdf = async (id: string) => {
    try {
      const url = await Quotation.getQuotePdfUrl(id);
      return url;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  // prettier-ignore
  private calculateTotals = () => {
    const studies = this.studies;
    const packs = this.packs;

    const studyAndPack = studies.map((x) => ({ descuento: x.descuento ?? 0, precio: x.precio, precioFinal: x.precioFinal }))
      .concat(packs.map((x) => ({ descuento: x.descuento, precio: x.precio, precioFinal: x.precioFinal }))); 
    
    const totalStudies = studyAndPack.reduce((acc, obj) => acc + obj.precio, 0);
    
    const discount = totalStudies === 0 ? 0 : studyAndPack.reduce((acc, obj) => acc + obj.descuento, 0);
    
    const finalTotal = totalStudies - discount;
    
    this.totals = {
      ...this.totals,
      totalEstudios: totalStudies,
      descuento: discount,
      total: finalTotal,
    };
  };
}
