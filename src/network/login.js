import { request } from "@/network/request.js"

export function login(data) {
    return request({
        method: "post",
        url: "/login",
        data:data
    }) 
}