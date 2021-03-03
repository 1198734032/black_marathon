import axios from 'axios'
//跨域访问需要发送cookie时一定要加
axios.defaults.withCredentials = true;

export function request(config){
    const instance = axios.create({
        // baseURL:'http://47.97.214.211/stu',
        baseURL:'/stu',
        // timeout:10000,
        headers:{
            'Content-Type':'application/json'
        }
    })
    
    return instance(config)
}