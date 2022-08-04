import { Divider } from "antd";
import { Fragment, useEffect, useState } from "react";
import RequestHeader from "../components/request/RequestHeader";
import RequestRecord from "../components/request/RequestRecord";
import RequestTab from "../components/request/RequestTab";
import "../components/request/css/index.less";
import { useNavigate, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../app/stores/store";
import { IRequest } from "../app/models/request";

const Request = () => {
  const { profileStore, requestStore } = useStore();
  const { profile } = profileStore;
  const { getById, create } = requestStore;

  const navigate = useNavigate();
  const { recordId, requestId } = useParams();

  const [loading, setLoading] = useState(false);
  const [branchId, setBranchId] = useState<string | undefined>(profile!.sucursal);

  useEffect(() => {
    const createRequest = async () => {
      const req: IRequest = {
        expedienteId: recordId!,
        sucursalId: profile!.sucursal,
        esNuevo: true,
      };

      const id = await create(req);

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
      <RequestRecord recordId={recordId} branchId={profile!.sucursal} setBranchId={setBranchId} />
      <RequestTab recordId={recordId} branchId={branchId} />
    </Fragment>
  );
};

export default observer(Request);
