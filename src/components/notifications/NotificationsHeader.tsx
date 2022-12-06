import { Button, Input, PageHeader, Select } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import PrintIcon from "../../app/common/icons/PrintIcon";
import { PlusOutlined } from "@ant-design/icons";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import { useNavigate } from "react-router-dom";
const { Search } = Input;
type NotificationsHeaderProps = {
  handleDownload: () => void;
  handlePrint: () => void;
};
const NotificationsHeader: FC<NotificationsHeaderProps> = ({
  handleDownload,
  handlePrint,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        ghost
        title={
          <HeaderTitle
            title="Catálogo de avisos y notificaciones"
            image="notifications"
          />
        }
        className="header-container"
        extra={[
          <DownloadIcon key="doc" onClick={handleDownload} />,
          <PrintIcon key="print" onClick={handlePrint} />,
          <Search key="search" placeholder="Buscar" />,
          <Select
            key="catalogo"
            showSearch
            placeholder="Catálogo"
            optionFilterProp="children"
            // defaultValue={searchParams.get("report")}
            // onChange={handleChange}
            // filterOption={(input: string, option: any) =>
            //   option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            // }
            allowClear
            style={{ width: 180, textAlign: "left" }}
            // options={reports}
            options={[]}
          ></Select>,
          <Button
            key="new"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              navigate(`/notifications/new`);
            }}
          >
            Nuevo
          </Button>,
        ]}
      ></PageHeader>
    </>
  );
};
export default observer(NotificationsHeader);
