import { PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
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
