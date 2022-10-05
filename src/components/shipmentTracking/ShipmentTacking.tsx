import { Button, Input, PageHeader } from "antd";
import { FC } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { useStore } from "../../app/stores/store";
import { PlusOutlined } from "@ant-design/icons";
import PrintIcon from "../../app/common/icons/PrintIcon";
import DownloadIcon from "../../app/common/icons/DownloadIcon";

const { Search } = Input;

type ShipmentTrackingProps = {
  handlePrint: () => void;
  handleDownload: () => Promise<void>;
};

const ShipmentTrackingHeader: FC<ShipmentTrackingProps> = ({
  handlePrint,
  handleDownload,
}) => {
  const { routeStore } = useStore();
  const { scopes, getAll } = routeStore;

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
 
  const search = async (search: string | undefined) => {
    search = search === "" ? undefined : search;

    await getAll(search ?? "all");

    if (search) {
      searchParams.set("search", search);
    } else {
      searchParams.delete("search");
    }

    setSearchParams(searchParams);
  };

  return (
    <PageHeader
      ghost={false}
      title={<HeaderTitle title="Detalle de seguimiento de envio" image="segruta" />}
      className="header-container"
      extra={[
        scopes?.imprimir && <PrintIcon key="print" onClick={handlePrint} />,
       
          <DownloadIcon key="doc" onClick={handleDownload} />
      

      ]}
    ></PageHeader>
  );
};

export default ShipmentTrackingHeader;
