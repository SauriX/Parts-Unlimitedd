import { Divider, Spin } from "antd";
import { Fragment, useEffect, useState } from "react";
import RequestHeader from "./RequestHeader";
import RequestRecord from "./RequestRecord";
import RequestTab from "./RequestTab";
import "./css/index.less";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { IRequest } from "../../../app/models/request";
import { status } from "../../../app/util/catalogs";
import { toJS } from "mobx";
import moment from "moment";
import views from "../../../app/util/view";
import Center from "../../../app/layout/Center";

const RequestDetail = () => {
  const { profileStore, requestStore, loyaltyStore, procedingStore } =
    useStore();
  const { profile } = profileStore;
  const {
    getById,
    create,
    totals,
    setOriginalTotal,
    studyFilter,
    request,
    totalsOriginal,
  } = requestStore;
  const { getById: getByIdProceding, activateWallet } = procedingStore;
  const { loyaltys, getByDate } = loyaltyStore;

  useEffect(() => {}, []);

  const navigate = useNavigate();
  const { recordId, requestId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [branchId, setBranchId] = useState<string | undefined>(
    profile!.sucursal
  );

  useEffect(() => {
    setOriginalTotal(totals);
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
      };

      if (searchParams.has("weeFolio")) {
        req.folioWeeClinic = searchParams.get("weeFolio")!;
        req.esWeeClinic = true;
        searchParams.delete("weeFolio");
        setSearchParams(searchParams);
      }

      setCreating(true);
      const id = await create(req);
      await modificarSaldo();
      setCreating(false);

      if (id) {
        navigate(`${id}`, { replace: true });
      } else {
        navigate(`/${views.request}`, { replace: true });
      }
    };

    const getRequestById = async () => {
      setLoading(true);
      await getById(recordId!, requestId!);
      setLoading(false);
    };

    if (recordId && !requestId) {
      createRequest();
    } else if (recordId && requestId) {
      getRequestById();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId, requestId]);

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
      <RequestHeader />
      <Divider className="header-divider" />
      <RequestRecord
        recordId={recordId}
        branchId={profile!.sucursal}
        setBranchId={setBranchId}
      />
      <RequestTab recordId={recordId} branchId={branchId} />
    </Fragment>
  );
};

export default observer(RequestDetail);
