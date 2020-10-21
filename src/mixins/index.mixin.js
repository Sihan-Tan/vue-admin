/*
 * @Author: Tan Xuan
 * @Date: 2020-04-26 17:40:41
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-10-21 19:12:05
 * @Description: 列表页混入
 */

import {
  convertUrlObj
} from '@/utils/index'
export default {
  data() {
    return {
      tableKey: 0,
      hiddenOnlyOne: false,
      pageSizeList: [2, 5, 10, 20, 30, 50, 100, 300],
      pageLayout: 'total,prev, pager, next, sizes, jumper',
      listQuery: {
        page: 1,
        pageSize: 5
      },
      total: 0,
      list: [],
      isFilter: false,
      listLoading: false,
      city_list: [],
      city: [],
      multipleSelection: []
    }
  },
  methods: {
    // 改变页目条数
    handleSizeChange(size) {
      this.listQuery.pageSize = size
      this.getList()
    },
    // 改变当前页
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.getList()
    },
    // 筛选搜索
    handleFilter() {
      this.listQuery.page = 1
      console.log(this.listQuery)
      this.getList()
    },
    // 清除筛选条件
    handleClean() {
      const cPage = this.listQuery.page
      const pSize = this.listQuery.pageSize
      this.listQuery = {
        page: cPage,
        pageSize: pSize
      }
      this.selectTime = []
      this.city = []
    },
    // 获取多选项
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.getSelectionIds()
    },
    // 获取选中的id
    getSelectionIds() {
      if (this.multipleSelection.length) {
        const idsArr = this.getIDS()
        this.listQuery.ids = idsArr.join()
      } else {
        this.listQuery.ids = ''
      }
      console.log(this.listQuery.ids)
    },
    getIDS() {
      return this.multipleSelection.map(item => {
        return item.id
      })
    },
    // 清理参数
    cleanParams() {
      const data = {
        ...this.listQuery
      }
      console.log(data)
      if (data.ids) {
        return {
          ids: data.ids
        }
      } else {
        delete data.ids
        delete data.page
        delete data.pageSize
        return data
      }
    },
    // 执行下载
    execDownload(downloadPath) {
      const params = this.cleanParams()
      window.location.href = `${
        this.downloadUrl
      }${downloadPath}?${convertUrlObj(params)}`
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.listQuery) {
      const queryStr = JSON.stringify(this.listQuery)
      sessionStorage.setItem('queryStr', queryStr)
    }
    const toCode = to.meta.code
    const fromCode = from.meta.code
    const toNum = parseInt(toCode / 100)
    const fromNum = parseInt(fromCode / 100)
    if ((toNum !== fromNum) && !(toCode === 402 && fromCode === 1402)) {
      sessionStorage.removeItem('queryStr')
      console.log('clear pages')
      this.$store.commit('app/CLEAR_PAGES')
    }
    next()
  }
}
