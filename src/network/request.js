import axios from "axios"

axios.defaults.timeout = 5000
axios.defaults.baseURL = "http://localhost:8080"

// http请求的拦截器
axios.interceptors.request.use(config ->{
    "Content-Type":"application/json; charset=utf-8",
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"PUT, POST, GET, DELETE, OPTIONS",
    "Access-Control-Allow-Private-Network":true,
    "Authorization":JSON.parse(sessionStorage.getItem('token')) 
    return config
},error =>{
    // 写逻辑
    return error
})