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
  QuotationStudyUpdate,
  QuotationTotal,
} from "../models/quotation";
import alerts from "../util/alerts";
import { status, statusName } from "../util/catalogs";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";

export default class QuotationStore {
  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.studies.slice(),
      (studies) => {
        console.log(studies);
        this.calculateTotals();
      }
    );

    reaction(
      () => this.packs.slice(),
      (packs) => {
        console.log(packs);
        this.calculateTotals();
      }
    );
  }

  studyFilter: IPriceListInfoFilter = {};
  quotations: IQuotationInfo[] = [];
  quotation?: IQuotation;
  totals: IQuotationTotal = new QuotationTotal();
  studies: IQuotationStudy[] = [];
  packs: IQuotationPack[] = [];
  loadingQuotations: boolean = false;
  loadingTabContentCount: number = 0;

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
  };

  isPack(obj: IQuotationStudy | IQuotationPack): obj is IQuotationPack {
    return obj.type === "pack";
  }

  isStudy(obj: IQuotationStudy | IQuotationPack): obj is IQuotationStudy {
    return obj.type === "study";
  }

  calculateTotals = () => {
    const total =
      this.studies.reduce((acc, obj) => acc + obj.precioFinal, 0) +
      this.packs.reduce((acc, obj) => acc + obj.precioFinal, 0);

    const char =
      this.totals.cargoTipo === 1
        ? ((this.studies
            .filter((x) => x.aplicaCargo)
            .reduce((acc, obj) => acc + obj.precio, 0) +
            this.packs
              .filter((x) => x.aplicaCargo)
              .reduce((acc, obj) => acc + obj.precio, 0)) *
            this.totals.cargo) /
          100
        : this.totals.cargo;

    const finalTotal = total + char;

    this.totals = {
      ...this.totals,
      totalEstudios: total,
      total: finalTotal,
    };
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

  setTotals = (totals: IQuotationTotal) => {
    this.totals = totals;
    this.calculateTotals();
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
      if (quotation.correo) quotation.metodoEnvio.push("correo");
      if (quotation.whatsapp) quotation.metodoEnvio.push("whatsapp");
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

      console.log(study);

      const repeated = this.studies.filter(function (item) {
        return item.parametros
          .map((x) => x.id)
          .filter((x) => study.parametros.map((y) => y.id).indexOf(x) !== -1);
      });

      if (repeated && repeated.length > 0) {
        alerts.confirm(
          "Coincidencias en estudios",
          "Se encuentran coincidencias en parámetros de solicitud, en estudios: " +
            repeated.map((x) => x.clave).join(", "),
          async () => {
            this.studies.unshift(study);
          }
        );
      } else {
        this.studies.unshift(study);
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

      console.log(pack);
      this.packs.unshift(pack);
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

  sendTestEmail = async (quotationId: string, email: string) => {
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

  sendTestWhatsapp = async (quotationId: string, phone: string) => {
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
  deactivateQuotation = async (quotationId: string) => {
    try {
      await Quotation.deactivateQuotation(quotationId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  updateGeneral = async (quotation: IQuotationGeneral) => {
    try {
      this.loadingTabContentCount++;
      await Quotation.updateGeneral(quotation);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
      this.loadingTabContentCount--;
    }
  };

  assignRecord = async (quotationId: string, recordId?: string) => {
    try {
      this.loadingTabContentCount++;
      await Quotation.assignRecord(quotationId, recordId);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
      this.loadingTabContentCount--;
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

  updateStudies = async (quotation: IQuotationStudyUpdate) => {
    try {
      this.loadingTabContentCount++;
      await Quotation.updateStudies(quotation);
      this.studies = this.studies.map((x) => ({ ...x }));
      this.packs = this.packs.map((x) => ({ ...x }));
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
      this.loadingTabContentCount--;
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
      if (this.quotation) this.quotation.estatusId = status.quotation.cancelado;
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  deleteStudies = async (quotation: IQuotationStudyUpdate) => {
    try {
      await Quotation.deleteStudies(quotation);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  printTicket = async (quotationId: string) => {
    try {
      await Quotation.printTicket(quotationId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
}
