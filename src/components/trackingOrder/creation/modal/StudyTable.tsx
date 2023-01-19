import { Form, Row, Col, Button, Typography, Table } from "antd";
import { Fragment, useEffect, useState } from "react";
import TextInput from "../../../../app/common/form/TextInput";
import { SearchOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { store, useStore } from "../../../../app/stores/store";
import { observer } from "mobx-react-lite";
import {
  ISearch,
  IColumns,
  getDefaultColumnProps,
} from "../../../../app/common/table/utils";
import useWindowDimensions from "../../../../app/util/window";
import { VList } from "virtual-table-ant-design";
import { IEstudiosList, IRequestStudyOrder, searchstudies } from "../../../../app/models/trackingOrder";

const { Paragraph } = Typography;

type Props = {
  getResult: (isAdmin: boolean) => any;
  selectedStudys: IRequestStudyOrder[];
  solicitud:string;
};

const StudyTable = ({ getResult, selectedStudys,solicitud }: Props) => {
  const { trackingOrderStore } = useStore();

  const {RequestStudi,getStudiesByRequest}= trackingOrderStore;
  const [selectedRowKeysCheck, setSelectedRowKeysCheck] = useState<number[]>([]);
  const [data, setData]= useState<IRequestStudyOrder[]>([]);
  const { openModal, closeModal } = store.modalStore;
  const { width: windowWidth } = useWindowDimensions();
  const [loading, setLoading] = useState(false);
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  useEffect(() => {
    const readReagents = async () => {
      setLoading(true);
  
      let studies=  await RequestStudi(solicitud);
        setData(studies!);
        console.log(studies);
      setLoading(false);
    };
    readReagents();
  }, [RequestStudi]);


  const columns: IColumns<IRequestStudyOrder> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "10%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("estudio", "Estudio  ", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("Estatus", "Estatus", {
        searchState,
        setSearchState,
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("dias", "Dias", {
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
        width: "20%",
        minWidth: 150,
        windowSize: windowWidth,
      }),
    },
  ];




  const acceptChanges = async () => {

     let search:searchstudies = {
      estudios: selectedRowKeysCheck,
      solicitud:solicitud
     }
    await getStudiesByRequest(search);
    closeModal();
  };

  return (
    <Fragment>
      <Button type="primary"  style={{marginBottom:19,marginLeft:"94%"}} onClick={acceptChanges}>
        Agregar
      </Button>

      <Table<any>
        loading={loading}
        size="small"
        rowKey={(record) => record.id!}
        columns={columns}
        dataSource={[...data]}
        sticky
        className="header-expandable-table"
        scroll={{ y: "30vh", x: true }}
        components={VList({
          height: 500,
        })}
        rowSelection={{
          type: "checkbox",
          getCheckboxProps: (record: IRequestStudyOrder) => ({
            //disabled: record.estatusId != 8,
          }),
          onSelect: (selectedRow:IRequestStudyOrder, isSelected, a: any) => {
            let lista = [...selectedRowKeysCheck] 
           
            let study = lista.find(x=> x==selectedRow.id);
            if(study==undefined){
              lista.push(selectedRow.id);
              setSelectedRowKeysCheck(lista);
              
            }else{
              let listafitered=lista.filter(x=>x != selectedRow.id );
              setSelectedRowKeysCheck(listafitered);
            }
           
            
          },
          onChange: (
            selectedRowKeys: React.Key[],
            selectedRows: any,
            rowSelectedMethod: any
          ) => {
            if(rowSelectedMethod.type=="all"){
              
              let lista = [...selectedRowKeysCheck] 
              selectedRows.forEach((x:IRequestStudyOrder)=>{

                let study = lista.find(y=> y==x.id);
                if(study==undefined){
                  lista.push(x.id);
                  setSelectedRowKeysCheck(lista);
                  
                }
              });

              if(selectedRowKeys.length ==0){
                setSelectedRowKeysCheck([])
              }
            }
          },
          selectedRowKeys: selectedRowKeysCheck,
        }}
      />
    </Fragment>
  );
};

export default observer(StudyTable);
