import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../app/stores/store";
import MassSearchForm from "../components/massResultSearch/MassSearchForm";
import MassSearchHeader from "../components/massResultSearch/MassSearchHeader";
import MassSearchTable from "../components/massResultSearch/MassSearchTable";

const handleDownload = async () => {};
const MassResultSearch = () => {
  const { massResultSearchStore } = useStore();
  const { results, area } = massResultSearchStore;
  useEffect(() => {
    console.log("Area info", area);
  }, [area]);
  return (
    <>
      <MassSearchHeader handleDownload={handleDownload} />
      <Divider className="header-divider" />
      <MassSearchForm />
      <Divider orientation="right">
        Area: {area.length > 0 ? area : "Sin selecccionar"} - Total de
        solicitudes: {results.length}
      </Divider>

      <MassSearchTable />
    </>
  );
};

export default observer(MassResultSearch);
