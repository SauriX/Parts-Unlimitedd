import { Button, Comment, List } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { IIndicationList } from "../../../../app/models/indication";
import { IStudyList } from "../../../../app/models/study";
import { useStore } from "../../../../app/stores/store";

const RequestIndication = () => {
  const { requestStore } = useStore();
  const { request, studies, packs, printIndications } = requestStore;

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

  const print = () => {
    if (!request) return;

    printIndications(request.expedienteId, request.solicitudId!);
  };

  return (
    <>
      <div style={{ textAlign: "right" }}>
        <Button onClick={print}>Imprimir</Button>
      </div>
      <List
        className="request-indication-list"
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
    </>
  );
};

export default observer(RequestIndication);
