import { Spin } from "antd";
import { observer } from "mobx-react-lite";
import { Fragment, useState } from "react";
import { useStore } from "../../app/stores/store";
import ClinicResultsColumns, {
  ClinicResultsExpandable,
} from "./columnDefinition/clinicResults";
import ClinicResultsFilter from "./ClinicResultsFilter";
import ClinicResultsTable from "./ClinicResultsTable";
import { IGeneralForm } from "../../app/models/general";

type CRDefaultProps = {
  printing: boolean;
  formValues: IGeneralForm;
};

const ClinicResultsBody = ({ printing, formValues }: CRDefaultProps) => {
  const { clinicResultsStore } = useStore();
  const { data } = clinicResultsStore;
  const [loading, setLoading] = useState(false);

  return (
    <Fragment>
      <ClinicResultsFilter />
      <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
        <ClinicResultsTable
          data={data}
          columns={ClinicResultsColumns()}
          expandable={ClinicResultsExpandable()}
        />
      </Spin>
    </Fragment>
  );
};

export default observer(ClinicResultsBody);
