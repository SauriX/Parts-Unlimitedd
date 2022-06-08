import { Button, Input, PageHeader } from "antd";
import { FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../app/common/button/ImageButton";
import HeaderTitle from "../../app/common/header/HeaderTitle";
import { useStore } from "../../app/stores/store";
import { PlusOutlined } from "@ant-design/icons";

const { Search } = Input;

type RouteHeaderProps = {
    handlePrint: () => void;
    handleDownload: () => Promise<void>;
};

const RouteHeader: FC<RouteHeaderProps> = ({ handlePrint, handleDownload }) => {
    const { routeStore } = useStore();
    const { scopes, getAll} = routeStore;

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const search = async (search: string | undefined) => {
        search = search === "" ? undefined : search;

        await getAll(search ?? "all");

        if (search) {
            searchParams.set("search", search);
        } else {
            searchParams.delete("search");
        }

        setSearchParams(searchParams);
    };

    return (
        <PageHeader
            ghost={false}
            title={<HeaderTitle title="Catálogo de Rutas" image="rutas" />}
            className="header-container"
            extra={[
                scopes?.imprimir && <ImageButton key="print" title="Imprimir" image="print" onClick={handlePrint} />,
                scopes?.descargar && <ImageButton key="doc" title="Informe" image="doc" onClick={handleDownload} />,
                <Search
                    key="search"
                    placeholder="Buscar"
                    defaultValue={searchParams.get("search") ?? ""}
                    onSearch={search}
                />,
                scopes?.crear && (
                    <Button
                        key="new"
                        type="primary"
                        onClick={() => {
                            navigate("new");
                        }}
                        icon={<PlusOutlined />}
                    >
                        Nuevo
                    </Button>
                ),
            ]}
        ></PageHeader>
    );
};

export default RouteHeader;
