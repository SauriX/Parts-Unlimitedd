import { PageHeader, Pagination, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { useStore } from "../../../app/stores/store";
import views from "../../../app/util/view";

const { Text } = Typography;

const RequestHeader = () => {
  const { requestStore } = useStore();
  const { request, requests, filter, getRequests } = requestStore;

  let navigate = useNavigate();

  const { recordId, requestId } = useParams();

  useEffect(() => {
    if (
      requests.length === 0 ||
      requests.findIndex(
        (x) => x.expedienteId === recordId && x.solicitudId === requestId
      ) === -1
    ) {
      getRequests(filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  const getPage = (recordId?: string, requestId?: string) => {
    return (
      requests.findIndex(
        (x) => x.expedienteId === recordId && x.solicitudId === requestId
      ) + 1
    );
  };

  const setPage = (page: number) => {
    const request = requests[page - 1];
    navigate(
      `/${views.request}/${request.expedienteId}/${request.solicitudId}`
    );
  };

  const getBack = () => {
    navigate(`/${views.request}`);
  };

  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          image={request?.esWeeClinic ? "weeclinic" : undefined}
          folder="logos"
          title="Solicitud"
        />
      }
      onBack={getBack}
      className="header-container"
      subTitle={
        <Pagination
          size="small"
          total={requests.length}
          pageSize={1}
          current={getPage(request?.expedienteId, request?.solicitudId)}
          onChange={setPage}
        />
      }
      extra={[
        request?.esWeeClinic && (
          <Text key="weeclinic">
            Folio Wee: <Text strong>{request?.folioWeeClinic}</Text>
          </Text>
        ),
        <Text key="request">
          Solicitud: <Text strong>{request?.clave}</Text>
        </Text>,
        <Text key="number">
          Registro: <Text strong>{request?.registro}</Text>
        </Text>,
      ]}
    ></PageHeader>
  );
};

export default observer(RequestHeader);
