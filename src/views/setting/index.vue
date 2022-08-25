<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理" name="first">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addDialogVisible = true"
                >新增角色</el-button
              >
            </el-row>
            <!-- 表格 -->
            <el-table border :data="tableData">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="name" label="角色名称" width="240" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作" width="240">
                <template slot-scope="{ row }">
                  <el-button
                    @click="showRightsDialog(row.id)"
                    size="small"
                    type="success"
                    >分配权限</el-button
                  >
                  <el-button size="small" type="primary">编辑</el-button>
                  <el-button
                    @click="onRemove(row.id)"
                    size="small"
                    type="danger"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next,sizes"
                :total="total"
                :page-size="pagesize"
                :page-sizes="[3, 5, 10, 20]"
                @current-change="currentChange"
                @size-change="handleSizeChange"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="second">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="companydata.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="companydata.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="companydata.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="companydata.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 添加角色对话框 -->
    <el-dialog
      @close="dialogClose"
      title="新增角色"
      :visible.sync="addDialogVisible"
      width="50%"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="form"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="addRoleForm.description"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button @click="onAddRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 给角色分配权限 -->
    <el-dialog
      title="给角色分配权限"
      :visible.sync="setRightsDialog"
      width="50%"
    >
      <el-tree
        default-expand-all
        show-checkbox
        node-key="id"
        :data="permissions"
        :default-checked-keys="defaultCheckKeys"
        :props="{ label: 'name' }"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialog = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesApi,
  addRolesApi,
  removeRoleApi,
  getRolesInfo,
} from '@/api/role'
import { getcompanyApi } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { transListToTree } from '@/utils'

export default {
  data() {
    return {
      activeName: 'first',
      tableData: [],
      total: 0,
      page: 1,
      pagesize: 3,
      addDialogVisible: false,
      addRoleForm: {
        name: '',
        description: '',
      },
      addRoleFormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      },
      companydata: {},

      setRightsDialog: false, // 控制分配权限弹层的显示后者隐藏
      permissions: [],
      defaultCheckKeys: [],
    }
  },

  created() {
    this.getRoles()
    this.getcompany()
    this.getPermissions()
  },

  methods: {
    async getRoles() {
      const { rows, total } = await getRolesApi({
        page: this.page,
        pagesize: this.pagesize,
      })
      console.log(rows)
      this.tableData = rows
      this.total = total
    },
    currentChange(val) {
      this.page = val
      this.getRoles()
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getRoles()
    },
    onClose() {
      this.addDialogVisible = false
    },
    async onAddRole() {
      await this.$refs.form.validate()
      await addRolesApi(this.addRoleForm)
      this.$message.success('添加成功')
      this.addDialogVisible = false
      this.getRoles()
    },
    dialogClose() {
      this.$refs.form.resetFields()
      this.addRoleForm.description = ''
    },
    async getcompany() {
      const res = await getcompanyApi(this.$store.state.user.userInfo.companyId)
      console.log(res)
      this.companydata = res
    },
    async onRemove(id) {
      await removeRoleApi(id)
      this.$message.success('删除成功')
      this.getRoles()
    },

    async showRightsDialog(id) {
      this.setRightsDialog = true
      const res = await getRolesInfo(id)
      this.defaultCheckKeys = res.permIds
    },
    async getPermissions() {
      const res = await getPermissionList()
      const treePermission = transListToTree(res, '0')
      this.permissions = treePermission
    },
  },
}
</script>

<style scoped lang="less"></style>
