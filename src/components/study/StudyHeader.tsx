import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import views from "../../app/util/view";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import PrintIcon from "../../app/common/icons/PrintIcon";

const { Search } = Input;
type StudyHeaderProps = {
  handlePrint: () => void;
  handleList: () => void;
};
const StudyHeader: FC<StudyHeaderProps> = ({ handlePrint, handleList }) => {
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo Estudios" image="estudio" />}
      className="header-container"
      extra={[
        <PrintIcon key="print" onClick={handlePrint} />,
        <DownloadIcon key="doc" onClick={handleList} />,
        <Search
          key="search"
          placeholder="Buscar"
          onSearch={(value) => {
            navigate(`/${views.study}?search=${value}`);
          }}
        />,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            navigate("new-study");
          }}
          icon={<PlusOutlined />}
        >
          Nuevo
        </Button>,
      ]}
    ></PageHeader>
  );
};
export default StudyHeader;
