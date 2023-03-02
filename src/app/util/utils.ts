import { RcFile, UploadChangeParam, UploadFile } from "antd/lib/upload";
import alerts from "./alerts";
import messages from "./messages";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { IGrouped } from "../models/shared";
import { toJS } from "mobx";

export const tokenName = process.env.REACT_APP_TOKEN_NAME!;

export const getErrors = (error: any) => {
  try {
    let errors = messages.systemError;
    if (error?.data?.errors) {
      if (typeof error.data.errors === "object") {
        errors = Object.values(error.data.errors).join(", ");
      } else {
        errors = error.data.errors;
      }
    } else {
      errors = error.message || error.statusText;
    }
    return errors;
  } catch (e) {
    console.log(e);
    return messages.systemError;
  }
};

export const moneyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const dataURItoBlob = async (dataURI: string) => {
  const data = await fetch(dataURI);
  const blob = await data.blob();

  return blob;
};

export const objectToFormData = (obj: any, rootName?: any) => {
  var formData = new FormData();

  const appendFormData = (data: any, root: any) => {
    root = root || "";
    if (data instanceof File) {
      if (root.endsWith("]")) {
        root = root.substring(0, root.lastIndexOf("["));
      }
      formData.append(root, data);
    } else if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        appendFormData(data[i], root + "[" + i + "]");
      }
    } else if (typeof data === "object" && data) {
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          if (root === "") {
            appendFormData(data[key], key);
          } else {
            appendFormData(data[key], root + "." + key);
          }
        }
      }
    } else {
      if (data !== null && typeof data !== "undefined") {
        formData.append(root, data);
      }
    }
  };

  appendFormData(obj, rootName);

  return formData;
};

export const validateEmail = (email: string) => {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const beforeUploadValidation = (
  file: RcFile,
  sizeMb: number = 2,
  types: string[] = ["image/jpeg", "image/png"]
) => {
  const isValidType = types.includes(file.type);
  if (!isValidType) {
    alerts.warning(
      `El tipo de archivo no es válido, debe ser ${types.join(", ")}`
    );
  }

  const isValidSize = file.size / 1024 / 1024 < sizeMb;
  if (!isValidSize) {
    alerts.warning(`El tamaño ha superado el limite de ${sizeMb}MB`);
  }

  return isValidType && isValidSize;
};

export const generateRandomHex = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters[Math.floor(Math.random() * charLength)];
  }

  return result;
};

export const getBase64 = (
  file: RcFile | File | Blob | undefined,
  callback: (url: string | ArrayBuffer | null) => void
) => {
  if (file) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(file);
  }
};

export const uploadFakeRequest = ({ onSuccess }: UploadRequestOption) => {
  setTimeout(() => {
    if (onSuccess) {
      onSuccess("ok");
    }
  }, 0);
};

type KeyFunc<T> = (obj: T) => string;
type KeyOrFunc<T> = keyof T | KeyFunc<T>;

export const groupBy = <T>(
  arr: T[],
  ...keys: KeyOrFunc<T>[]
): IGrouped<T>[] => {
  const groups: Map<string, T[]> = arr.reduce((map, obj) => {
    const groupKey = keys
      .map((key) =>
        typeof key === "string" ? obj[key] : (key as KeyFunc<T>)(obj)
      )
      .join(":");
    const group = map.get(groupKey) || [];
    group.push(toJS(obj));
    map.set(groupKey, group);
    return map;
  }, new Map<string, T[]>());

  const result: IGrouped<T>[] = [];
  groups.forEach((value, key) => {
    result.push({ key, items: value });
  });
  return result;
};

export const getDistinct = <T>(list: T[]): T[] => {
  const distinctValues = new Set<string>();
  const distinctObjects: T[] = [];

  for (let obj of list) {
    obj = toJS(obj);
    const jsonStr = JSON.stringify(obj);
    if (!distinctValues.has(jsonStr)) {
      distinctValues.add(jsonStr);
      distinctObjects.push(obj);
    }
  }

  return distinctObjects;
};

export const isEqualObject = <T extends Record<string, any>>(
  a: T,
  b: T
): boolean => {
  if (a === b) {
    return true;
  }

  if (
    a == null ||
    typeof a !== "object" ||
    b == null ||
    typeof b !== "object"
  ) {
    return false;
  }

  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) {
    return false;
  }

  for (const propName of aProps) {
    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  return true;
};

export const consoleColor = (msg: string, color: string) => {
  console.log(`%c${msg}`, `color: ${color}`);
};

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

export const guidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const imageFallback =
  "data:image/png;base64,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";

export const toolBarOptions = {
  options: [
    "inline",
    "blockType",
    "fontSize",
    "list",
    "textAlign",
    "colorPicker",
    "remove",
    "history",
  ],
  inline: {
    inDropdown: false,
    options: ["bold", "italic", "underline"],
  },
  blockType: {
    inDropdown: true,
    options: ["Normal", "H1", "H2", "H3"],
  },
  list: {
    inDropdown: false,
    options: ["unordered", "ordered"],
  },
  colorPicker: {
    colors: [
      "rgb(97,189,109)",
      "rgb(26,188,156)",
      "rgb(84,172,210)",
      "rgb(44,130,201)",
      "rgb(147,101,184)",
      "rgb(71,85,119)",
      "rgb(204,204,204)",
      "rgb(65,168,95)",
      "rgb(0,168,133)",
      "rgb(61,142,185)",
      "rgb(41,105,176)",
      "rgb(85,57,130)",
      "rgb(40,50,78)",
      "rgb(0,0,0)",
      "rgb(247,218,100)",
      "rgb(251,160,38)",
      "rgb(235,107,86)",
      "rgb(226,80,65)",
      "rgb(163,143,132)",
      "rgb(239,239,239)",
      "rgb(255,255,255)",
      "rgb(250,197,28)",
      "rgb(243,121,52)",
      "rgb(209,72,65)",
      "rgb(184,49,47)",
      "rgb(124,112,107)",
      "rgb(209,213,216)",
    ],
  },
};

export const shortCuts = [
  {
    title: "CONSULTA",
    shortCut: "CTRL + SHIFT + E",
    description: " CONSULTA DE EXPEDIENTE",
  },
  {
    title: "CREACIÓN",
    shortCut: "CTRL + SHIFT + X",
    description: " CREACIÓN DE EXPEDIENTE",
  },
  {
    title: "CONSULTA",
    shortCut: "CTRL + SHIFT + V",
    description: " NUEVA SOLICITUD (ENCONTRANDOSE EN DETALLE DE EXPEDIENTE)",
  },
  {
    title: "GUARDAR",
    shortCut: "CTRL + SHIFT + L",
    description:
      " GUARDAR (PARA TODAS LAS PANTALLAS QUE TENGAN LA OPCIÓN GUARDAR O FILTRAR)",
  },
  {
    title: "CONSULTA",
    shortCut: "CTRL + SHIFT + S",
    description: " CONSULTA DE SOLICITUDES",
  },
  {
    title: "CREACIÓN",
    shortCut: "CTRL + SHIFT + U",
    description: " CREACIÓN DE CITA",
  },
];
