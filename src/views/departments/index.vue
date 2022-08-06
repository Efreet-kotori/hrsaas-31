<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 头部 -->

        <TreeTools
          :treeNode="company"
          :isRoot="true"
          @add="dialogVisible = true"
        />
        <br />
        <!-- 树形 -->
        <el-tree :data="treeData" :props="defaultProps" default-expand-all>
          <template v-slot="{ data }">
            <TreeTools
              @add="showAddDept"
              @edit="showEdit"
              :treeNode="data"
              @remove="loadDepts"
            />
          </template>
        </el-tree>
      </el-card>
    </div>

    <!-- 添加部门弹层 -->
    <AddDept
      ref="addDept"
      @addsuccess="loadDepts"
      :visible.sync="dialogVisible"
      :currentNode="currentNode"
    />
  </div>
</template>

<script>
import TreeTools from './compoents/tree-tools.vue'
import { getDeptsApi } from '@/api/departments'
import { transListToTree } from '@/utils'
import AddDept from './compoents/add-dept.vue'
export default {
  data() {
    return {
      treeData: [
        { name: '总裁办', children: [{ name: '董事会' }] },
        { name: '行政部' },
        { name: '人事部' },
      ],
      defaultProps: {
        label: 'name',
        // children: 'child',
      },
      company: { name: '传智教育', manager: '负责人' },
      dialogVisible: false,
      currentNode: {},
    }
  },
  components: {
    TreeTools,
    AddDept,
  },
  created() {
    this.loadDepts()
  },

  methods: {
    async loadDepts() {
      const res = await getDeptsApi()
      this.treeData = transListToTree(res.depts, '')
      // console.log(this.treeData)
    },
    showAddDept(val) {
      this.dialogVisible = true
      this.currentNode = val
    },
    showEdit(val) {
      this.dialogVisible = true
      this.$refs.addDept.getDeptById(val.id)
    },
  },
}
</script>

<style scoped lang="less"></style>
