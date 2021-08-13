import request from '@/utils/request'

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
            url: `teacher/teachers/condition?pageSize=${pageSize}&pageNum=${pageNum}`,
            method: 'post',
            data
        })
    },

    /**
     * 删除讲师
     * @param id 讲师ID
     * @return {AxiosPromise} 是否删除成功
     */
    deleteTeacherById(id) {
        return request({
            url: `teacher/${id}`,
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
            url: `teacher/${id}`,
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
            url: 'teacher',
            method: 'post',
            data
        })
    },

    /**
     * 上传图片
     * @param file 图片
     * @return {AxiosPromise} 图片存在oss上的地址
     */
    uploadPhoto(file) {
        return request({
            url: 'oss/file',
            method: 'post',
            data: file,
            headers:{'Content-Type':'multipart/form-data'}
        })
    }

}
