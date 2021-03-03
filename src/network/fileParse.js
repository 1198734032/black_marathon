export function fileParse(file, type = "base64") {
    return new Promise(resolve => {
        let fileRead = new FileReader();//创建文件解析类实例
        if (type === "base64") {
            fileRead.readAsDataURL(file); //将文件转化为base64格式;这一步为异步操作
        } else if (type === "buffer") {
            fileRead.readAsArrayBuffer(file); //将文件转化为buffer格式;这一步为异步操作
        }
        fileRead.onload = ev => {
           resolve(ev.target.result) //ev.target.result这个为解析后的数据
        }
    })
}