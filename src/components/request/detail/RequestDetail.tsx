import { Divider } from "antd";
import { Fragment, useEffect, useState } from "react";
import RequestHeader from "./RequestHeader";
import RequestRecord from "./RequestRecord";
import RequestTab from "./RequestTab";
import "./css/index.less";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { IRequest } from "../../../app/models/request";
import { status } from "../../../app/util/catalogs";
import { toJS } from "mobx";
import moment from "moment";

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

  const [loading, setLoading] = useState(false);
  const [branchId, setBranchId] = useState<string | undefined>(
    profile!.sucursal
  );

  useEffect(() => {
    setOriginalTotal(totals);
  }, []);
  const modificarSaldo = async () => {
    const loyal = await getByDate(moment().toDate());
    const contieneMedico = loyal?.precioLista.some((l) => l === "Medicos");
    const expediente = await getByIdProceding(request?.expedienteId!);

    if (expediente?.hasWallet && !studyFilter.compañiaId && contieneMedico) {
      if (loyal?.tipoDescuento !== "Porcentaje") {
        await activateWallet(request?.expedienteId!, loyal?.cantidadDescuento!);
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
      };

      const id = await create(req);
      await modificarSaldo();

      if (id) {
        navigate(`${id}`, { replace: true });
      } else {
        navigate("/error", { replace: true });
      }
    };

    const getRequestById = async () => {
      setLoading(true);
      await getById(recordId!, requestId!);
    };

    if (recordId && !requestId) {
      createRequest();
    } else if (recordId && requestId) {
      getRequestById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId, requestId]);

  if (!recordId) return null;

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
