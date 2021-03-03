import { request } from "@/network/request.js"

//展示所有当前科目的所有作业
export function showWork(aspir) {
    return request({
        method: "post",
        url: "/showwork",
        data:{
            aspir
        }
    }) 
}

//展示某一个作业中我的作业
export function showMyWork(data) {
    return request({
        method: "post",
        url: "/showmywork",
        data:{
            data
        }
    }) 
}

//删除作业
export function delMyWork(swork_id) {
    return request({
        method: "get",
        url: "/delete",
        params:{
            swork_id
        }
    }) 
}

