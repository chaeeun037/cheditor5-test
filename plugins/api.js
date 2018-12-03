import Vue from 'vue'
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://127.0.0.1:7000',
  headers: {
    'Content-Type': 'application/json'
  }
})

Vue.use({
  install (Vue) {
    Vue.prototype.$api = this
  },
  file: {
    //create: model => request.post(`/`, model),
    create: model => request.post(`/`, model),
    //update: model => request.patch(`/company/${model.id}`, model),
    findAll: () => request.get(`/`),
    //delete: model => request.post(`/company/del`, model),
  },
})

request.interceptors.response.use((response) => {
  return response;
}, err => {
  if (err.response.status === 400) {
    return Promise.reject(err.response)
  } else {
    return Promise.reject(err);
  }
});
