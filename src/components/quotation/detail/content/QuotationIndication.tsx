import { Comment, List } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { IIndicationList } from "../../../../app/models/indication";
import { IStudyList } from "../../../../app/models/study";
import { useStore } from "../../../../app/stores/store";

const QuotationIndication = () => {
  const { quotationStore } = useStore();
  const { studies, packs } = quotationStore;

  const [indications, setIndications] = useState<IIndicationList[]>([]);

  useEffect(() => {
    const totalStudies = [...studies, ...packs.flatMap((x) => x.estudios)];
    let totalIndications = totalStudies
      .flatMap((x) => x.indicaciones)
      .filter((v, i, a) => a.map((o) => o.id).indexOf(v.id) === i);

    totalIndications = totalIndications.map((x) => {
      const st = totalStudies
        .filter((s) => s.indicaciones.map((s) => s.id).includes(x.id))
        .filter(
          (v, i, a) => a.map((o) => o.estudioId).indexOf(v.estudioId) === i
        );

      return {
        ...x,
        dias: Math.max(...st.map((x) => x.dias)),
        estudios: st.map(
          (s) =>
            ({
              id: s.estudioId,
              clave: s.clave,
              nombre: s.nombre,
            } as IStudyList)
        ),
      };
    });

    setIndications(totalIndications);
  }, [packs, studies]);

  return (
    <List
      className="quotation-indication-list"
      itemLayout="horizontal"
      dataSource={indications}
      renderItem={(item) => (
        <li>
          <Comment
            author={
              item.clave +
              " (" +
              item.estudios.map((x) => x.clave).join(", ") +
              ")"
            }
            content={item.descripcion}
            datetime={item.dias === 1 ? "1 día" : `${item.dias} días`}
          />
        </li>
      )}
    />
  );
};

export default observer(QuotationIndication);
