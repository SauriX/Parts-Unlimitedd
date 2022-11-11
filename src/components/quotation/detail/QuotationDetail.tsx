import { Col, Divider, Row, Spin, Typography } from "antd";
import { Fragment, useEffect, useState } from "react";
import QuotationHeader from "./QuotationHeader";
import QuotationRecord from "./QuotationRecord";
import QuotationTab from "./QuotationTab";
import "./css/index.less";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
// import { IQuotation } from "../../../app/models/quotation";
import { status } from "../../../app/util/catalogs";
import { toJS } from "mobx";
import moment from "moment";
import views from "../../../app/util/view";
import Center from "../../../app/layout/Center";

const { Link } = Typography;

const QuotationDetail = () => {
  const {
    profileStore,
    quotationStore,
    loyaltyStore,
    procedingStore,
    modalStore,
  } = useStore();
  const { profile } = profileStore;
  const {
    getById,
    create,
    // totals,
    // setOriginalTotal,
    studyFilter,
    // quotation,
    // totalsOriginal,
  } = quotationStore;
  const { getById: getByIdProceding, activateWallet } = procedingStore;
  const { loyaltys, getByDate } = loyaltyStore;
  const { openModal, closeModal } = modalStore;

  const navigate = useNavigate();
  const { state } = useLocation();
  const { recordId, quotationId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [branchId, setBranchId] = useState<string | undefined>(
    profile!.sucursal
  );

  useEffect(() => {
    // const createQuotation = async () => {
    //   const req: IQuotation = {
    //     expedienteId: recordId!,
    //     sucursalId: profile!.sucursal,
    //     parcialidad: false,
    //     esNuevo: true,
    //     estatusId: status.quotation.vigente,
    //     esWeeClinic: false,
    //     tokenValidado: false,
    //   };
    //   if (searchParams.has("weeFolio")) {
    //     req.folioWeeClinic = searchParams.get("weeFolio")!;
    //     req.esWeeClinic = true;
    //     searchParams.delete("weeFolio");
    //     setSearchParams(searchParams);
    //     if (state && (state as any).services) {
    //       req.servicios = (state as any).services;
    //     }
    //   }
    //   setCreating(true);
    //   const id = await create(req);
    //   await modificarSaldo();
    //   setCreating(false);
    //   if (id) {
    //     navigate(`${id}`, { replace: true });
    //   } else {
    //     navigate(`/${views.quotation}`, { replace: true });
    //   }
    // };
    // const getQuotationById = async () => {
    //   setLoading(true);
    //   await getById(recordId!, quotationId!);
    //   setLoading(false);
    // };
    // if (recordId && !quotationId) {
    //   createQuotation();
    // } else if (recordId && quotationId) {
    //   getQuotationById();
    // }
    // //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId, quotationId]);

  //   if (!recordId) return null;

  //   if (creating) {
  //     return (
  //       <Center>
  //         <Spin
  //           spinning={creating}
  //           tip="Creando Solicitud..."
  //           size="large"
  //         ></Spin>
  //       </Center>
  //     );
  //   }

  return (
    <Fragment>
      <QuotationHeader />
      <Divider className="header-divider" />
      <QuotationRecord branchId={profile!.sucursal} setBranchId={setBranchId} />
      <QuotationTab branchId={branchId} />
    </Fragment>
  );
};

export default observer(QuotationDetail);
