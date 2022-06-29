import { Comment, List } from "antd";
import { FC, useEffect, useState } from "react";
import { IIndicationList } from "../../../app/models/indication";
import { IRequestPrice } from "../../../app/models/request";

type RequestIndicationProps = {
  data: IRequestPrice[];
};

const RequestIndication: FC<RequestIndicationProps> = ({ data }) => {
  // const data = [
  //   {
  //     id: 1,
  //     clave: "234234",
  //     clavePatologica: "Citología Hemática\nPresentarse en el laboratorio con ayuno de 5-10 horas",
  //     dias: 2,
  //   },
  //   {
  //     id: 2,
  //     clave: "234234",
  //     clavePatologica: "Citología Hemática\nPresentarse en el laboratorio con ayuno de 5-10 horas",
  //     dias: 2,
  //   },
  // ];
  const [indications, setIndications] = useState<IIndicationList[]>([]);

  useEffect(() => {
    const indications = data.flatMap((x) => x.indicaciones).filter((v, i, a) => a.indexOf(v) === i);
    setIndications(indications);
  }, [data]);

  return (
    <List
      className="request-indication-list"
      itemLayout="horizontal"
      dataSource={indications}
      renderItem={(item) => (
        <li>
          <Comment
            author={item.clave}
            content={item.descripcion}
            // datetime={item.dias === 1 ? "1 día" : `${item.dias} días`}
          />
        </li>
      )}
    />
  );
};

export default RequestIndication;