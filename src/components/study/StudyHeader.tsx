import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import {  PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";


const { Search } = Input;
type StudyHeaderProps = {
  handlePrint: () => void;
  handleList:() => void;
};
const StudyHeader: FC<StudyHeaderProps> = ({ handlePrint,handleList }) => {
    let navigate = useNavigate();
    return (
      <PageHeader
        ghost={false}
        title={<HeaderTitle title="Catálogo Estudios" image="estudios" />}
        className="header-container"
        extra={[
          <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
          <ImageButton key="doc" title="Informe" image="doc" onClick={handleList }/>,
          <Search key="search" placeholder="Buscar" onSearch={(value) => {navigate(`/study?search=${value}`);}} />,
          <Button key="new" type="primary" onClick={() => {navigate("new-study");}} icon={<PlusOutlined />}>
            Nuevo
          </Button>,
        ]}
      ></PageHeader>
    );
}
export default StudyHeader;