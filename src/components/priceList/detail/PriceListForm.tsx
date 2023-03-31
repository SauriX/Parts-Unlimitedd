import {
  Spin,
  Form,
  Row,
  Col,
  Button,
  PageHeader,
  Divider,
  Table,
  Input,
  Checkbox,
  InputNumber,
  Tabs,
} from "antd";
import { VList } from "virtual-table-ant-design";
import React, { FC, Fragment, useEffect, useState } from "react";
import { formItemLayout } from "../../../app/util/utils";
import TextInput from "../../../app/common/form/proposal/TextInput";
import { useStore } from "../../../app/stores/store";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../app/common/button/ImageButton";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../app/util/view";
import {
  IPriceListEstudioList,
  IPriceListForm,
  ISucMedComList,
  PriceListFormValues,
} from "../../../app/models/priceList";
import SwitchInput from "../../../app/common/form/proposal/SwitchInput";
import alerts from "../../../app/util/alerts";
import messages from "../../../app/util/messages";
import useWindowDimensions, { resizeWidth } from "../../../app/util/window";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../app/common/table/utils";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import StudyTable from "./StudyTable";
import PackTable from "./PackTable";
import TabPane from "rc-tabs/lib/TabPanelList/TabPane";
import { IOptions } from "../../../app/models/shared";
import VirtualPriceListTable from "./VirtualPriceListTable";

const { Search } = Input;

type PriceListFormProps = {
  id: string;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
  download: boolean;
};

