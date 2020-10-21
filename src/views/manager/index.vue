<!--
 * @Author: Tan Xuan
 * @Date: 2020-03-30 16:48:29
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-10-21 19:12:25
 * @Description: 管理员首页
 -->
<template>
  <div class="patient">
    <div class="header">
      <div>
        <span>关键词：</span>
        <div class="searchKey">
          <el-input v-model="listQuery.name" clearable placeholder="管理员姓名/手机号" />
        </div>
      </div>
      <div>
        <span>角色：</span>
        <div class="searchKey">
          <el-select v-model="listQuery.role_id" clearable placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>
      </div>
      <div>
        城市：
        <el-cascader
          v-model="city"
          :options="city_list"
          clearable
          :props="{ expandTrigger: 'hover', value: 'id', label: 'name' }"
          @change="handleCityChange"
        />
        <el-button type="success" class="ml-40" @click="handleFilter">搜索</el-button>
        <el-button @click="handleClean">清除</el-button>
      </div>
    </div>
    <div class="actions">
      <!-- <el-button type="success" icon="el-icon-plus" @click="handleDownload"
        >导出</el-button
      >-->
      <el-button v-if="roleId === 1" type="primary" icon="el-icon-plus" @click="addAssi">新建管理员</el-button>
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
        <el-table-column type="selection" width="40" />
        <el-table-column prop="id" label="管理员id" width="80" />
        <el-table-column prop="name" label="管理员姓名" width="180" />
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="mobile" label="手机号" width="180" />
        <el-table-column prop="city_name" label="城市" width="180" />
        <el-table-column label="角色" width="180">
          <template slot-scope="{ row }">
            <div>{{ row.role_name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="summary" label="备注" />
        <el-table-column label="操作" fixed="right" width="180">
          <template slot-scope="{ row, $index }">
            <el-button
              v-if="row.id === userId || roleId === 1"
              type="primary"
              size="mini"
              @click="handleEdit(row)"
            >编辑</el-button>
            <el-popconfirm
              confirm-button-text="确定"
              cancel-button-text="取消"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除管理员吗？"
              @onConfirm="handelDelete(row, $index)"
            >
              <el-button v-if="roleId === 1" slot="reference" type="danger" size="mini">删除</el-button>
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
        :rules="rules"
        :model="formData"
        label-position="left"
        label-width="70px"
        style="width: 60%; margin-left:50px;"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="登录帐号：请输入字母或数字"
            @input="handleUserNameFilter"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="formData.mobile" maxlength="11" />
        </el-form-item>
        <el-form-item label="密码" prop="as_password">
          <el-row>
            <el-col :span="16">
              <el-input
                ref="password"
                v-model="formData.as_password"
                :type="passwordType"
                placeholder="密码"
                auto-complete="off"
                @input="handlePassWordFilter"
              />
            </el-col>
            <el-col :span="2" :offset="1">
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-col>
            <el-col :span="2">
              <el-button @click="productPassword">生成</el-button>
            </el-col>
          </el-row>
          <el-row v-if="!isAdd">如无需修改密码则不用填写</el-row>
        </el-form-item>
        <el-form-item v-if="roleId === 1" label="角色" prop="role_id">
          <span v-if="formData.role_id === 1">超级管理员</span>
          <el-select v-else v-model="formData.role_id" placeholder="请选择">
            <template v-for="item in roleList">
              <el-option :key="item.id" :label="item.name" :value="item.id" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="城市">
          <el-cascader
            v-model="formData.rel_city"
            :options="city_list"
            :props="{ expandTrigger: 'hover', value: 'id', label: 'name' }"
            @change="handleCityChange2"
          />
        </el-form-item>
        <el-form-item label="备注" prop="summary">
          <el-input v-model="formData.summary" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveManager">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, add, del } from "@/api/user";
import { list } from "@/api/adminRole";
import { testPhone } from "@/utils/validate";
import { createPassword } from "@/utils/index";
import indexMixin from "@/mixins/index.mixin";

export default {
  name: "Manager",
  mixins: [indexMixin],
  data() {
    return {
      options: [],
      passwordType: "text",
      city: "",
      city_list: [],
      tableData: [],
      formData: {
        name: "",
        username: "",
        mobile: "",
        rel_city: "",
        as_password: ""
      },
      dialogTitle: "新建管理员",
      dialogFormVisible: false,
      routeList: [],
      roleList: [],
      rules: {
        name: [
          { required: true, message: "请输入管理员名称", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入管理员用户名", trigger: "blur" }
        ],
        mobile: [
          {
            required: true,
            message: "请输入正确的手机号码",
            trigger: "blur",
            validator(rule, value, callback) {
              if (!testPhone(value)) {
                callback(new Error("手机号不正确"));
              } else {
                callback();
              }
            }
          }
        ],
        role_id: [{ required: true, message: "请选择角色", trigger: "blur" }],
        rel_city: [{ required: true, message: "请选择城市", trigger: "blur" }]
      },
      isAdd: true,
      roleId: 0,
      userId: ""
    };
  },
  created() {
    // that = this
    this.roleId = this.$store.getters.role;
    this.userId = this.$store.getters.userId;
    this.getList();
    this.getRoleList();
  },
  methods: {
    handleUserNameFilter(e) {
      this.formData.username = e.replace(/[^0-9A-Za-z.@_]/g, "");
    },
    handlePassWordFilter(e) {
      this.formData.as_password = e.replace(/[^0-9A-Za-z.@_]/g, "");
    },
    // 新建管理员
    addAssi() {
      if (this.$refs.formData) {
        this.$refs.formData.resetFields();
      }
      this.formData = {
        name: "",
        username: "",
        mobile: "",
        rel_city: "",
        as_password: ""
      };
      this.dialogFormVisible = true;
      this.isAdd = true;
      this.dialogTitle = "新建管理员";
    },
    handleCityChange(val) {
      this.$set(this.listQuery, "city", val[1]);
    },
    getRoleList() {
      list({
        pageSize: 1000
      }).then(res => {
        const {
          code,
          data: { data }
        } = res;
        if (code === 0) {
          this.roleList = data;
        }
      });
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
    },
    productPassword() {
      this.$set(this.formData, "as_password", createPassword(8, 15));
    },
    handleCityChange2(val) {
      this.$set(this.formData, "rel_city", val[1]);
    },
    // 复选框选择到的id
    // handleSelection(selection) {
    //   this.multipleSelection = selection.map(item => item.id);
    //   console.log(this.multipleSelection);
    // },
    handleDownload() {
      this.execDownload("/assistant/listExport");
    },
    //
    getList() {
      getList(this.listQuery).then(res => {
        if (!res.code) {
          const { data } = res;
          this.tableData = data.data;
          this.total = data.count;
        }
      });
    },
    saveManager() {
      console.log(this.formData);
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.formData.username.length < 4) {
            this.$message.error("请输入至少4位用户名");
            return false;
          }
          if (this.isAdd && this.formData.as_password.length < 6) {
            this.$message.error("请输入至少6位密码");
            return false;
          }
          add(this.formData).then(response => {
            console.log(response);
            if (response.data) {
              this.$message.success("保存成功");
              this.dialogFormVisible = false;
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
      this.dialogTitle = "编辑管理员";
      this.dialogFormVisible = true;
      this.isAdd = false;
      this.formData = JSON.parse(JSON.stringify(row));
    },
    handelDelete(row, index) {
      var id = row.id;
      del(id).then(res => {
        console.log(res);
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
