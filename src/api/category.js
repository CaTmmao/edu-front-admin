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
    }
}
