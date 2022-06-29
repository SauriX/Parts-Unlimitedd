import { Empty, Select, Spin } from "antd";
import type { SelectProps } from "antd/es/select";
import debounce from "lodash/debounce";
import React, { useMemo, useRef, useState } from "react";
import { IOptions } from "../../models/shared";

interface DebounceSelectProps extends Omit<SelectProps<IOptions | IOptions[]>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<IOptions[]>;
  debounceTimeout?: number;
}

const DebounceSelect = ({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<IOptions[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" style={{ margin: "auto" }} /> : <Empty />}
      {...props}
      options={options}
    />
  );
};

export default DebounceSelect;
