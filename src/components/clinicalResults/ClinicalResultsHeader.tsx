import { observer } from "mobx-react-lite";
import { PageHeader, Pagination, Typography } from "antd";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { FC, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import { toJS } from "mobx";

const { Text } = Typography;

type ClinicalFormProps = {
  printing: boolean;
};

const ClinicalResultsHeader: FC<ClinicalFormProps> = ({ printing }) => {
  const { requestStore, clinicResultsStore } = useStore();
  const { request, getById } = requestStore;
  const { data } = clinicResultsStore;
  const [searchParams] = useSearchParams();
  const [returnV, setReturnV] = useState(
    searchParams.get("return") === "validation"
  );
  let navigate = useNavigate();
  const getPage = (id: string) => {
    const index = data.findIndex((x) => x.id === id) + 1;

    return index;
  };
  const setPage = (page: number) => {
    const currentRequest = data[page - 1];
    navigate(
      `/clinicResultsDetails/${currentRequest?.expedienteId!}/${currentRequest?.id!}`
    );
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title={`Solicitud: ${request?.clave}`} />}
      onBack={() => {
        if (returnV) {
          navigate(`/ResultValidation`);
        } else {
          navigate(`/clinicResults`);
        }
      }}
      subTitle={`Registro: ${request?.registro}`}
      extra={[
        <Pagination
          key="pagination"
          size="small"
          total={data.length ?? 0}
          pageSize={1}
          current={getPage(request?.solicitudId!)}
          onChange={setPage}
        />,
      ]}
    ></PageHeader>
  );
};

export default observer(ClinicalResultsHeader);