const PriceListForm: FC<PriceListFormProps> = ({
  id,
  componentRef,
  printing,
  download,
}) => {
  const { priceListStore, optionStore, modalStore } = useStore();
  const {
    priceLists,
    getById,
    create,
    update,
    getAllStudy,
    getAllBranch,
    getAllMedics,
    getAllCompany,
    getAllPack,
    studies,
    sucMedCom,
  } = priceListStore;
  const {
    getDepartmentOptions,
    departmentOptions,
    getAreaOptions: getareaOptions,
    areaOptions: areas,
  } = optionStore;
  const { openModal, closeModal } = modalStore;
  const [areaId, setAreaId] = useState<number>();
  const navigate = useNavigate();
  const [radioValue, setRadioValue] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [lista, setLista] = useState<IPriceListEstudioList[]>(studies);
  const [listaofstudyspacks, setListaofstudyspacks] =
    useState<IPriceListEstudioList[]>(studies);
  const [listSMC, setListSCM] = useState(sucMedCom);
  const [listSucursal, setListSucursal] = useState<any>();
  const [listMedicos, setListMedicos] = useState<any>();
  const [listCompañia, setListCompañia] = useState<any>();
  const [form] = Form.useForm<IPriceListForm>();
  const [loading, setLoading] = useState(false);
  const [depId, setDepId] = useState<number>();
  const [readonly, setReadonly] = useState(
    searchParams.get("mode") === "readonly"
  );

  const [activeKeyPane, setActiveKeyPane] = useState("1");
  const [departments, setDepartments] = useState<IOptions[]>([]);
  const [price, setPrice] = useState(0);
  const [aeraSearch, setAreaSearch] = useState(areas);
  const [values, setValues] = useState<IPriceListForm>(
    new PriceListFormValues()
  );
  const [sizeData, setSizeData] = useState({
    startIndex: 0,
    endIndex: 25,
  });

  useEffect(() => {
    departmentOptions.shift();
    setDepartments([...departmentOptions]);
  }, [departmentOptions]);

  useEffect(() => {
    const readtabla = async () => {
      let estudiostabla = await getAllStudy();

      let paquetestabla = await getAllPack();
      let tabla = [...estudiostabla!, ...paquetestabla!];

      setValues((prev) => ({ ...prev, table: tabla }));
      setLista(tabla);
      setListaofstudyspacks(tabla);
    };
    if (!id) {
      readtabla();
    }
  }, [getAllStudy, getAllPack]);

  useEffect(() => {
    getDepartmentOptions();
  }, [getDepartmentOptions]);

  useEffect(() => {
    const areareader = async () => {
      await getareaOptions(0);
    };
    areareader();
  }, [getareaOptions]);

  useEffect(() => {
    const readtable = async () => {
      const branches = await getAllBranch();
      const Companies = await getAllCompany();
      const medics = await getAllMedics();
      setListSucursal(branches);
      setListCompañia(Companies);
      setListMedicos(medics);
      if (!id) {
        setListSCM(branches);
        setRadioValue("branch");
      }
    };
    readtable();
  }, [getAllBranch, getAllCompany, getAllMedics]);

  const setStudy = (
    active: boolean,
    item: IPriceListEstudioList,
    typePAck: boolean,
    first: boolean = false,
    values: IPriceListForm
  ) => {
    if (item.precio == 0 && !typePAck) {
      alerts.warning("El estudio debe tener asignado un precio");
      return;
    }

    let estudiosSinPrecio: IPriceListEstudioList[] = [];

    if (!first) {
      if (active) {
        if (typePAck) {
          let estudiosPaquete = item.pack;
          let estudiosValidar: IPriceListEstudioList[] = [];

          estudiosPaquete?.forEach((x) => {
            var estudy = values.table!.find((y) => y.id === x.id && !y.paqute);

            estudiosValidar.push(estudy!);
          });

          estudiosValidar?.forEach((x) => {
            if (x.precio === 0 || x.activo === false) {
              estudiosSinPrecio.push(x);
            }
          });
          if (estudiosSinPrecio.length > 0) {
            openModal({
              title: "Estudios sin precio asignado",
              body: (
                <StudyTable data={estudiosSinPrecio} closeModal={closeModal} />
              ),
            });

            return;
          } else {
            var precio = 0;
            for (let i = 0; i < estudiosValidar.length; i++) {
              precio += estudiosValidar[i]!.precio!;
            }
            item.precio = precio;
            if (item.descuento == 0 || item.precioFinal == undefined) {
              item.precioFinal = precio;
            }
          }
        }
      }
    }

    var index = lista.findIndex(
      (x) => x.id === item.id && x.paqute === typePAck
    );
    var list = lista;
    item.activo = active;
    if (!active) {
      item.precio = 0;
      item.precioFinal = 0;
      item.descuenNum = 0;
      item.descuento = 0;
    }

    list[index] = item;
    setLista(list);

    var indexVal = values.table!.findIndex(
      (x) => x.id === item.id && x.paqute === typePAck
    );
    var val = values.table;

    val![indexVal] = item;

    setValues((prev) => ({ ...prev, table: val }));
  };

  const setSucMedCom = (active: boolean, item: ISucMedComList) => {
    var index = listSMC.findIndex((x) => x.id === item.id);
    var list = listSMC;
    item.activo = active;
    list[index] = item;
    setListSCM(list);
    var indexVal = values.sucMedCom.findIndex((x) => x.id === item.id);
    var val = values.sucMedCom;
    val[indexVal] = item;
    setValues((prev) => ({ ...prev, sucMedCom: val }));
  };

  const setStudyPrice = (
    newprecio: number,
    item: IPriceListEstudioList,
    typePAck: boolean
  ) => {
    if (newprecio < 0) {
      alerts.warning("El Precio tiene que ser mayor a 0");
      newprecio = 0;
    }
    var index = lista.findIndex(
      (x) => x.id === item.id && x.paqute === typePAck
    );
    var list = lista;
    //here
    item.precio = newprecio;

    if (newprecio == 0) {
      item.activo = false;
    }
    list[index] = item;
    var indexVal = values.table!.findIndex(
      (x) => x.id === item.id && x.paqute === typePAck
    );

    var val = values.table!;
    val[indexVal] = item;
    if (!typePAck) {
      var paquetes = values.table!.filter((x) => x.paqute == true);
      var paquetesestudy = paquetes
        .filter((x) => x.pack?.filter((x) => x.id == item.id).length! > 0)
        .filter((x) => x.activo);
      if (paquetesestudy.length > 0) {
        paquetesestudy.forEach((x) =>
          setStudy(x.activo!, x, x.paqute!, false, values)
        );
      }
    }
    setValues((prev) => ({ ...prev, table: val }));
  };

  // red user 146
  useEffect(() => {
    const readuser = async (idUser: string) => {
      setLoading(true);
      const user = await getById(idUser);

      var studis = await getAllStudy();
      var pcks = await getAllPack();
      // pcks = pcks?.filter((x) => x.activo);

      var tabla = [...studis!, ...pcks!];

      const branches = await getAllBranch();
      const Companies = await getAllCompany();
      const medics = await getAllMedics();
      if (user!.paquete) {
        user!.paquete = user!.paquete.map((x) => {
          x.paqute = true;
          return x;
        });
      }

      var listatabla = user?.estudios.concat(user?.paquete);
      user!.table = listatabla?.filter((x) => x != null);
      var studys = user!.table!;
      user!.table = tabla;
      user!.sucMedCom = user!.sucursales;
      setValues(user!);
      form.setFieldsValue(user!);

      setLista(tabla);
      setListaofstudyspacks(tabla);

      setListSucursal(branches);
      setListCompañia(Companies);
      setListMedicos(medics);

      studys.forEach((x) => {
        setStudy(x.activo!, x, x.paqute!, true, user!);
      });
      user?.sucursales.map((x) => setSucursalesList(x.activo!, x, branches));
      user?.compañia.map((x) => setCompañiasList(x.activo!, x, Companies));
      user?.medicos.map((x) => setMedicosList(x.activo!, x, medics));

      setListSCM(user!.sucursales!.length <= 0 ? branches! : user!.sucursales);
      setRadioValue("branch");

      setLoading(false);
    };
    if (id) {
      readuser(String(id));
    }
  }, [
    getById,
    id,
    getAllBranch,
    getAllCompany,
    getAllMedics,
    getAllPack,
    getAllStudy,
  ]);

  const goBack = () => {
    searchParams.delete("mode");
    setSearchParams(searchParams);
    navigate(`/${views.price}?${searchParams}`);
  };

  const setEditMode = () => {
    navigate(`/${views.price}/${id}?${searchParams}&mode=edit`);
    setReadonly(false);
  };

  const setSucursalesList = (
    active: boolean,
    item: ISucMedComList,
    lists: ISucMedComList[]
  ) => {
    var index = lists.findIndex((x: ISucMedComList) => x.id === item.id);
    var list = lists;
    item.activo = active;
    list[index] = item;
    setListSucursal(list);
  };
  const setMedicosList = (
    active: boolean,
    item: ISucMedComList,
    lists: ISucMedComList[]
  ) => {
    var index = lists.findIndex((x: ISucMedComList) => x.id === item.id);
    var list = lists;
    item.activo = active;
    list[index] = item;
    setListMedicos(list);
  };
  const setCompañiasList = (
    active: boolean,
    item: ISucMedComList,
    lists: ISucMedComList[]
  ) => {
    var index = lists.findIndex((x: ISucMedComList) => x.id === item.id);
    var list = lists;
    item.activo = active;
    list[index] = item;
    setListCompañia(list);
  };

  const { width: windowWidth } = useWindowDimensions();
  const [searchState, setSearchState] = useState<ISearch>({
    searchedText: "",
    searchedColumn: "",
  });

  const columns: IColumns<ISucMedComList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "10%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "10%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("listaPrecio", "Lista de precios", {
        searchState,
        setSearchState,
        width: "10%",
        windowSize: windowWidth,
      }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Añadir",
      align: "center",
      width: windowWidth < resizeWidth ? 100 : "10%",
      //Aqui es lo mismo que con el estudio
      //Pero no vinculado al setstudy
      render: (value, item) => (
        <Checkbox
          name="activo"
          checked={item.activo}
          disabled={readonly}
          onChange={(value) => {
            var active = false;
            if (value.target.checked) {
              active = true;
            }

            setSucMedCom(active, item);
          }}
        />
      ),
    },
  ];

  const onValuesChange = async (changedValues: any) => {
    const field = Object.keys(changedValues)[0];
    if (field === "idDepartamento") {
      form.setFieldsValue({ idArea: undefined });
    }
    if (field) {
    }
  };

  const filterByDepartament = async (departament: number) => {
    if (departament) {
      var departamento = departmentOptions.filter(
        (x) => x.value === departament
      )[0].label;
      var areaSearch = await getareaOptions(departament);

      var estudios = listaofstudyspacks.filter(
        (x) => x.departamento === departamento
      );

      setValues((prev) => ({ ...prev, table: estudios }));
      setAreaSearch(areaSearch!);
    } else {
      estudios = listaofstudyspacks;
      if (estudios.length <= 0) {
        estudios = listaofstudyspacks;
      }
      setValues((prev) => ({ ...prev, table: estudios }));
    }
  };
  const filterByArea = (area?: number) => {
    if (area) {
      var areaActive = areas.filter((x) => x.value === area)[0].label;
      var estudios = listaofstudyspacks.filter((x) => x.area === areaActive);
      setValues((prev) => ({ ...prev, table: estudios }));
    } else {
      const dep = departmentOptions.find((x) => x.value === depId)?.label;
      estudios = listaofstudyspacks.filter((x) => x.departamento === dep);
      setValues((prev) => ({ ...prev, table: estudios }));
    }
  };
  const filterBySearch = (search: string) => {
    if (search != null && search != "") {
      var estudios = listaofstudyspacks.filter(
        (x) =>
          x.clave.toUpperCase().includes(search.toUpperCase()) ||
          x.nombre.toUpperCase().includes(search.toUpperCase())
      );
      if (estudios.length <= 0) {
        estudios = [];
      }

      setValues((prev) => ({ ...prev, table: estudios }));
      return;
    } else {
      listaofstudyspacks?.filter((x) => x.paqute);
      setValues((prev) => ({ ...prev, table: listaofstudyspacks }));
    }
  };

  const onFinish = async (newValues: IPriceListForm) => {
    setLoading(true);

    const priceList = { ...values, ...newValues };

    priceList.promocion = [];
    //priceList.estudios = lista;
    priceList.sucursales = listSucursal.filter(
      (x: ISucMedComList) => x.activo == true
    );
    priceList.compañia = listCompañia.filter(
      (x: ISucMedComList) => x.activo == true
    );
    priceList.medicos = listMedicos.filter(
      (x: ISucMedComList) => x.activo == true
    );

    priceList.estudios = listaofstudyspacks.filter(
      (x) => x.activo === true && (x.paqute === false || !x.paqute)
    );
    priceList.paquete = listaofstudyspacks.filter(
      (x) => x.activo && x.paqute === true
    );
    var countFailPricesE = 0;

    values.estudios!.forEach((x) => {
      if (x.precio == 0) {
        countFailPricesE++;
      }
    });
    if (countFailPricesE > 0) {
      alerts.warning("El precio  debe ser mayor a 0");
      setLoading(false);
      return;
    }
    var countFailPricesP = 0;
    values.paquete!.forEach((x) => {
      if (x.precioFinal == 0) {
        countFailPricesP++;
      }
    });
    if (countFailPricesP > 0) {
      alerts.warning("El precio  debe ser mayor a 0");
      setLoading(false);
      return;
    }
    let estudiosSinPrecio: IPriceListEstudioList[] = [];
    values.paquete.forEach((x) => {
      let estudiosPaquete = x.pack;

      let estudiosValidar: IPriceListEstudioList[] = [];

      estudiosPaquete?.forEach((x) => {
        var estudy = values.estudios!.find((y) => y.id === x.id && !y.paqute);

        estudiosValidar.push(estudy!);
      });

      estudiosValidar?.forEach((x) => {
        if (x.precio === 0 || x.activo === false) {
          estudiosSinPrecio.push(x);
        }
      });
    });
    if (estudiosSinPrecio.length > 0) {
      openModal({
        title: "Estudios sin precio asignado",
        body: <StudyTable data={estudiosSinPrecio} closeModal={closeModal} />,
      });
      setLoading(false);
      return;
    }
    var paquetesSindescuento: IPriceListEstudioList[] = [];
    values.paquete.forEach((element) => {
      if (element.descuento === 0 || element.descuento === undefined) {
        paquetesSindescuento.push(element);
      }
    });

    if (paquetesSindescuento.length > 0) {
      openModal({
        title: "Paquetes sin descuento asignado",

        body: (
          <PackTable
            data={paquetesSindescuento}
            closeModal={closeModal}
            handle={async () => {
              let success = false;
              if (!priceList.id) {
                success = await create(priceList);
              } else {
                success = await update(priceList);
              }

              setLoading(false);

              if (success) {
                goBack();
              }
            }}
          />
        ),
        onClose() {
          setLoading(false);
        },
      });
    } else {
      let success = false;
      if (!priceList.id) {
        success = await create(priceList);
      } else {
        success = await update(priceList);
      }

      setLoading(false);

      if (success) {
        goBack();
      }
    }
  };

  ///tabla Estudios/paquete

  const studyPriceListColumns: IColumns<IPriceListEstudioList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: 100,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: 100,
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("precio", "Precio", {
        searchState,
        setSearchState,
        width: 150,
        windowSize: windowWidth,
      }),
      render: (value, item) => (
        <InputNumber
          type={"number"}
          precision={2}
          min={0}
          disabled={readonly}
          value={item.precio}
          onChange={(value) => {
            setStudyPrice(value ?? 0, item, item.paqute!);
            setPrice(value ?? 0);
          }}
        ></InputNumber>
      ),
    },
    {
      ...getDefaultColumnProps("area", "Área", {
        searchState,
        setSearchState,
        width: 100,
        windowSize: windowWidth,
      }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Añadir",
      align: "center",
      width: 100 /*windowWidth < resizeWidth ? 100 : "10%"*/,
      render: (value, item) => (
        <Checkbox
          name="activo"
          disabled={readonly}
          checked={item.activo}
          onChange={(value1) => {
            var active = false;
            if (value1.target.checked) {
              active = true;
            }

            setStudy(active, item, item.paqute!, false, values!);
          }}
        />
      ),
    },
  ];

  const setStudydiscuntc = (
    decuento: number,
    item: IPriceListEstudioList,
    type: boolean
  ) => {
    var index = values.table!.findIndex(
      (x) => x.id === item.id && x.paqute === type
    );
    var list = values.table!;
    item.descuento = (100 * decuento) / item.precio!;
    item.descuenNum = decuento;
    item.precioFinal = item.precio! - decuento;
    list[index] = item;
    // setLista(list);
    var indexVal = values.table!.findIndex(
      (x) => x.id === item.id && x.paqute === type
    );
    var val = values.table!;
    val[indexVal] = item;
    setValues((prev) => ({ ...prev, table: val }));
  };

  const setStudydiscunt = (
    decuento: number,
    item: IPriceListEstudioList,
    type: boolean
  ) => {
    var index = values.table!.findIndex(
      (x) => x.id === item.id && x.paqute === type
    );
    var list = values.table!;
    item.descuento = decuento;
    item.descuenNum = (item.precio! * decuento) / 100;
    item.precioFinal = item.precio! - item.descuenNum;
    list[index] = item;
    // setLista(list);
    var indexVal = values.table!.findIndex(
      (x) => x.id == item.id && x.paqute === type
    );
    var val = values.table!;
    val[indexVal] = item;
    setValues((prev) => ({ ...prev, estudio: val }));
  };

  const setStudyPricefinal = (
    preciofinal: number,
    item: IPriceListEstudioList,
    type: boolean
  ) => {
    var index = values.table!.findIndex(
      (x) => x.id == item.id && x.paqute === type
    );
    var list = values.table!;
    item.descuento = (100 * preciofinal) / item.precio!;
    var decuento = (100 * preciofinal) / item.precio!;
    item.descuenNum = (item.precio! * decuento) / 100;
    item.precioFinal = preciofinal;
    list[index] = item;
    // setLista(list);
    var indexVal = values.table!.findIndex(
      (x) => x.id == item.id && x.paqute === type
    );
    var val = values.table!;
    val[indexVal] = item;
    setValues((prev) => ({ ...prev, estudio: val }));
  };

  //tabla paquietes
  const packPriceListColumns: IColumns<IPriceListEstudioList> = [
    {
      ...getDefaultColumnProps("clave", "Clave", {
        searchState,
        setSearchState,
        width: "10%",
        windowSize: windowWidth,
      }),
    },
    {
      ...getDefaultColumnProps("nombre", "Nombre", {
        searchState,
        setSearchState,
        width: "30%",
        windowSize: windowWidth,
      }),
    },
    {
      key: "editarp",
      dataIndex: "id",
      title: "Desc %",
      align: "center",
      width: "10%",
      render: (value, item) => (
        <InputNumber
          type={"number"}
          precision={2}
          readOnly={item.precio == 0}
          disabled={readonly}
          min={0}
          value={item.descuento}
          onChange={(value) => setStudydiscunt(value ?? 0, item, item.paqute!)}
        ></InputNumber>
      ),
    },
    {
      key: "editarc",
      dataIndex: "id",
      title: "Desc cantidad",
      align: "center",
      width: "10%",
      render: (value, item) => (
        <InputNumber
          type={"number"}
          precision={2}
          min={0}
          max={price}
          readOnly={item.precio == 0}
          disabled={readonly}
          value={item.descuenNum}
          onChange={(value) => setStudydiscuntc(value ?? 0, item, item.paqute!)}
        ></InputNumber>
      ),
    },
    {
      key: "editarc",
      dataIndex: "id",
      title: "Precio final",
      align: "center",
      width: "10%",
      render: (value, item) => (
        <InputNumber
          type={"number"}
          precision={2}
          min={0}
          readOnly={true}
          value={item.precioFinal}
          disabled={readonly}
          onChange={(value) =>
            setStudyPricefinal(value ?? 0, item, item.paqute!)
          }
        ></InputNumber>
      ),
    },
    {
      ...getDefaultColumnProps("precio", "Precio", {
        searchState,
        setSearchState,
        width: "10%",
        windowSize: windowWidth,
      }),
      render: (value, item) => (
        <InputNumber
          type={"number"}
          precision={2}
          min={0}
          value={item.precio}
          disabled={readonly}
          onChange={(value) => {
            setStudyPrice(value ?? 0, item, item.paqute!);
            setPrice(value ?? 0);
          }}
          readOnly={true}
        ></InputNumber>
      ),
    },
    {
      ...getDefaultColumnProps("area", "Área", {
        searchState,
        setSearchState,
        width: "10%",
        windowSize: windowWidth,
      }),
    },
    {
      key: "editar",
      dataIndex: "id",
      title: "Añadir",
      align: "center",
      width: "10%",
      render: (value, item) => (
        <Checkbox
          name="activo"
          checked={item.activo}
          disabled={readonly}
          onChange={(value1) => {
            var active = false;
            if (value1.target.checked) {
              active = true;
            }

            setStudy(active, item, item.paqute!, false, values!);
          }}
        />
      ),
    },
  ];

  const studyPriceListData = values.table?.filter((x) => !x.paqute) ?? [];
  const packPriceListData = values.table?.filter((x) => x.paqute) ?? [];

  return (
    <Spin
      spinning={loading || printing || download}
      tip={printing ? "Imprimiendo" : download ? "descargando" : ""}
    >
      <Row style={{ marginBottom: 24 }}>
        {!readonly && (
          <Col md={24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <Button onClick={goBack}>Cancelar</Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                form.submit();
              }}
            >
              Guardar
            </Button>
          </Col>
        )}
        {readonly && (
          <Col md={24} sm={24} xs={12} style={{ textAlign: "right" }}>
            <ImageButton
              key="edit"
              title="Editar"
              image="editar"
              onClick={setEditMode}
            />
          </Col>
        )}
      </Row>
      <div style={{ display: printing ? "none" : "" }}>
        <div ref={componentRef}>
          {printing && (
            <PageHeader
              ghost={false}
              title={
                <HeaderTitle
                  title="Catálogo de Lista de Precios"
                  image="precio"
                />
              }
              className="header-container"
            ></PageHeader>
          )}
          {printing && <Divider className="header-divider" />}
          <Form<IPriceListForm>
            {...formItemLayout}
            form={form}
            name="priceList"
            initialValues={values}
            onFinish={onFinish}
            scrollToFirstError
            onValuesChange={onValuesChange}
          >
            <Row>
              <Col span={24}>
                <Row
                  justify={printing ? "end" : "space-between"}
                  gutter={[24, 24]}
                >
                  <Col span={12}>
                    <TextInput
                      formProps={{
                        name: "clave",
                        label: "Clave",
                      }}
                      max={100}
                      required
                      readonly={readonly}
                    />
                  </Col>
                  <Col span={12}>
                    <SwitchInput
                      name="activo"
                      onChange={(value) => {
                        if (value) {
                          alerts.info(messages.confirmations.enable);
                        } else {
                          alerts.info(messages.confirmations.disable);
                        }
                      }}
                      label="Activo"
                      readonly={readonly}
                    />
                  </Col>
                  <Col span={12}>
                    <TextInput
                      formProps={{
                        name: "nombre",
                        label: "Nombre",
                      }}
                      max={100}
                      required
                      readonly={readonly}
                    />
                  </Col>
                  <Col span={12}>
                    <SwitchInput
                      name="visibilidad"
                      onChange={(value) => {
                        if (value) {
                          alerts.info(messages.confirmations.visible);
                        } else {
                          alerts.info(messages.confirmations.visibleweb);
                        }
                      }}
                      label="Visible"
                      readonly={readonly}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
          <Row justify={printing ? "center" : "end"} gutter={[12, 24]}>
            <Col span={printing ? 24 : 12}>
              <Divider orientation="left">Compañias</Divider>
              <Table<ISucMedComList>
                size={printing ? "small" : "large"}
                rowKey={(record) => record.id}
                columns={printing ? columns.slice(0, 4) : columns}
                dataSource={listCompañia}
                scroll={{
                  x: windowWidth < resizeWidth ? "max-content" : "auto",
                }}
              />
            </Col>
            <Col span={printing ? 24 : 12}>
              <Divider orientation="left">Sucursales</Divider>
              <Table<ISucMedComList>
                size={printing ? "small" : "large"}
                rowKey={(record) => record.id}
                columns={printing ? columns.slice(0, 4) : columns}
                dataSource={listSucursal}
                scroll={{
                  x: windowWidth < resizeWidth ? "max-content" : "auto",
                }}
              />
            </Col>
          </Row>

          <Divider orientation="left">ESTUDIOS Y PAQUETE</Divider>
          <Row
            justify="space-between"
            align="middle"
            gutter={printing ? [24, 24] : 0}
          >
            <Col span={printing ? 8 : 6}>
              <Search
                key="search"
                placeholder="Buscar"
                onSearch={(value) => {
                  filterBySearch(value);
                }}
                allowClear
              />
            </Col>
            {activeKeyPane === "1" ? (
              <Fragment>
                <Col span={printing ? 8 : 6} offset={printing ? 0 : 2}>
                  <SelectInput
                    options={departments}
                    onChange={(value) => {
                      setAreaId(undefined);
                      setDepId(value);
                      filterByDepartament(value);
                    }}
                    value={depId}
                    placeholder={"Departamentos"}
                    formProps={{
                      name: "departamentos",
                      label: "Departamento",
                    }}
                  />
                </Col>
                <Col span={printing ? 8 : 6} offset={printing ? 0 : 2}>
                  <SelectInput
                    options={aeraSearch}
                    onChange={(value) => {
                      setAreaId(value);
                      filterByArea(value);
                    }}
                    value={areaId || undefined}
                    placeholder={"Área"}
                    formProps={{
                      label: "Área",
                    }}
                  />
                </Col>
              </Fragment>
            ) : (
              ""
            )}
          </Row>
          <br />

          <Tabs
            defaultActiveKey="1"
            onChange={(x) => {
              setActiveKeyPane(x);
            }}
          >
            <TabPane tab="Estudios" key="1">
              <VirtualPriceListTable
                size="small"
                dataSource={studyPriceListData}
                rowKey={(record) => record.id}
                columns={
                  printing
                    ? studyPriceListColumns.slice(0, 4)
                    : studyPriceListColumns
                }
                pagination={false}
              />
            </TabPane>
            <TabPane tab="Paquetes" key="2">
              <VirtualPriceListTable
                size="small"
                dataSource={packPriceListData}
                rowKey={(record) => record.id}
                columns={
                  printing
                    ? packPriceListColumns.slice(0, 4)
                    : packPriceListColumns
                }
                pagination={false}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Spin>
  );
};

export default observer(PriceListForm);
