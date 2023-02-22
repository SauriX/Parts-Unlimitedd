import { makeAutoObservable, reaction, toJS } from "mobx";
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
import { catalog, paymentForms, status, statusName } from "../util/catalogs";
import history from "../util/history";
import messages from "../util/messages";
import {
  consoleColor,
  generateRandomHex,
  getDistinct,
  getErrors,
  groupBy,
  isEqualObject,
} from "../util/utils";
import { v4 as uuidv4 } from "uuid";
import { store } from "./store";
import NetPay from "../api/netPay";
import { ITag, ITagStudy } from "../models/tag";
import { IStudyTag } from "../models/study";
import moment from "moment";

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

    reaction(
      () => this.tags.slice(),
      () => {
        this.updateAvailableTags();
      }
    );

    reaction(
      () => this.allActiveStudies.length,
      () => {
        this.updateAvailableTags();
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
  lastViewedFrom?: { from: "requests" | "results"; code: string };
  tags: IRequestTag[] = [];
  availableTagStudies: ITagStudy[] = [];

  setTags = (tags: IRequestTag[]) => {
    this.tags = tags;
  };

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

  get allActiveStudies() {
    return this.allStudies.filter(
      (x) => x.estatusId !== status.requestStudy.cancelado && x.asignado
    );
  }

  get distinctTags() {
    return getDistinct(
      this.allActiveStudies
        .flatMap((x) => x.etiquetas)
        .map((x) => ({
          etiquetaId: x.etiquetaId,
          claveEtiqueta: x.claveEtiqueta,
          nombreEtiqueta: x.nombreEtiqueta,
          color: x.color,
          claveInicial: x.claveInicial,
        }))
    );
  }

  clearDetailData = () => {
    this.request = undefined;
    this.studies = [];
    this.packs = [];
    this.totals = new RequestTotal();
  };

  clearStudies = () => {
    this.studies = [];
    this.packs = [];
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

  setLastViewedCode = (
    data:
      | {
          from: "requests" | "results";
          code: string;
        }
      | undefined
  ) => {
    this.lastViewedFrom = data;
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

  getById = async (
    recordId: string,
    requestId: string,
    from: "requests" | "results"
  ) => {
    try {
      const request = await Request.getById(recordId, requestId);
      this.lastViewedFrom = { from: from, code: request.clave! };
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
      if (request.correo) {
        request.metodoEnvio.push("correo");
        request.correos = request.correo.split(",");
      }
      if (request.whatsapp) {
        request.metodoEnvio.push("whatsapp");
        request.whatsapps = request.whatsapp.split(",");
      }
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
    }
  };

  getTags = async (recordId: string, requestId: string) => {
    try {
      const tags = await Request.getTags(recordId, requestId);
      this.tags = tags;
    } catch (error) {
      alerts.warning(getErrors(error));
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
            this.updateTagsStudy(study);
          }
        );
      } else {
        this.studies.unshift(study);
        this.updateTagsStudy(study);
      }

      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  updateTagsStudy = (study: IRequestStudy) => {
    // prettier-ignore
    const groupedStudies = groupBy(this.allActiveStudies, "destinoId", "destino", "destinoTipo");
    consoleColor("ESTUDIOS AGRUPADOS POR DESTINO:", "green");
    console.log(groupedStudies);

    const allTags: IRequestTag[] = this.tags.map((x) => toJS(x));

    for (const group of groupedStudies) {
      const keyArr = group.key.split(":");
      // prettier-ignore
      const keyData = { destinoId: keyArr[0], destino: keyArr[1], destinoTipo: keyArr[2] };

      const groupTags = getDistinct(
        group.items
          .flatMap((x) => x.etiquetas)
          .filter((x) => {
            const t = allTags
              .flatMap((s) => s.estudios)
              .find((s) => s.nombreEstudio === x.nombreEstudio);
            return !t;
            // !this.availableTagStudies
            //   .map((s) => s.nombreEstudio)
            //   .includes(x.nombreEstudio);
          })
      );
      consoleColor(`ETIQUETAS EN DESTINO ${group.key}:`, "green");
      console.log(groupTags);

      // prettier-ignore
      const destinationTags = groupTags.map(
        ({ etiquetaId, claveEtiqueta, claveInicial, nombreEtiqueta, color }) => ({
          destinoId: keyData.destinoId,
          destino: keyData.destino,
          destinoTipo: Number(keyData.destinoTipo),
          etiquetaId,
          claveEtiqueta,
          claveInicial,
          nombreEtiqueta,
          color,
          cantidad: 1
        })
      );

      const groupedByTags = groupBy(groupTags, "etiquetaId");
      for (const groupTag of groupedByTags) {
        const items = getDistinct(groupTag.items);

        // prettier-ignore
        const tag = destinationTags.find((x) => x.etiquetaId.toString() === groupTag.key);
        const existingTagIndex = allTags.findIndex(
          (x) =>
            x.etiquetaId === tag?.etiquetaId && x.destinoId === tag.destinoId
        );

        const tagStudies = items.map(
          ({ estudioId, nombreEstudio, orden, cantidad }) => ({
            estudioId,
            nombreEstudio,
            orden,
            cantidad,
          })
        );

        if (existingTagIndex === -1) {
          allTags.push({
            id: uuidv4(),
            ...tag!,
            clave: this.generateTagCode(tag!),
            estudios: tagStudies,
          });
        } else {
          allTags[existingTagIndex].estudios = getDistinct([
            ...allTags[existingTagIndex].estudios,
            ...tagStudies,
          ]);
        }
      }
    }

    // this.availableTagStudies = getDistinct([
    //   ...this.availableTagStudies,
    //   ...this.allActiveStudies
    //     .flatMap((x) => x.etiquetas)
    //     .map(({ etiquetaId, estudioId, nombreEstudio, orden, cantidad }) => ({
    //       etiquetaId,
    //       estudioId,
    //       nombreEstudio,
    //       orden,
    //       asignado: true,
    //       cantidad,
    //     })),
    // ]);

    consoleColor("ETIQUETAS DISPONIBLES:", "green");
    console.log(toJS(this.availableTagStudies));

    consoleColor("ETIQUETAS AGRUPADAS POR DESTINO Y ETIQUETA:", "blue");
    console.log(allTags);
    this.setTags(allTags);
  };

  updateAvailableTags = () => {
    // etiquetaId: number;
    // estudioId: number;
    // nombreEstudio: string;
    // orden: number;
    // asignado: boolean;
    // cantidad: number;

    this.availableTagStudies = getDistinct(
      this.allActiveStudies
        .flatMap((x) => x.etiquetas)
        .map(({ etiquetaId, estudioId, nombreEstudio, orden, cantidad }) => ({
          etiquetaId,
          estudioId,
          nombreEstudio,
          orden,
          asignado: true,
          cantidad,
        }))
    );

    const avTags = this.availableTagStudies.map((x) => toJS(x));

    for (const item of avTags) {
      // prettier-ignore
      item.asignado = this.tags.flatMap((x) => x.estudios).map((x) => x.nombreEstudio).includes(item.nombreEstudio);
    }

    this.availableTagStudies = avTags;
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

  addTag = (tag: ITag) => {
    // prettier-ignore
    this.tags.push({
      id: uuidv4(),
      clave: this.generateTagCode(tag),
      destino: uuidv4(),
      destinoId: uuidv4(),
      destinoTipo: 3,
      claveEtiqueta: tag.claveEtiqueta,
      nombreEtiqueta: tag.nombreEtiqueta,
      cantidad: 1,
      claveInicial: tag.claveInicial,
      color: tag.color,
      etiquetaId: tag.etiquetaId,
      estudios: [],
    });
  };

  deleteTag = (id: string | number) => {
    const tags = [...this.tags];
    const index = tags.findIndex((x) => x.id === id);

    if (index === -1) return;

    this.setTags(tags.filter((x) => x.id !== id));
  };

  sendTestEmail = async (
    recordId: string,
    requestId: string,
    email: string[]
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
    phone: string[]
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

      if (
        request.formaPagoId !== paymentForms.tarjetaDebito &&
        request.formaPagoId !== paymentForms.tarjetaCredito
      ) {
        const payment = await Request.createPayment(request);
        this.payments.push(payment);
        // this.payments = [...this.payments, payment];
      } else {
        this.chargePayPalPayment(request);
      }

      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    } finally {
      this.loadingTabContentCount--;
    }
  };

  chargePayPalPayment = (payment: IRequestPayment) => {
    const guid = uuidv4();
    payment.notificacionId = guid;

    const res = NetPay.paymentCharge(payment);
    if (!res) return;

    const connection = store.notificationStore.hubConnection;
    if (!connection) return;

    console.log("Esperando respuesta de terminal...");

    if (connection.state === "Connected") {
      connection.invoke("SubscribeWithName", guid);
    }

    connection.on("NotifyPaymentResponse", (payment: IRequestPayment) => {
      console.log("Respuesta recibida de terminal");
      // this.payments.push(payment);
      console.log(payment);
      this.payments = [...this.payments, payment];
      connection.invoke("RemoveWithName", guid);
      connection.off("NotifyPaymentResponse");
    });
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
      if (request.cambioCompañia) {
        this.clearStudies();
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

  updateTags = async (
    recordId: string,
    requestId: string,
    tags: IRequestTag[],
    autoSave: boolean
  ) => {
    try {
      if (
        //prettier-ignore
        tags.some((x) => x.estudios.length === 0) || this.availableTagStudies.some((x) => !x.asignado)
      ) {
        alerts.warning("Las etiquetas deben tener por lo menos un estudio");
        return;
      }

      if (!autoSave) this.loadingTabContentCount++;
      const tagsToUpdate = tags.map((tag) => ({
        ...tag,
        id: typeof tag.id === "string" ? 0 : tag.id,
      }));
      this.tags = await Request.updateTags(recordId, requestId, tagsToUpdate);
      if (!autoSave) alerts.success(messages.updated);
      return true;
    } catch (error) {
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

  private generateTagCode = (tag: ITag) => {
    if (!this.request) return "";

    const intialCode = tag.claveInicial;
    // prettier-ignore
    const final = intialCode.includes("año") || intialCode === "0" || intialCode==="X" ? moment().format("YY") : intialCode;
    return (
      final + moment().format("YYMM") + "0" + this.request.clave!.slice(-5)
    );
  };
}
