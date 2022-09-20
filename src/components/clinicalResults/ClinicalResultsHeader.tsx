import { observer } from "mobx-react-lite";
import { PageHeader, Pagination, Typography } from "antd";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import React, { FC } from "react";
import GoBackIcon from "../../app/common/icons/GoBackIcon";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

type ClinicalFormProps = {
  id: string;
  printing: boolean;
};

const ClinicalResultsHeader: FC<ClinicalFormProps> = ({ id, printing }) => {
  let navigate = useNavigate();
  const getPage = (id: string) => {
    // return clinicalResult.findIndex((x) => x.id === id) + 1;
    // return [].findIndex((x) => x.id === id) + 1;
    return 1;
  };
  const setPage = (page: number) => {
    // const loyalty = loyaltys[page - 1];
    // navigate(`/${views.loyalty}/${studie.id}?${searchParams}`);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title={`Solicitud: ${"0000000"}`} />}
      onBack={() => window.history.back()}
      subTitle={`Registro ${"000000"}`}
      className="header-container"
      extra={[
        <Pagination
          size="small"
          total={[].length}
          pageSize={1}
          current={getPage(id)}
          onChange={setPage}
        />,
      ]}
    ></PageHeader>
  );
};

export default observer(ClinicalResultsHeader);
