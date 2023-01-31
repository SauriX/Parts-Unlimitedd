import { makeAutoObservable, reaction } from "mobx";
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
  IRequestToken,
  IRequestCheckIn,
  RequestFilterForm,
} from "../models/request";
import alerts from "../util/alerts";
import { catalog, status, statusName } from "../util/catalogs";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";
import { v4 as uuidv4 } from "uuid";

export default class RequestStore {
  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.studies.slice(),
      () => {
        this.calculateTotals();
      }
    );

    reaction(
      () => this.packs.slice(),
      () => {
        this.calculateTotals();
      }
    );

    reaction(
      () => this.payments.slice(),
      () => {
        this.calculateTotals();
      }
    );

    reaction(
      () => this.request?.urgencia,
      () => {
        this.calculateTotals();
      }
    );

    reaction(
      () => this.request?.procedencia,
      () => {
        this.calculateTotals();
      }
    );
  }

  filter: IRequestFilter = new RequestFilterForm();
  studyFilter: IPriceListInfoFilter = {};
  requests: IRequestInfo[] = [];
  request?: IRequest;
  totals: IRequestTotal = new RequestTotal();
  totalsOriginal: IRequestTotal = new RequestTotal();
  studies: IRequestStudy[] = [];
  packs: IRequestPack[] = [];
  payments: IRequestPayment[] = [];
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

  clearDetailData = () => {
    this.request = undefined;
    this.studies = [];
    this.packs = [];
    this.totals = new RequestTotal();
  };

  setOriginalTotal = (totals: IRequestTotal) => {
    this.totalsOriginal = totals;
  };

  isPack(obj: IRequestStudy | IRequestPack): obj is IRequestPack {
    return obj.type === "pack";
  }

  isStudy(obj: IRequestStudy | IRequestPack): obj is IRequestStudy {
    return obj.type === "study";
  }

  setFilter = (filter: IRequestFilter) => {
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
      return requests;
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
      this.studies = data.estudios.map((x) => ({
        ...x,
        identificador: uuidv4(),
      }));
      this.totals = data.total ?? new RequestTotal();
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
      const payments = await Request.getPayments(recordId, requestId);
      this.payments = payments;
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

  getNextPaymentCode = async (serie: string) => {
    try {
      const data = await Request.getNextPaymentCode(serie);
      return data.toString();
    } catch (error) {
      alerts.warning(getErrors(error));
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
        nuevo: true,
        asignado: true,
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
        cancelado: false,
        nuevo: true,
        asignado: true,
        estudios: price.estudios.map((x) => ({
          ...x,
          type: "study",
          estatusId: status.requestStudy.pendiente,
          estatus: statusName.requestStudy.pendiente,
          nuevo: true,
          asignado: true,
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
      this.loadingTabContentCount++;
      const payment = await Request.createPayment(request);
      this.payments.push(payment);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
      this.loadingTabContentCount--;
    }
  };

  checkInPayment = async (request: IRequestCheckIn) => {
    try {
      const checkedIn = await Request.checkInPayment(request);
      this.payments = [
        ...this.payments.filter(
          (x) => !checkedIn.map((p) => p.id).includes(x.id)
        ),
        ...checkedIn,
      ];
      return checkedIn;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return [];
    }
  };

  updateSeries = async (request: IRequest) => {
    try {
      const seriesNumber = await Request.updateSeries(request);
      alerts.success(messages.updated);
      if (this.request) {
        this.request.serie = request.serie;
        this.request.serieNumero = seriesNumber.toString();
      }
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
    }
  };

  updateGeneral = async (request: IRequestGeneral, autoSave: boolean) => {
    try {
      if (!autoSave) this.loadingTabContentCount++;
      await Request.updateGeneral(request);
      if (!autoSave) alerts.success(messages.updated);
      if (this.request) {
        this.request.urgencia = request.urgencia;
        this.request.procedencia = request.procedencia;
      }
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
      if (!autoSave) this.loadingTabContentCount--;
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

  updateStudies = async (request: IRequestStudyUpdate, autoSave: boolean) => {
    try {
      if (!autoSave) this.loadingTabContentCount++;
      const response = await Request.updateStudies(request);
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
      // this.calculateTotals();
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
      // this.calculateTotals();
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

  deleteCurrentRequest = async () => {
    try {
      if (this.request?.expedienteId && this.request?.solicitudId) {
        await Request.deleteRequest(
          this.request.expedienteId,
          this.request.solicitudId
        );
        this.requests = this.requests.filter(
          (x) =>
            x.expedienteId !== this.request?.expedienteId &&
            x.solicitudId !== this.request?.solicitudId
        );
        return true;
      }
      alerts.warning("No hay solicitud por eliminar");
      return false;
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
      this.loadingTabContentCount++;
      const cancelled = await Request.cancelPayments(
        recordId,
        requestId,
        payments
      );
      this.payments = [
        ...this.payments.filter(
          (x) => !cancelled.map((p) => p.id).includes(x.id)
        ),
        ...cancelled,
      ];
      return cancelled;
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
    } finally {
      this.loadingTabContentCount--;
    }
  };

  sendStudiesToSampling = async (request: IRequestStudyUpdate) => {
    try {
      await Request.sendStudiesToSampling(request);
      alerts.success(messages.updated);

      const ids = request.estudios.map((x) => x.id!);
      const statusId = request.estudios
        .map((x) => x.estatusId!)
        .includes(status.requestStudy.pendiente);

      if (statusId) {
        this.updateStudiesStatus(
          ids,
          status.requestStudy.tomaDeMuestra,
          statusName.requestStudy.tomaDeMuestra
        );
      } else {
        this.updateStudiesStatus(
          ids,
          status.requestStudy.pendiente,
          statusName.requestStudy.pendiente
        );
      }

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
      const statusId = request.estudios
        .map((x) => x.estatusId!)
        .includes(status.requestStudy.tomaDeMuestra);

      if (statusId) {
        this.updateStudiesStatus(
          ids,
          status.requestStudy.solicitado,
          statusName.requestStudy.solicitado
        );
      } else {
        this.updateStudiesStatus(
          ids,
          status.requestStudy.tomaDeMuestra,
          statusName.requestStudy.tomaDeMuestra
        );
      }

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
      this.loadingTabContentCount++;
      await Request.printTicket(recordId, requestId);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    } finally {
      this.loadingTabContentCount--;
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

  sendWeeToken = async (request: IRequestToken) => {
    try {
      const data = await Request.sendWeeToken(request);
      return data;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  compareWeeToken = async (request: IRequestToken) => {
    try {
      const data = await Request.compareWeeToken(request);
      return data;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  verifyWeeToken = async (request: IRequestToken) => {
    try {
      const data = await Request.verifyWeeToken(request);
      return data;
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  assignWeeServices = async (recordId: string, requestId: string) => {
    try {
      const data = await Request.assignWeeServices(recordId, requestId);
      return data;
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
    }
  };

  // prettier-ignore
  private calculateTotals = () => {
    const studies = this.studies.filter((x) => x.estatusId !== status.requestStudy.cancelado && x.asignado);
    const packs = this.packs.filter((x) => !x.cancelado && x.asignado);
    const payments = this.payments.filter((x) =>
        x.estatusId === status.requestPayment.pagado ||
        x.estatusId === status.requestPayment.facturado
    );
    
    const studyAndPack = studies.map((x) => ({ descuento: x.descuento ?? 0, precio: x.precio, precioFinal: x.precioFinal, copago: x.copago ?? 0 }))
      .concat(packs.map((x) => ({ descuento: x.descuento, precio: x.precio, precioFinal: x.precioFinal, copago: 0 })));

    const totalStudies = studyAndPack.reduce((acc, obj) => acc + obj.precioFinal, 0);

    const discount = totalStudies === 0 ? 0 : studyAndPack.reduce((acc, obj) => acc + obj.descuento, 0);
    const charge = totalStudies === 0 ? 0
        : this.request?.urgencia === catalog.urgency.urgenteCargo ? totalStudies * 0.1
        : 0;
    const cup = totalStudies === 0 ? 0 : this.request?.esWeeClinic ? studyAndPack.reduce((acc, obj) => acc + obj.copago, 0) 
        : this.request?.procedencia === catalog.origin.convenio ? payments.reduce((acc,obj) => acc + obj.cantidad, 0) : 0;

    const finalTotal = totalStudies - discount + charge;
    const userTotal = cup > 0 ? cup : finalTotal;
    const balance =  finalTotal -  payments.reduce((acc,obj) => acc + obj.cantidad, 0);

    this.totals = {
      ...this.totals,
      totalEstudios: totalStudies,
      descuento: discount,
      cargo: charge,
      copago: cup,
      total: userTotal,
      saldo: balance,
    };
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
