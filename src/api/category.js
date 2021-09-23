import request from '@/utils/request'

// 接口前缀
const urlPrefix = 'service/category'

export default {
    /**
     * 获取包含子分类的分类列表
     * @return {AxiosPromise} 包含子分类的分类列表
     */
    getAllCategoryList() {
        return request({
            url: `${urlPrefix}/all`,
            method: 'get'
        })
    },

    /**
     * 根据分类ID获取分类信息
     * @param id 分类ID
     * @return {AxiosPromise} 分类信息
     */
    getCategoryById(id) {
        return request({
            url: `${urlPrefix}/${id}`,
            method: 'get'
        })
    },

    // 添加分类
    addCategory(data) {
        return request({
            url: urlPrefix,
            method: 'post',
            data
        })
    },

    // 删除分类
    deleteCategoryById(id) {
        return request({
            url: `${urlPrefix}/${id}`,
            method: 'delete'
        })
    },

    // 更新分类
    updateCategory(id, data) {
        return request({
            url: `${urlPrefix}/${id}`,
            method: 'patch',
            data
        })
    },
}
