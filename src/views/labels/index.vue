<template>
  <div class="doctor">
    <div class="header">
      <span>关键词：</span>
      <el-input v-model="listQuery.name" class="searchKey" placeholder="标签名称" />
      <span>标签类型：</span>
      <el-select v-model="listQuery.type" placeholder="全部" clearable class="filter-item">
        <el-option
          v-for="item in typeOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <div style="float:right">
        <el-button type="success" class="ml-40" @click="handleFilter">搜索</el-button>
        <el-button @click="handleClean">清除</el-button>
      </div>
    </div>
    <div style="height:10px" />
    <div class="actions">
      <!-- <el-button
        type="success"
        icon="el-icon-plus"
        @click="handleDownload"
      >导出</el-button>-->
      <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新建标签</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" align="center" /> -->
      <el-table-column label="标签ID" prop="id" align="center" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签类型" prop="type" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签名称" prop="name" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联人数" prop="city" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.doctor_count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="success" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row, index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="page">
      <el-pagination
        background
        :current-page.sync="listQuery.page"
        :page-sizes="pageSizeList"
        :page-size="listQuery.pageSize"
        :hide-on-single-page="hiddenOnlyOne"
        :layout="pageLayout"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="标签类型" prop="type">
          <el-radio
            v-for="item in typeOptions"
            :key="item.key"
            v-model="temp.type"
            :label="item.key"
            :value="item.key"
          >{{ item.label }}</el-radio>
        </el-form-item>

        <el-form-item label="标签名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入标签名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, save, remove } from "@/api/labels";
import indexMixin from "@/mixins/index.mixin";
export default {
  name: "Labels",
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  mixins: [indexMixin],
  data() {
    return {
      tableKey: 0,
      typeOptions: [
        { label: "基础属性", key: 1 },
        { label: "业务属性", key: 2 },
        { label: "自定义", key: 3 }
      ],
      showReviewer: false,
      temp: {
        id: undefined,
        name: "",
        type: ""
      },
      dialogFormVisible: false,
      dialogStatus: "create",
      textMap: {
        update: "编辑标签",
        create: "新建标签"
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [
          { required: true, message: "标签类型为必填项", trigger: "change" }
        ],
        name: [{ required: true, message: "标签名称为必填项", trigger: "blur" }]
      },
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.count;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, this.delayLoading);
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: "",
        type: ""
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.type = this.typeOptions[
        this.typeOptions.findIndex(v => v.label === this.temp.type)
      ]["key"];
      console.log(this.temp.type);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    saveData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          save(this.temp).then(() => {
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "创建标签成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        remove(row.id).then(() => {
          this.$notify({
            title: "Success",
            message: "删除标签成功",
            type: "success",
            duration: 2000
          });
          this.list.splice(index, 1);
        });
      });
    },
    handleDownload() {
      this.execDownload("/doctorlabels/export");
    }
  }
};
</script>

<style lang="scss" scoped>
$green: #73a81b;
$blue: #1890ff;
.doctor {
  .ml-40 {
    margin-left: 40px;
  }

  .ml-30 {
    margin-left: 30px;
  }

  .header {
    margin-top: 10px;
    display: flex;

    & > div {
      flex: 1;
    }

    & > span {
      line-height: 40px;
      padding-left: 10px;
    }
  }

  .searchKey {
    min-width: 360px;
    max-width: 780px;
    display: inline-block;
    margin-left: 8px;
    margin-right: 40px;
  }

  .actions {
    margin: 10px 0 10px 0;
  }

  .table {
    margin-top: 20px;
    max-height: 580px;
    overflow: hidden;
    overflow-y: auto;
  }

  .page {
    // position: absolute;
    // right: 30px;
    // bottom: 20px;
    float: right;
    margin: 10px 0 10px 0;
  }
}
</style>
