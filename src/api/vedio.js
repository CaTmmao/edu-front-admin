import request from "@/utils/request";

// 接口前缀
const urlPrefix = 'service/video'

export default {

    /**
     * 根据ID删除小节
     * @param id 小节ID
     * @return {AxiosPromise} 是否删除成功
     */
    deleteVideoById(id) {

        return request({
            url: `${urlPrefix}/${id}`,
            method: 'delete'
        })
    },

    /**
     * 添加小节
     * @param data 小节信息
     * @return {AxiosPromise} 是否添加成功
     */
    addVideo(data) {

        return request({
            url: urlPrefix,
            data,
            method: 'post'
        })
    },

    /**
     * 更新小节
     * @param data 小节信息
     * @return {AxiosPromise} 是否更新成功
     */
    updateVideoById(data) {

        return request({
            url: `${urlPrefix}/${data.id}`,
            data,
            method: 'patch'
        })
    }
}
