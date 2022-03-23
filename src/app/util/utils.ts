import messages from "./messages";

export const tokenName = "lab-ramos-token";

export const getErrors = (error: any) => {
  try {
    let errors = messages.systemError;
    if (error?.data?.errors && Object.keys.length > 0) {
      errors = Object.values(error.data.errors)
        .flat()
        .map((e) => e + "\n")
        .join("");
    } else {
      errors = error.message || error.statusText;
    }
    return errors;
  } catch (e) {
    console.log(e);
    return messages.systemError;
  }
};

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
