import { Button, PageHeader, Input } from "antd";
import React, { FC } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import views from "../../../app/util/view";
import PrintIcon from "../../../app/common/icons/PrintIcon";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";
type StudyFormHeaderProps = {
  handlePrint: () => void;
  handleList: () => void;
};
type UrlParams = {
  id: string;
};
const StudyFormHeader: FC<StudyFormHeaderProps> = ({
  handlePrint,
  handleList,
}) => {
  let { id } = useParams<UrlParams>();
  let navigate = useNavigate();
  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Catálogo Estudios" image="estudio" />}
      className="header-container"
      extra={[
        id ? <PrintIcon key="print" onClick={handlePrint} /> : "",
        id ? <DownloadIcon key="doc" onClick={handleList} /> : "",
        <GoBackIcon
          key="back"
          onClick={() => {
            navigate(`/${views.study}`);
          }}
        />,
      ]}
    ></PageHeader>
  );
};
export default StudyFormHeader;
