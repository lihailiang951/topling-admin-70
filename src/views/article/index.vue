
<template>
  <div>
       <!-- 数据筛选 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>数据筛选</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <el-form ref="form" :model="filterParams" label-width="80px">
        <el-form-item label="状态">
          <el-radio-group v-model="filterParams.status">
            <el-radio label="">全部</el-radio>
            <el-radio
              v-for="(item, index) in statTypes"
              :key="item.label"
              :label="index"
            >{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="filterParams.channel_id" placeholder="请选择活动区域">
            <el-option
            v-for="item in channels"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="range_date"
            @change="handleDateChange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleFilter"
            :loading="articleLoading"
            >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 数据筛选 -->

       <!-- 文章列表 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>一共有<strong>{{ totalCount }}</strong>条数据</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <!--
        talbel 表格不需要我们自己去手动 v-for 遍历
        你只需要将数组数据交给 table 表格的 data 属性就可以了
        然后配置 el-table-column 表格列组件即可
          label 列头标题
          prop  遍历项中的数据字段
          width 列宽
        表格默认把数据当做文本去输出
        如果需要其他数据格式，则可以自定义表格列
       -->
      <el-table
        class="article-list"
        :data="articles"
        style="width: 100%"
        v-loading="articleLoading">
        <el-table-column
          label="封面"
          width="180">
          <!--
            template 中的内容就是自定义表格列内容
            如果需要在 template 中访问遍历项数据，则需要给 template 配置 slot-scope="scope"
              slot-scope 属性名是固定的
              scope 值是自己随便起的名字
            结果就是：我们可以通过 scope.row 访问到当前遍历项对象，就好比我们遍历中的 item 一样
           -->
          <template slot-scope="scope">
            <img
              width="20"
              v-for="item in scope.row.cover.images"
              :key="item"
              :src="item">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          label="状态"
          width="180">
          <template slot-scope="scope">
            <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].label }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作">
          <template>
            <el-button size="mini" type="primary" plain>修改</el-button>
            <el-button size="mini" type="danger" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--
        数据分页
        page-size 配置每页大小，默认是 10
        total 用来配置总记录数
        分页组件会根据每页大小和总记录数进行分页
        current-page 当前最高的页码，需要和数据保持同步，否则可能会出现数据页码改变，试图页码没变的情况
      -->
      <el-pagination
        background
        :current-page="page"
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="totalCount"
        :disabled="articleLoading"
        @current-change="handleCurrentChange">
      </el-pagination>
      <!-- /数据分页 -->
    </el-card>
    <!-- /文章列表 -->
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [],
      statTypes: [
        {
          type: 'info',
          label: '草稿'
        },
        {
          type: '',
          label: '待审核'
        },
        {
          type: 'success',
          label: '审核通过'
        },
        {
          type: 'warning',
          label: '审核失败'
        },
        {
          type: 'danger',
          label: '已删除'
        }
      ],
      pageSize: 10, // 每页大小
      totalCount: 0, // 总数据量
      page: 1, // 当前页码
      articleLoading: false, // 加载中
      filterParams: {
        status: '', // 文章状态
        channel_id: '', // 频道id
        begin_pubdate: '', // 开始时间
        end_pubdate: '' // 结束时间
      },
      range_date: '', // 时间范围绑定值，这个字段的意义是为了绑定 date 组件触发 change 事件
      channels: [] // 所有频道
    }
  },
  created () {
    this.loadArticles()
    this.loadChannels()
  },
  methods: {
    handleDateChange (value) {
      this.filterParams.begin_pubdate = value[0]
      this.filterParamsend_pubdate = value[1]
    },
    async loadChannels() {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/channels'
        })
        this.channels = data.channels
      } catch (err) {
        console.log(err)
        this.$message.error('获取频道数据失败')
      }
    },
    onSubmit () {},
    handleFilter () {
      // 点击查询按钮，根据表单中的数据查询文章列表
      this.page = 1 // 查询从第一页开始加载数据
      this.loadArticles()
    },
    async loadArticles () {
      // 请求开始，加载 loading
      this.articleLoading = true
      // 除了登录相关接口之后，其它接口都必须在请求头中通过 Authorization 字段提供用户 token
      // 当我们登录成功，服务端会生成一个 token 令牌，放到用户信息中

      // 去除无用数据字段
      const filterDate = {}
      for (let key in this.filterParams) {
        const item = this.filterParams[key]
        if (item !== null && item !== undefined && item !== '') {
          filterDate[key] = item
        }
        // 数据中的 0 参与布尔值运算是 false 不会进来
        // if (item) {
        //   filterDate[key] = item
        // }
      }
      const data = await this.$http({
        method: 'GET',
        url: '/articles',
        params: {
          page: this.page, // 页码
          per_page: this.pageSize, // 每页大小
          ...filterDate
        }
        // params: Object.assgin({
        //   page: this.page, // 页码
        //   per_page: this.pageSize, // 每页大小
        // }, filterData)
      })
      this.articles = data.results
      this.totalCount = data.total_count
      // 请求结束，停止 loading
      this.articleLoading = false
    },
    handleCurrentChange (page) {
      // 将数据中的页码修改为当前最新改变的数据页码
      this.page = page
      // 页码改变，重新加载当前文章列表
      this.loadArticles()
    }
  }
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 15px;
}
.article-list {
  margin-bottom: 30px;
}
</style>