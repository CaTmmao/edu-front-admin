import request from "@/utils/request";

export default {
    /**
     * 上传图片
     * @param file 图片
     * @return {AxiosPromise} 图片存在oss上的地址
     */
    uploadPhoto(file) {
        return request({
            url: 'oss/file',
            method: 'post',
            data: file
        })
    }
}
