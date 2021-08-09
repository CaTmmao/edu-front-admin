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
    }
}
