import { Col, Divider, Row, Spin, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import RequestHeader from "./RequestHeader";
import RequestRecord from "./RequestRecord";
import RequestTab from "./RequestTab";
import "./css/index.less";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { IRequest } from "../../../app/models/request";
import { status } from "../../../app/util/catalogs";
import moment from "moment";
import views from "../../../app/util/view";
import Center from "../../../app/layout/Center";
import RequestTokenValidation from "./RequestTokenValidation";
import { useCallbackPrompt } from "../../../app/hooks/useCallbackPrompt";
import NavigationConfirm from "../../../app/common/navigation/NavigationConfirm";
import RequestDeliveryHistory from "./RequestDeliveryHistory";

const { Link } = Typography;

const RequestDetail = () => {
  const {
    profileStore,
    requestStore,
    loyaltyStore,
    procedingStore,
    modalStore,
  } = useStore();
  const { profile } = profileStore;
  const {
    studies,
    packs,
    clearDetailData,
    getById,
    create,
    deleteCurrentRequest,
    totals,
    setOriginalTotal,
    studyFilter,
    request,
  } = requestStore;
  const { getById: getByIdProceding, activateWallet } = procedingStore;
  const { getByDate } = loyaltyStore;
  const { openModal, closeModal } = modalStore;

  const navigate = useNavigate();
  const { state } = useLocation();
  const { recordId, requestId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [creating, setCreating] = useState(false);
  const [branchId, setBranchId] = useState<string | undefined>(
    profile!.sucursal
  );
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(
    showDialog,
    deleteCurrentRequest
  );

  useEffect(() => {
    setOriginalTotal(totals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modificarSaldo = async () => {
    if (request) {
      const loyal = await getByDate(moment().toDate());
      const contieneMedico = loyal?.precioLista.some((l) => l === "Medicos");
      const expediente = await getByIdProceding(request.expedienteId!);
      const fechaCreaccionSolicitud = moment(request.registro);
      const fechaActivacionMonedero = moment(
        expediente?.fechaActivacionMonedero
      );

      if (
        expediente?.hasWallet &&
        !studyFilter.compañiaId &&
        contieneMedico &&
        fechaCreaccionSolicitud.isSameOrAfter(fechaCreaccionSolicitud)
      ) {
        if (loyal?.tipoDescuento !== "Porcentaje") {
          await activateWallet(
            request?.expedienteId!,
            loyal?.cantidadDescuento!
          );
        }
      }
    }
  };

  useEffect(() => {
    const createRequest = async () => {
      const req: IRequest = {
        expedienteId: recordId!,
        sucursalId: profile!.sucursal,
        parcialidad: false,
        esNuevo: true,
        estatusId: status.request.vigente,
        esWeeClinic: false,
        tokenValidado: false,
      };

      if (searchParams.has("weeFolio")) {
        req.folioWeeClinic = searchParams.get("weeFolio")!;
        req.esWeeClinic = true;
        searchParams.delete("weeFolio");
        setSearchParams(searchParams);

        if (state && (state as any).services) {
          req.servicios = (state as any).services;
        }
      }

      setCreating(true);
      const id = await create(req);
      // await modificarSaldo();
      setCreating(false);

      if (id) {
        navigate(`${id}`, { replace: true });
      } else {
        navigate(`/${views.request}`, { replace: true });
      }
    };

    const getRequestById = async () => {
      await getById(recordId!, requestId!, "requests");
    };

    if (recordId && !requestId) {
      createRequest();
    } else if (recordId && requestId) {
      getRequestById();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId, requestId]);

  useEffect(() => {
    setShowDialog(
      studies.filter((x) => x.id !== 0).length === 0 &&
        packs.filter((x) => x.id !== 0).length === 0 &&
        requestId != null
    );
  }, [packs, requestId, studies]);

  useEffect(() => {
    if (request && request.esWeeClinic && !request.tokenValidado) {
      openModal({
        title: (
          <Row justify="space-between">
            <Col>Token de verificación</Col>
            <Col>
              <Link
                onClick={() => {
                  closeModal();
                  navigate(`/${views.request}`);
                }}
                style={{ fontSize: 14, fontWeight: 400 }}
              >
                Regresar al listado
              </Link>
            </Col>
          </Row>
        ),
        body: (
          <RequestTokenValidation
            recordId={request.expedienteId}
            requestId={request.solicitudId!}
          />
        ),
        closable: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  useEffect(() => {
    return () => {
      closeModal();
      clearDetailData();
    };
  }, [closeModal, clearDetailData]);

  if (!recordId) return null;

  if (creating) {
    return (
      <Center>
        <Spin
          spinning={creating}
          tip="Creando Solicitud..."
          size="large"
        ></Spin>
      </Center>
    );
  }

  return (
    <Fragment>
      <NavigationConfirm
        title="Cancelar solicitud"
        body="La solicitud no contiene estudios ni paquetes, asegurate de agregar almenos uno, en caso de continuar la solicitud será eliminada"
        showDialog={showPrompt}
        confirmNavigation={confirmNavigation}
        cancelNavigation={cancelNavigation}
      />
      <RequestHeader />
      <Divider className="header-divider" />
      <RequestRecord
        recordId={recordId}
        branchId={profile!.sucursal}
        setBranchId={setBranchId}
      />
      <RequestTab recordId={recordId} branchId={branchId} />
      <Divider className="header-divider" />
    </Fragment>
  );
};

export default observer(RequestDetail);
