import axios from "axios";

export const api = axios.create({
  baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local", //base URL
  withCredentials: true,
});
