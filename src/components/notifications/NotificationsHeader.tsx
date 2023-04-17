import { Button, Input, PageHeader, Select } from "antd";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import PrintIcon from "../../app/common/icons/PrintIcon";
import { PlusOutlined } from "@ant-design/icons";
import SelectInput from "../../app/common/form/proposal/SelectInput";
import { useNavigate } from "react-router-dom";
import { number } from "echarts";
import views from "../../app/util/view";
const { Search } = Input;
type NotificationsHeaderProps = {
  handleDownload: () => void;
  handlePrint: () => void;
  type: number,
  setType: React.Dispatch<React.SetStateAction<number>>,

};
const NotificationsHeader: FC<NotificationsHeaderProps> = ({
  handleDownload,
  handlePrint,
  type,
  setType
}) => {
  const navigate = useNavigate();
  return (
    <>
      <PageHeader
        ghost
        title={
          <HeaderTitle
            title={`Catálogo de ${type === 1 ? "notificaciones" : "avisos"}`}
            image="notifications"
          />
        }
        className="header-container"
        extra={[
/*           <DownloadIcon key="doc" onClick={handleDownload} />,
          <PrintIcon key="print" onClick={handlePrint} />, */
          <Search key="search" placeholder="Buscar" onSearch={(value) => {
            navigate(`/${views.notifications}?search=${value}`);
          }} />,
          <Select
            key="catalogo"
            showSearch
            placeholder="Catálogo"
            optionFilterProp="children"
            defaultValue={type}
            onChange={(e) => setType(e)}
            allowClear
            style={{ width: 180, textAlign: "left" }}

            options={[{ value: 1, label: "Notificaciones" }, { value: 2, label: "Avisos" }]}
          ></Select>,
          <Button
            key="new"
            type="primary"
            icon={<PlusOutlined />}
            disabled={type != 2}
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
