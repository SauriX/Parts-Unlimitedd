import { Input, Table } from "antd";
import React, { useEffect, useState } from "react";
import { IColumns } from "./app/common/table/utils";

const data = [
  {
    Nombre: "PACIENTES",
    U200: 300,
    NOG: 50,
    MTY: 100,
  },
  {
    Nombre: "Ingresos",
    U200: 200,
    NOG: 75,
    MTY: 150,
  },
  {
    Nombre: "Costo Reactivo",
    U200: 200,
    NOG: 75,
    MTY: 150,
  },
];

const Test1 = () => {
  const [columns, setColumns] = useState<IColumns>([]);

  useEffect(() => {
    if (data.length > 0) {
      setColumns(
        Object.keys(data[0]).map((x) => ({
          key: x,
          dataIndex: x,
          title: x,
          render: (value, record: any) => {
            if (record.Nombre === "Costo Reactivo" && x !== "Nombre") {
              return (
                <Input
                  onChange={(e) => {
                    console.log(`${x} valor ${e.target.value}`);
                  }}
                />
              );
            }
            return value;
          },
        }))
      );
    }
  }, [data]);

  return <Table<any> columns={columns} dataSource={data} />;
};

export default Test1;
