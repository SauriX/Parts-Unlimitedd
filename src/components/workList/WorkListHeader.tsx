import { Button, PageHeader, Input } from "antd";
import { FC } from "react";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../../app/stores/store";
import views from "../../app/util/view";
import DownloadIcon from "../../app/common/icons/DownloadIcon";
import PrintIcon from "../../app/common/icons/PrintIcon";

const { Search } = Input;

const WorkListHeader = () => {
  // const { workListStore } = useStore();
  // const { scopes, getAll, exportList } = workListStore;

  const navigate = useNavigate();

  // const search = async (search: string | undefined) => {
  //   search = search === "" ? undefined : search;

  //   await getAll(search ?? "all");

  //   if (search) {
  //     searchParams.set("search", search);
  //   } else {
  //     searchParams.delete("search");
  //   }

  //   setSearchParams(searchParams);
  // };

  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          title="Lista de trabajo por Área (Análisis Clínicos)"
          image="reactivo"
        />
      }
      className="header-container"
    ></PageHeader>
  );
};

export default WorkListHeader;
