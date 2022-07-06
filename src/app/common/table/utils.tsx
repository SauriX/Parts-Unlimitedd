import React from "react";
import { Button, Input, Space, TablePaginationConfig } from "antd";
import {
  ColumnGroupType,
  ColumnType,
  FilterConfirmProps,
  FilterDropdownProps,
} from "antd/lib/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { resizeWidth } from "../../util/window";

export const defaultPaginationProperties: TablePaginationConfig = {
  size: "small",
  pageSizeOptions: ["5", "10", "25", "50"],
  showSizeChanger: true,
};

let searchInput: any;

export interface ISearch {
  searchedText: string | React.Key;
  searchedColumn: string | number;
}

interface IColumn<RecordType> extends ColumnType<RecordType> {
  width: number | string;
  minWidth: number | string;
}

export declare type IColumns<RecordType = unknown> = (
  | ColumnGroupType<RecordType>
  | ColumnType<RecordType>
  | IColumn<RecordType>
)[];

const handleSearch = (
  selectedKeys: React.Key[],
  confirm: (param?: FilterConfirmProps | undefined) => void,
  dataIndex: any,
  setSearchState: React.Dispatch<React.SetStateAction<ISearch>>
) => {
  confirm();
  setSearchState({
    searchedText: selectedKeys[0],
    searchedColumn: dataIndex,
  });
};

const handleReset = (
  clearFilters: (() => void) | undefined,
  setSearchState: React.Dispatch<React.SetStateAction<ISearch>>
) => {
  if (clearFilters) clearFilters();
  setSearchState({ searchedText: "", searchedColumn: "" });
};

type ExtraProps = {
  width: number | string;
  searchState?: ISearch;
  setSearchState?: React.Dispatch<React.SetStateAction<ISearch>>;
  searchable?: boolean;
  windowSize?: number;
  minWidth?: number | string;
};

export const getDefaultColumnProps = (
  dataIndex: string,
  title: string,
  { searchState, setSearchState, searchable = true, width, minWidth, windowSize }: ExtraProps
): ColumnType<any> => ({
  key: dataIndex,
  dataIndex,
  title,
  filterDropdown:
    !searchable || !!!searchState || !!!setSearchState
      ? undefined
      : ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => {
          return (
            <div style={{ padding: 8 }}>
              <Input
                ref={(node) => {
                  searchInput = node;
                }}
                placeholder={`Buscar ${title}`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchState)}
                style={{ marginBottom: 8, display: "block" }}
              />
              <Space>
                <Button
                  type="primary"
                  onClick={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchState)}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90 }}
                >
                  Buscar
                </Button>
                <Button
                  onClick={() => handleReset(clearFilters, setSearchState)}
                  size="small"
                  style={{ width: 90 }}
                >
                  Limpiar
                </Button>
              </Space>
            </div>
          );
        },
  filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
  onFilter: (value: string | number | boolean, record: any) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value?.toString()?.toLowerCase())
      : "",
  onFilterDropdownVisibleChange: (visible: boolean) => {
    if (visible) {
      setTimeout(() => searchInput?.select(), 100);
    }
  },
  render: (value) =>
    searchState && searchState.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchState.searchedText?.toString()]}
        autoEscape
        textToHighlight={value ? value.toString() : ""}
      />
    ) : (
      value
    ),
  sorter: (a: any, b: any) => (a[dataIndex] > b[dataIndex] && 1) || -1,
  showSorterTooltip: false,
  width: width, //!minWidth ? width : (windowSize ?? resizeWidth) < resizeWidth ? minWidth : width,
});
