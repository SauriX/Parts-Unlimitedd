import { PageHeader, Input } from "antd";
import HeaderTitle from "../../app/common/header/HeaderTitle";

const WorkListHeader = () => {
  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          title="Lista de trabajo por Área (Análisis Clínicos)"
          image="worklist"
        />
      }
      className="header-container"
    ></PageHeader>
  );
};

export default WorkListHeader;
