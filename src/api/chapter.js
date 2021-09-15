import request from '@/utils/request'

// 接口前缀
const urlPrefix = 'service/chapter'

export default {
    /**
     * 添加课程章节
     * @param data 课程章节
     * @return {AxiosPromise} 是否成功
     */
    addChapter(data) {
        return request({
            url: urlPrefix,
            method: 'post',
            data
        })
    },

    /**
     * 根据ID删除课程章节
     * @param id 章节ID
     * @return {AxiosPromise} 是否删除成功
     */
    deleteChapterById(id) {
        return request({
            url: `${urlPrefix}/${id}`,
            method: 'delete'
        })
    },

    /**
     * 更新课程章节
     * @param data 课程章节
     * @return {AxiosPromise} 是否成功
     */
    updateChapterById(data) {
        return request({
            url: `${urlPrefix}/${data.id}`,
            method: 'patch',
            data
        })
    },

    /**
     * 根据课程ID获取章节列表
     * @param courseId 课程ID
     * @return {AxiosPromise} 章节列表信息
     */
    getCourseChapterListByCourseId(courseId) {
        return request({
            url: `${urlPrefix}/list/${courseId}`,
            method: 'get'
        })
    }
}
