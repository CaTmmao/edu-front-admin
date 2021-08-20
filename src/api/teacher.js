import request from '@/utils/request'

// 接口前缀
const urlPrefix = 'service/teacher'

export default {
    /**
     * 获取分页后的讲师列表（可筛选条件）
     * @param pageNum 当前第几页，从 1 开始
     * @param pageSize 每页条数
     * @param data 筛选条件
     * @return {AxiosPromise} 讲师列表
     */
    getTeachersListWithPageAndCondition(pageNum, pageSize, data) {
        return request({
            url: `${urlPrefix}/teachers/condition?pageSize=${pageSize}&pageNum=${pageNum}`,
            method: 'post',
            data
        })
    },

    /**
     * 获取所有讲师
     * @return {AxiosPromise} 所有讲师
     */
    getTeacherList() {
        return request({
            url: `${urlPrefix}/all`,
            method: 'get'
        })
    },

    /**
     * 删除讲师
     * @param id 讲师ID
     * @return {AxiosPromise} 是否删除成功
     */
    deleteTeacherById(id) {
        return request({
            url: `${urlPrefix}/${id}`,
            method: 'delete'
        })
    },

    /**
     * 更新讲师信息
     * @param id 讲师ID
     * @param data 讲师信息
     * @return {AxiosPromise} 是否成功
     */
    updateTeacherById(id, data) {
        return request({
            url: `${urlPrefix}/${id}`,
            method: 'patch',
            data
        })
    },

    /**
     * 添加讲师
     * @param data 讲师信息
     * @return {AxiosPromise} 是否成功
     */
    addTeacher(data) {
        return request({
            url: urlPrefix,
            method: 'post',
            data
        })
    }
}
