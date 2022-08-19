<template>
  <el-dialog
    @open="onOpen"
    @close="onClose"
    title="分配角色"
    :visible="visible"
  >
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in roles" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取消</el-button>
      <el-button @click="assignRole" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getRolesApi } from '@/api/role'
import { getUserDetail } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  data() {
    return {
      checkList: ['A', 'B'],
      roles: [],
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    employeesId: {
      type: String,
      required: true,
    },
  },
  created() {},

  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    async getRolesList() {
      const roles = await getRolesApi()
      console.log(roles)
      this.roles = roles.rows
    },
    // 监听对话框打开
    onOpen() {
      this.getRolesList()
      this.getEmployeesRoles()
    },
    // 获取员工角色
    async getEmployeesRoles() {
      const { roleIds } = await getUserDetail(this.employeesId)
      this.checkList = roleIds
    },
    async assignRole() {
      if (!this.checkList.length) return this.$message.error('请选择角色')
      await assignRoles({
        id: this.employeesId,
        roleIds: this.checkList,
      })
      this.$message.success('分配成功')
      this.onClose()
    },
  },
}
</script>

<style scoped></style>
