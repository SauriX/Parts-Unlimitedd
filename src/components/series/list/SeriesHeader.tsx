import { Button, PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import { seriesTypeOptions } from "../../../app/stores/optionStore";
import { useStore } from "../../../app/stores/store";

type SeriesHeaderProps = {
  handleList: () => void;
};

const SeriesHeader: FC<SeriesHeaderProps> = ({ handleList }) => {
  const { seriesStore } = useStore();
  const { seriesType, setSeriesType } = seriesStore;
  
  const navigate = useNavigate();

  const handleChange = (value: number) => {
    const selected = seriesTypeOptions.find((x) => x.value === value)?.value;

    if (selected) {
      setSeriesType(selected);
    } else {
      setSeriesType(0);
    }
  };

  return (
    <PageHeader
      ghost={false}
      title={
        <HeaderTitle
          title={`Catálogo de series de facturas y recibos`}
          image="sello"
        />
      }
      className="header-container"
      extra={[<DownloadIcon key="doc" onClick={handleList} />, 
          <SelectInput
            formProps={{
              name: "tipo",
              label: "",
            }}
            placeholder="Tipo de serie"
            onChange={handleChange}
            options={seriesTypeOptions}
          ></SelectInput>,
          <Button
            key="filter"
            type="primary"
            onClick={(e) => {
              navigate(`/series/new/${seriesType}`);
            }}
            icon={<PlusOutlined />}
            disabled={seriesType === 0}
          >
            Nuevo
          </Button>
        ]}
    ></PageHeader>
  );
};

export default observer(SeriesHeader);
