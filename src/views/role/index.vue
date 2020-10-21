<!--
 * @Author: Tan Xuan
 * @Date: 2020-06-17 11:42:18
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-07-15 21:34:57
 * @Description: 角色管理
-->
<template>
  <div class="patient">
    <div class="header">
      <div>
        <span>关键词：</span>
        <div class="searchKey">
          <el-input v-model="listQuery.name" clearable placeholder="角色名称" />
        </div>
      </div>
      <div>
        <el-button type="success" class="ml-40" @click="handleFilter">搜索</el-button>
      </div>
    </div>
    <div class="actions">
      <el-button v-if="roleId === 1" type="primary" icon="el-icon-plus" @click="addRole">新建角色</el-button>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        max-height="560"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="id" label="角色id" width="80" />
        <el-table-column prop="name" label="角色名称" width="180" />
        <el-table-column prop="remarks" label="备注" width="300" />
        <el-table-column label="角色权限">
          <template slot-scope="{ row }">
            <span v-if="row.id === 1">全部</span>
            <span v-else>{{ row.menus | getMenus }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="roleId === 1" label="操作" fixed="right" width="180">
          <template slot-scope="{ row, $index }">
            <el-button type="primary" size="mini" @click="handleEdit(row)">编辑</el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除助手吗？"
              @onConfirm="handelDelete(row, $index)"
            >
              <el-button v-if="row.id > 3" slot="reference" type="danger" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
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

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form
        ref="formData"
        :model="formData"
        label-position="left"
        label-width="80px"
        style="width: 80%; margin-left:50px;"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="角色备注" prop="remarks">
          <el-input v-model="formData.remarks" />
        </el-form-item>
        <el-form-item label="角色权限" prop="mobile">
          <el-tree
            ref="tree"
            :data="routeList"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            :props="defaultProps"
            @check="handleCheckChange"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAssistant">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let that;
import { list, edit, remove } from "@/api/adminRole";
import indexMixin from "@/mixins/index.mixin";

export default {
  name: "Role",
  filters: {
    getMenus: val => {
      const arr = [];
      val.forEach(item => {
        that.routeList.forEach(ite => {
          if (ite.id === item) {
            arr.push(ite.label);
          }
          if (ite.children) {
            ite.children.forEach(child => {
              if (child.id === item) {
                arr.push(child.label);
              }
            });
          }
        });
      });
      return arr.toString() || "无";
    }
  },
  mixins: [indexMixin],
  data() {
    return {
      options: [],
      tableData: [],
      formData: {
        name: "",
        code: []
      },
      dialogTitle: "新建助手",
      dialogFormVisible: false,
      routeList: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      roleId: 0
    };
  },
  created() {
    that = this;
    this.roleId = this.$store.getters.role;
    this.getList();
    this.getLimit();
  },
  methods: {
    // 新建助手
    addRole() {
      this.$prompt("请输入角色名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          value = value.replace(/\s/g, "");
          if (!value.length) {
            this.$message("请输入角色名称");
            return false;
          }
          console.log(value);
          edit({
            name: value
          }).then(res => {
            if (res.data) {
              this.$message.success("新增成功");
              this.dialogFormVisible = false;
              this.handleClean();
              this.getList();
            } else {
              this.$message.error(res.errmsg);
            }
          });
        })
        .catch(() => {});
    },
    getLimit() {
      const {
        options: { routes }
      } = this.$router;
      const list = [];
      routes.forEach(item => {
        const { meta, children } = item;
        if (meta && meta.hasChildren) {
          const cList = [];
          children.forEach(ite => {
            const {
              hidden,
              meta: { title, code }
            } = ite;
            if (!hidden && meta) {
              cList.push({
                label: title,
                id: code
              });
            }
          });
          list.push({
            id: meta.code,
            label: meta.title,
            children: cList
          });
        } else {
          if (meta && meta.code) {
            list.push({
              label: meta.title,
              id: meta.code
            });
          }
        }
      });
      console.log(list);
      this.routeList = list;
    },
    handleCheckChange(curr, { checkedKeys, halfCheckedKeys }) {
      const codes = [].concat(checkedKeys, halfCheckedKeys);
      //   this.formData.code = codes;
      this.$set(this.formData, "menus", codes);
    },
    getList() {
      list(this.listQuery).then(res => {
        if (!res.code) {
          const { data } = res;
          this.tableData = data.data;
          this.total = data.count;
        }
      });
    },
    saveAssistant() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.loading = true;
          edit(this.formData).then(response => {
            if (response.data) {
              this.$message.success("保存成功");
              this.dialogFormVisible = false;
              //   window.location.reload();
              this.handleClean();
              this.getList();
            } else {
              this.$message.error(response.errmsg);
            }
          });
          this.loading = false;
        } else {
          console.log("保存失败！");
          return false;
        }
      });
    },
    handleEdit(row) {
      console.log(row);
      this.dialogTitle = "编辑角色";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(row.menus.filter(item => item !== 1300));
      });
      this.formData = row;
    },
    handelDelete(row, index) {
      var id = row.id;
      remove(id).then(res => {
        console.log("删除", res);
        if (res.code === 0) {
          this.$message.info("删除成功");
          this.getList();
        } else {
          this.$message.error(res.errmsg);
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
$green: #73a81b;
$blue: #1890ff;
.patient {
  .ml-40 {
    margin-left: 40px;
  }
  .ml-30 {
    margin-left: 30px;
  }
  .ml-10 {
    margin-left: 10px;
  }

  .header {
    display: flex;

    & > div {
      flex: 1;
    }
  }

  .searchKey {
    min-width: 280px;
    display: inline-block;
    margin-left: 8px;
    margin-right: 40px;
  }

  .actions {
    margin-top: 20px;
  }

  .table {
    margin-top: 20px;
    max-height: 580px;
    overflow: hidden;
    overflow-y: auto;
  }

  .page {
    position: absolute;
    right: 30px;
    bottom: 20px;
  }
}
</style>
