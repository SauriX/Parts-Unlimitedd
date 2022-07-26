import { FC, useState } from "react";
import IconButton from "../../app/common/button/IconButton";
import { IAppointmentList } from "../../app/models/appointmen";
import useWindowDimensions, { resizeWidth } from "../../app/util/window";
import { getDefaultColumnProps, IColumns, ISearch } from "../../app/common/table/utils";
import { PlusCircleOutlined, CalendarOutlined, CloseCircleOutlined, EditOutlined } from "@ant-design/icons";

import moment from "moment";
import { Table, Tooltip, Typography } from "antd";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { useNavigate, useSearchParams } from "react-router-dom";
import views from "../../app/util/view";
const { Link, Text } = Typography;

type TableProps = {
    status:number
   tipo:string
   citas: IAppointmentList[]
   
   SetCita: React.Dispatch<React.SetStateAction<IAppointmentList | undefined>>
   };
   const DemoTable:FC<TableProps> = ({status,tipo,citas,SetCita}) => {
    const navigate = useNavigate();
     const { width: windowWidth } = useWindowDimensions();
     const [searchParams, setSearchParams] = useSearchParams();
     
     const [searchState, setSearchState] = useState<ISearch>({
       searchedText: "",
       searchedColumn: "",
     });
   
     const columns: IColumns<any> = [
       {
         ...getDefaultColumnProps("noSolicitud", "Solicitud de cita", {
           searchState,
           setSearchState,
           width: "20%",
           minWidth: 150,
           windowSize: windowWidth,
         }),
         render: (value,item) => <Link draggable onDragStart={()=>{SetCita(item);}}>{value}</Link>,
       },
       {
        ...getDefaultColumnProps("expediente", "Expediente", {
          searchState,
          setSearchState,
          width: "20%",
          minWidth: 150,
          windowSize: windowWidth,
        }),
      },
       {
         ...getDefaultColumnProps("fecha", "Fecha", {
           searchState,
           setSearchState,
           width: "15%",
           minWidth: 150,
           windowSize: windowWidth,
         }),
         render: (value) => moment(value).format("DD/MM/YYYY HH:mm"),
       },
       {
         ...getDefaultColumnProps("direccion", "Dirección", {
           searchState,
           setSearchState,
           width: "20%",
           minWidth: 150,
           windowSize: windowWidth,
         }),
         render: (value) => (
           <Tooltip title={value}>
             <Text style={{ maxWidth: 180 }} ellipsis={true}>
               {value}
             </Text>
           </Tooltip>
         ),
       },
       {
         ...getDefaultColumnProps("nombre", "Nombre", {
           searchState,
           setSearchState,
           width: "20%",
           minWidth: 150,
           windowSize: windowWidth,
         }),
       },
       {
         ...getDefaultColumnProps("info", "Datos", {
           searchState,
           setSearchState,
           width: "15%",
           minWidth: 150,
           windowSize: windowWidth,
         }),
         render: (_, data) => <div>{`${data.edad} años, ${data.sexo.substring(0, 1)}`}</div>,
       },
       {
         key: "editar",
         dataIndex: "id",
         title: "Editar",
         align: "center",
         width: windowWidth < resizeWidth ? 100 : "10%",
         render: (value) => (
           <IconButton
             title="Editar reactivo"
             icon={<EditOutlined />}
             onClick={() => {
                navigate(`/${views.appointment}/${value}?type=${tipo}&mode=edit`);
             }}
           />
         ),
       },
     ];
   
     return (
       <Table<any>
         size="small"
         rowKey={(record) => record.noSolicitud}
         columns={columns}
         dataSource={/* [...citas].filter(x=>x.tipo==status) */citas}
         pagination={false}
         scroll={{ x: windowWidth < resizeWidth ? "max-content" : "auto" }}
       />
     );
   };
   export default observer(DemoTable);