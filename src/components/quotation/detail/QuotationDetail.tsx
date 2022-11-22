import { Divider, Spin } from "antd";
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
import { status } from "../../../app/util/catalogs";
import views from "../../../app/util/view";
import Center from "../../../app/layout/Center";
import { IQuotation } from "../../../app/models/quotation";

const QuotationDetail = () => {
  const { profileStore, quotationStore } = useStore();
  const { profile } = profileStore;
  const { getById, create } = quotationStore;

  const navigate = useNavigate();
  const { quotationId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [recordId, setRecordId] = useState<string>();
  const [branchId, setBranchId] = useState<string | undefined>(
    profile!.sucursal
  );

  useEffect(() => {
    const createQuotation = async () => {
      const quote: IQuotation = {
        cotizacionId: "00000000-0000-0000-0000-000000000000",
        sucursalId: profile!.sucursal,
        estatusId: status.quotation.vigente,
        expedienteId: searchParams.get("exp") ?? undefined,
      };

      setCreating(true);
      const id = await create(quote);
      setCreating(false);

      setRecordId(searchParams.get("exp") ?? undefined);

      if (id) {
        navigate(`/${views.quotation}/${id}`, { replace: true });
      } else {
        navigate(`/${views.quotation}`, { replace: true });
      }
    };

    const getQuotationById = async () => {
      setLoading(true);
      await getById(quotationId!);
      setLoading(false);
    };

    if (!quotationId) {
      createQuotation();
    } else if (quotationId) {
      getQuotationById();
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotationId]);

  if (creating) {
    return (
      <Center>
        <Spin
          spinning={creating}
          tip="Creando Cotización..."
          size="large"
        ></Spin>
      </Center>
    );
  }

  return (
    <Fragment>
      <QuotationHeader />
      <Divider className="header-divider" />
      <QuotationRecord
        branchId={profile!.sucursal}
        recordId={recordId}
        setBranchId={setBranchId}
      />
      <QuotationTab
        branchId={branchId}
        recordId={recordId}
        setRecordId={setRecordId}
      />
    </Fragment>
  );
};

export default observer(QuotationDetail);
