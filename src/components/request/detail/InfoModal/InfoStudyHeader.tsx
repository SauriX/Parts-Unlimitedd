import { PageHeader, Pagination, Typography } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";

const { Text } = Typography;

const RequestHeader = () => {




  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          image={"infoStudy"}
          
          title="Ficha técnica"
        />
      }
    ></PageHeader>
  );
};

export default observer(RequestHeader);
