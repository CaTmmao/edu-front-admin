import request from '@/utils/request'

// 接口前缀
const urlPrefix = 'service/course'

export default {
    /**
     * 获取分页后的课程列表（可筛选条件）
     * @param pageNum 当前第几页，从 1 开始
     * @param pageSize 每页条数
     * @param data 筛选条件
     * @return {AxiosPromise} 课程列表
     */
    getCourseListWithPageAndCondition(pageNum, pageSize, data) {
        return request({
            url: `${urlPrefix}/list/condition?pageSize=${pageSize}&pageNum=${pageNum}`,
            method: 'post',
            data
        })
    },

    /**
     * 删除课程
     * @param id 课程ID
     * @return {AxiosPromise} 是否删除成功
     */
    deleteTeacherById(id) {
        return request({
            url: `${urlPrefix}/${id}`,
            method: 'delete'
        })
    },

    /**
     * 根据课程ID获取课程基本信息
     * @param id 课程ID
     * @return {AxiosPromise} 课程基本信息
     */
    getCourseBaseInfoById(id) {
        return request({
            url: `${urlPrefix}/${id}`,
            method: 'get'
        })
    },

    /**
     * 更新课程基本信息
     * @param id 课程ID
     * @param data 课程信息
     * @return {AxiosPromise} 是否成功
     */
    updateCourseBaseInfoById(id, data) {
        return request({
            url: `${urlPrefix}/${id}`,
            method: 'patch',
            data
        })
    },

    /**
     * 添加课程
     * @param data 课程信息
     * @return {AxiosPromise} 是否成功
     */
    addCourse(data) {
        return request({
            url: urlPrefix,
            method: 'post',
            data
        })
    }
}
