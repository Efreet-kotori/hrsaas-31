<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <span slot="left-tag">共166条记录</span>
        <template slot="right">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
            >导入</el-button
          >
          <el-button size="small" type="danger" @click="exportExcel"
            >导出</el-button
          >
          <el-button size="small" type="primary" @click="showAdd"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="employees">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="员工">
            <template slot-scope="{ row }">
              <img
                v-imgError="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                @click="showErCodeDialog(row.staffPhoto)"
              />
            </template>
          </el-table-column>

          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatFormOfEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="">
            <template slot-scope="{ row }">
              {{ row.timeOfEntry | formatTime }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="">
            <template slot-scope="{ row }">
              <el-switch
                active-color="#13ce66"
                inactive-color="#ff4949"
                :value="row.enableState === 1"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push('/employees/detail/' + row.id)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button
                @click="showAssignRole(row.id)"
                type="text"
                size="small"
                >角色</el-button
              >
              <el-button @click="onRemove(row.id)" type="text" size="small"
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
          <el-pagination
            :page-size="pages.size"
            :total="total"
            @current-change="currentChange"
            layout="prev, pager, next"
          />
        </el-row>
      </el-card>
    </div>
    <AddEmployees
      :visible.sync="showAddEmployees"
      @add-success="getEmployeesList"
    ></AddEmployees>
    <!-- 分配角色 -->
    <AssignRole :visible.sync="showDialog" :employeesId="employeesId" />
    <!-- 头像二维码 -->
    <el-dialog title="头像二维码" :visible.sync="ercodeDialog">
      <canvas id="canvas"></canvas>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeesInfoApi, removeEmployeesApi } from '@/api/employees'
import employees from '@/constant/employees'
const { headers, hireType } = employees
import AddEmployees from './components/add-employees.vue'
import AssignRole from './components/assign-role.vue'

import QRcode from 'qrcode'
export default {
  data() {
    return {
      employees: [],
      total: 0,
      pages: {
        page: 1,
        size: 5,
      },
      showAddEmployees: false,
      ercodeDialog: false,
      showDialog: false,
      employeesId: '',
    }
  },
  components: {
    AddEmployees,
    AssignRole,
  },
  created() {
    this.getEmployeesList()
  },

  methods: {
    async getEmployeesList() {
      const { rows, total } = await getEmployeesInfoApi(this.pages)
      this.total = total
      this.employees = rows
      // console.log(rows)
    },
    currentChange(val) {
      this.pages.page = val
      this.getEmployeesList()
    },
    formatFormOfEmployment(row, column, cellValue, index) {
      const findItem = employees.hireType.find((item) => item.id === cellValue)
      return findItem ? findItem.value : '未知'
    },
    async onRemove(id) {
      await this.$confirm('是否删除该员工？')
      await removeEmployeesApi(id)
      this.getEmployeesList()
    },
    showAdd() {
      this.showAddEmployees = true
    },
    async exportExcel() {
      const { export_json_to_excel } = await import('@/vendor/Export2Excel')
      const { rows } = await getEmployeesInfoApi({
        page: 1,
        size: this.total,
      })

      const header = Object.keys(headers)
      const data = rows.map((item) => {
        return header.map((h) => {
          if (h === '聘用形式') {
            const findItem = hireType.find((hire) => {
              return hire.id === item[headers[h]]
            })
            return findItem ? findItem.value : '未知'
          } else {
            return item[headers[h]]
          }
        })
      })

      export_json_to_excel({
        header, //表头 必填
        data, //具体数据 必填
        filename: '员工', //非必填
        autoWidth: true, //非必填
        bookType: 'xlsx', //非必填
        multiHeader: [['手机号', '其他信息', '', '', '', '', '部门']],
        merges: ['A1:A2', 'B1:F1', 'G1:G2'],
      })
    },
    showErCodeDialog(staffPhoto) {
      if (!staffPhoto) {
        return this.$message.error('该用户还未设置头像')
      }
      this.ercodeDialog = true
      this.$nextTick(() => {
        const canvas = document.getElementById('canvas')
        QRcode.toCanvas(canvas, staffPhoto)
      })
    },
    showAssignRole(id) {
      this.showDialog = true
      this.employeesId = id
    },
  },
}
</script>

<style scoped lang="less"></style>
