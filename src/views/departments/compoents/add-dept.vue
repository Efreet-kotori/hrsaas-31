<template>
  <el-dialog @close="onClose" title="添加部门" :visible="visible" width="50%">
    <el-form
      ref="form"
      label-width="100px"
      :model="formData"
      :rules="formRules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="输入部门名称"></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="输入部门编码"></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 100%"
          placeholder="请选择部门负责人"
        >
          <el-option
            v-for="item in employees"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          type="textarea"
          placeholder="输入部门介绍"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button @click="onSave" type="primary">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDeptsApi, getEmployeesApi, addDeptApi } from '@/api/departments'
export default {
  data() {
    const checkDeptName = (rule, value, callback) => {
      if (!this.currentNode.children) return callback()
      const isRepeat = this.currentNode.children.some(
        (item) => item.name == value,
      )
      isRepeat ? callback(new Error('部门重复')) : callback()
    }
    const checkDeptCode = async (rule, value, callback) => {
      const { depts } = await getDeptsApi()
      const isRepeat = depts.some((item) => item.code == value)
      isRepeat ? callback(new Error('部门编码重复')) : callback()
    }

    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: '',
        pid: '',
      },
      formRules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            validator: checkDeptName,
            trigger: 'blur',
          },
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            validator: checkDeptCode,
            trigger: 'blur',
          },
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'change' },
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
        ],
      },
      employees: [],
    }
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    currentNode: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.getEmployeesList()
  },

  methods: {
    async getEmployeesList() {
      const res = await getEmployeesApi()
      // console.log(res, 111)
      this.employees = res
    },
    onClose() {
      this.$emit('update:visible', false)
    },
    async onSave() {
      try {
        await this.$refs.form.validate()
        this.formData.pid = this.currentNode.id
        await addDeptApi(this.formData)
        this.$message.success('新增部门成功')
        this.onClose()
        this.$emit('addsuccess')
      } catch (error) {
        this.$message.error('新增部门失败')
      }
    },
  },
}
</script>

<style scoped></style>
