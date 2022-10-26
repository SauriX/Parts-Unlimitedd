import { makeAutoObservable, intercept, reaction } from "mobx";
import PriceList from "../api/priceList";
import Request from "../api/request";
import { IPriceListInfoFilter } from "../models/priceList";
import {
  IRequest,
  IRequestFilter,
  IRequestGeneral,
  IRequestInfo,
  IRequestPack,
  IRequestPartiality,
  IRequestStudy,
  IRequestStudyUpdate,
  IRequestTag,
  IRequestTotal,
  RequestStudyUpdate,
  RequestTotal,
  IRequestPayment,
} from "../models/request";
import alerts from "../util/alerts";
import { status, statusName } from "../util/catalogs";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";

export default class RequestStore {
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
  requests: IRequestInfo[] = [];
  request?: IRequest;
  totals: IRequestTotal = new RequestTotal();
  totalsOriginal: IRequestTotal = new RequestTotal();
  studies: IRequestStudy[] = [];
  packs: IRequestPack[] = [];
  loadingRequests: boolean = false;
  loadingTabContentCount: number = 0;

  get loadingTabContent() {
    return this.loadingTabContentCount > 0;
  }

  get studyUpdate() {
    if (this.request) {
      const data: IRequestStudyUpdate = {
        expedienteId: this.request.expedienteId,
        solicitudId: this.request.solicitudId!,
        paquetes: this.packs,
        estudios: this.studies,
        total: {
          ...this.totals,
          expedienteId: this.request.expedienteId,
          solicitudId: this.request.solicitudId!,
        },
      };
      return data;
    }
    return new RequestStudyUpdate();
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

  setOriginalTotal = (totals: IRequestTotal) => {
    this.totalsOriginal = totals;
  };

  isPack(obj: IRequestStudy | IRequestPack): obj is IRequestPack {
    return obj.type === "pack";
  }

  isStudy(obj: IRequestStudy | IRequestPack): obj is IRequestStudy {
    return obj.type === "study";
  }

  calculateTotals = () => {
    const total =
      this.studies
        .filter((x) => x.estatusId !== status.requestStudy.cancelado)
        .reduce((acc, obj) => acc + obj.precioFinal, 0) +
      this.packs.reduce((acc, obj) => acc + obj.precioFinal, 0);

    const desc =
      this.totals.descuentoTipo === 1
        ? ((this.studies
            .filter((x) => x.aplicaDescuento)
            .reduce((acc, obj) => acc + obj.precio, 0) +
            this.packs
              .filter((x) => x.aplicaDescuento)
              .reduce((acc, obj) => acc + obj.precio, 0)) *
            this.totals.descuento) /
          100
        : this.totals.descuento;

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

    const cop =
      this.totals.copagoTipo === 1
        ? ((this.studies
            .filter((x) => x.aplicaCopago)
            .reduce((acc, obj) => acc + obj.precio, 0) +
            this.packs
              .filter((x) => x.aplicaCopago)
              .reduce((acc, obj) => acc + obj.precio, 0)) *
            this.totals.copago) /
          100
        : this.totals.copago;

    const finalTotal = total - desc + char - cop;

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

  setStudy = (study: IRequestStudy) => {
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

  setPack = (pack: IRequestPack) => {
    const index = this.packs.findIndex((x) => x.id === pack.id);

    if (index > -1) {
      this.packs[index] = pack;
    }
  };

  setPartiality = (apply: boolean) => {
    if (this.request) {
      this.request.parcialidad = apply;
    }
  };

  setTotals = (totals: IRequestTotal) => {
    this.totals = totals;
    this.calculateTotals();
  };

  getById = async (recordId: string, requestId: string) => {
    try {
      const request = await Request.getById(recordId, requestId);
      this.request = request;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/notFound");
    }
  };

  getRequests = async (filter: IRequestFilter) => {
    try {
      this.loadingRequests = true;
      const requests = await Request.getRequests(filter);
      this.requests = requests;
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingRequests = false;
    }
  };

  getGeneral = async (recordId: string, requestId: string) => {
    try {
      this.loadingTabContentCount++;
      const request = await Request.getGeneral(recordId, requestId);
      request.metodoEnvio = [];
      if (request.correo) request.metodoEnvio.push("correo");
      if (request.whatsapp) request.metodoEnvio.push("whatsapp");
      if (request.metodoEnvio.length === 2) request.metodoEnvio.push("ambos");
      return request;
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingTabContentCount--;
    }
  };

  getStudies = async (recordId: string, requestId: string) => {
    try {
      this.loadingTabContentCount++;
      const data = await Request.getStudies(recordId, requestId);
      if (data.paquetes && data.paquetes.length > 0) {
        this.packs = data.paquetes;
      }
      this.studies = data.estudios;
      this.totals = data.total ?? new RequestTotal();
      this.calculateTotals();
      return data;
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
    } finally {
      this.loadingTabContentCount--;
    }
  };

  getPayments = async (recordId: string, requestId: string) => {
    try {
      const data = await Request.getPayments(recordId, requestId);
      return data;
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
    }
  };

  getImages = async (recordId: string, requestId: string) => {
    try {
      const data = await Request.getImages(recordId, requestId);
      return data;
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
    }
  };

  getPriceStudy = async (studyId: number, filter: IPriceListInfoFilter) => {
    try {
      filter.estudioId = studyId;
      const price = await PriceList.getPriceStudy(filter);

      const study: IRequestStudy = {
        ...price,
        type: "study",
        estatusId: status.requestStudy.pendiente,
        estatus: statusName.requestStudy.pendiente,
        aplicaCargo: false,
        aplicaCopago: false,
        aplicaDescuento: false,
        nuevo: true,
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

      const pack: IRequestPack = {
        ...price,
        type: "pack",
        aplicaCargo: false,
        aplicaCopago: false,
        aplicaDescuento: false,
        nuevo: true,
        estudios: price.estudios.map((x) => ({
          ...x,
          type: "study",
          estatusId: status.requestStudy.pendiente,
          estatus: statusName.requestStudy.pendiente,
          aplicaCargo: false,
          aplicaCopago: false,
          aplicaDescuento: false,
          nuevo: true,
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

  sendTestEmail = async (
    recordId: string,
    requestId: string,
    email: string
  ) => {
    try {
      this.loadingTabContentCount++;
      await Request.sendTestEmail(recordId, requestId, email);
      alerts.info("El correo se está enviando");
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingTabContentCount--;
    }
  };

  sendTestWhatsapp = async (
    recordId: string,
    requestId: string,
    phone: string
  ) => {
    try {
      this.loadingTabContentCount++;
      await Request.sendTestWhatsapp(recordId, requestId, phone);
      alerts.info("El whatsapp se está enviando");
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingTabContentCount--;
    }
  };

  create = async (request: IRequest) => {
    try {
      let id = "";
      if (!request.folioWeeClinic) {
        id = await Request.create(request);
      } else {
        id = await Request.createWeeClinic(request);
      }
      return id;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  createPayment = async (request: IRequestPayment) => {
    try {
      const payment = await Request.createPayment(request);
      return payment;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  updateGeneral = async (request: IRequestGeneral) => {
    try {
      this.loadingTabContentCount++;
      await Request.updateGeneral(request);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
      this.loadingTabContentCount--;
    }
  };

  updateTotals = async (request: IRequestTotal) => {
    try {
      await Request.updateTotals(request);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  updateStudies = async (request: IRequestStudyUpdate) => {
    try {
      this.loadingTabContentCount++;
      await Request.updateStudies(request);
      this.studies = this.studies.map((x) => ({ ...x, nuevo: false }));
      this.packs = this.packs.map((x) => ({ ...x, nuevo: false }));
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
      this.loadingTabContentCount--;
    }
  };

  changeStudyPromotion = (study: IRequestStudy, promoId?: number) => {
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

  changePackPromotion = (pack: IRequestPack, promoId?: number) => {
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

  cancelRequest = async (recordId: string, requestId: string) => {
    try {
      await Request.cancelRequest(recordId, requestId);
      if (this.request) this.request.estatusId = status.request.cancelado;
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  cancelStudies = async (request: IRequestStudyUpdate) => {
    try {
      await Request.cancelStudies(request);
      alerts.success(messages.updated);

      const ids = request.estudios.map((x) => x.id!);

      this.updateStudiesStatus(
        ids,
        status.requestStudy.cancelado,
        statusName.requestStudy.cancelado
      );

      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  cancelPayments = async (
    recordId: string,
    requestId: string,
    payments: IRequestPayment[]
  ) => {
    try {
      const cancelled = await Request.cancelPayments(
        recordId,
        requestId,
        payments
      );
      return cancelled;
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
    }
  };

  sendStudiesToSampling = async (request: IRequestStudyUpdate) => {
    try {
      await Request.sendStudiesToSampling(request);
      alerts.success(messages.updated);

      const ids = request.estudios.map((x) => x.id!);

      this.updateStudiesStatus(
        ids,
        status.requestStudy.tomaDeMuestra,
        statusName.requestStudy.tomaDeMuestra
      );

      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  sendStudiesToRequest = async (request: IRequestStudyUpdate) => {
    try {
      await Request.sendStudiesToRequest(request);
      alerts.success(messages.updated);

      const ids = request.estudios.map((x) => x.id!);

      this.updateStudiesStatus(
        ids,
        status.requestStudy.solicitado,
        statusName.requestStudy.solicitado
      );

      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  addPartiality = async (request: IRequestPartiality) => {
    try {
      await Request.addPartiality(request);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  printTicket = async (recordId: string, requestId: string) => {
    try {
      await Request.printTicket(recordId, requestId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  getOrderPdfUrl = async (recordId: string, requestId: string) => {
    try {
      const url = await Request.getOrderPdfUrl(recordId, requestId);
      return url;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  printTags = async (
    recordId: string,
    requestId: string,
    tags: IRequestTag[]
  ) => {
    try {
      await Request.printTags(recordId, requestId, tags);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  saveImage = async (request: FormData) => {
    try {
      var imageName = await Request.saveImage(request);
      return imageName;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  deleteImage = async (recordId: string, requestId: string, code: string) => {
    try {
      await Request.deleteImage(recordId, requestId, code);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  private updateStudiesStatus = (
    ids: number[],
    statusId: number,
    statusName: string
  ) => {
    this.studies = this.studies.map((x) => {
      if (ids.includes(x.id!)) {
        x.estatusId = statusId;
        x.estatus = statusName;
      }
      return x;
    });

    this.packs = this.packs.map((x) => {
      x.estudios = x.estudios.map((y) => {
        if (ids.includes(y.id!)) {
          y.estatusId = statusId;
          y.estatus = statusName;
        }
        return y;
      });
      return x;
    });
  };
}
