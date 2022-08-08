import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";

const { Search } = Input;
type UserHeaderProps = {
  handleList: () => void;
};
const  SampleHeader: FC<UserHeaderProps> = ({  handleList}) => {
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title={`Registrar Toma de Muestra`} image="sampling" />}
      className="header-container"
      extra={[
        <ImageButton key="doc" title="Informe" image="doc" onClick={handleList} />,
      ]}
    ></PageHeader>
  );
};

export default observer(SampleHeader);
