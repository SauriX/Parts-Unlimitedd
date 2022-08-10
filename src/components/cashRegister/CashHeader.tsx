import { PageHeader, Select } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import ImageButton from "../../app/common/button/ImageButton";
import HeaderTitle from "../../app/common/header/HeaderTitle";

type CashHeaderProps = {
  handleDownload: () => Promise<void>;
};

const ReportHeader: FC<CashHeaderProps> = ({ handleDownload }) => {
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Corte de Caja" image="caja-registradora" />}
      className="header-container"
      extra={[
        <ImageButton
          key="doc"
          title="Informe"
          image="doc"
          onClick={handleDownload}
        />,
      ]}
    ></PageHeader>
  );
};

export default observer(ReportHeader);
