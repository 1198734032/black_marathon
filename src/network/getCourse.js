import { request } from "@/network/request.js"

export function getCourse() {
    return request({
        method: "get",
        url: "/aspirs",
    }) 
}