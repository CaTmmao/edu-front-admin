import request from "@/utils/request";

export default {
    /**
     * 上传视频
     * @param file 文件
     * @return {AxiosPromise} 上传成功后阿里云生成的视频ID
     */
    uploadVideo(file) {
        return request({
            url: 'vod',
            method: 'post',
            data: file
        })
    }
}
