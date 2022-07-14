import axios, { AxiosResponse } from "axios";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { tokenName } from "../util/utils";

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem(tokenName);
    if (token) config.headers!.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, async (error) => {
  if (error.message === "Network Error" && !error.response) {
    throw new Error(messages.networkError);
  }

  const { status, headers } = error?.response;

  if (status === responses.unauthorized && headers["www-authenticate"]?.includes("The token expired")) {
    window.localStorage.removeItem(tokenName);
    history.push("/login");
    throw new Error(messages.login);
  }

  if (status === responses.unauthorized && headers["www-authenticate"]?.includes("invalid_token")) {
    window.localStorage.removeItem(tokenName);
    history.push("/login");
    throw new Error(messages.login);
  }

  if (status === responses.unauthorized && headers["www-authenticate"] === "Bearer") {
    window.localStorage.removeItem(tokenName);
    history.push("/login");
    throw new Error(messages.login);
  }

  if (status === responses.forbidden) {
    throw new Error(messages.forbidden);
  }

  if (status === responses.internalServerError) {
    throw new Error(messages.serverError);
  }

  if (error.response.request.responseType === "blob") {
    const text = await new Response(error.response.data).text();
    const json = JSON.parse(text);
    error.response.data = json;
  }

  throw error.response;
});

const responseBody = (response: AxiosResponse) => response?.data;

export const baseURL = process.env.REACT_APP_BASE_URL + "/api";

const requests = {
  get: (url: string) =>
    axios
      .get(url, {
        baseURL,
      })
      .then(responseBody),
  post: (url: string, data: {} | FormData) =>
    axios
      .post(url, data, {
        baseURL,
        headers:
          data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      })
      .then(responseBody),
  put: (url: string, data: {} | FormData) =>
    axios
      .put(url, data, {
        baseURL,
        headers:
          data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      })
      .then(responseBody),
  delete: (url: string) =>
    axios
      .delete(url, {
        baseURL,
      })
      .then(responseBody),
  download: (url: string, data?: Object | FormData) =>
    axios
      .post(url, data ?? {}, {
        baseURL,
        responseType: "blob",
        headers:
          {} instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;

        let name = "file.txt";

        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          if (contentDisposition.includes("filename*=UTF-8''")) {
            name = decodeURI(contentDisposition.split("filename*=UTF-8''")[1].split(";")[0]);
          }
        }

        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }),
  print: (url: string, data?: Object | FormData) =>
    axios
      .post(url, data ?? {}, {
        baseURL,
        responseType: "blob",
        headers:
          {} instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));

        let iframe = document.querySelector("iframe.printframe") as HTMLIFrameElement;

        if (!iframe) {
          iframe = document.createElement("iframe");
          iframe.classList.add("printframe");
        }

        iframe.style.display = "none";

        document.body.appendChild(iframe);

        iframe.onload = function () {
          setTimeout(function () {
            iframe.focus();
            iframe.contentWindow?.print();
            URL.revokeObjectURL(url);
          }, 1);
        };

        iframe.src = url;
      }),
  getFileUrl: (url: string, contentType: string, data?: Object | FormData) =>
    axios
      .post(url, data ?? {}, {
        baseURL,
        responseType: "blob",
        headers:
          {} instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" },
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));

        return url;
      }),
};

export default requests;
