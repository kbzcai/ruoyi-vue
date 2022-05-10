<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="产品型号" prop="productNo">
        <el-input
          v-model="queryParams.productNo"
          placeholder="请输入产品型号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划号" prop="planNo">
        <el-input
          v-model="queryParams.planNo"
          placeholder="请输入计划号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划时间">
        <el-date-picker
          v-model="daterangePlanDate"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="计划班次" prop="planSchedule">
        <el-select v-model="queryParams.planSchedule" placeholder="请选择计划班次" clearable>
          <el-option
            v-for="dict in dict.type.mes_planSchedule"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['produceManage:plan:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['produceManage:plan:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['produceManage:plan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['produceManage:plan:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="计划id" align="center" prop="id" />
      <el-table-column label="产品型号" align="center" prop="productNo" />
      <el-table-column label="计划号" align="center" prop="planNo" />
      <el-table-column label="计划时间" align="center" prop="planDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.planDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划班次" align="center" prop="planSchedule">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_planSchedule" :value="scope.row.planSchedule"/>
        </template>
      </el-table-column>
      <el-table-column label="计划数量" align="center" prop="planNum" />
      <el-table-column label="实际数量" align="center" prop="actualNum" />
      <el-table-column label="焊接完成数量" align="center" prop="weldingFinishNum" />
      <el-table-column label="不合格数量" align="center" prop="failNum" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['produceManage:plan:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['produceManage:plan:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改计划管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="产品型号" prop="productNo">
          <el-input v-model="form.productNo" placeholder="请输入产品型号" />
        </el-form-item>
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="计划号" prop="planNo">
          <el-input v-model="form.planNo" placeholder="请输入计划号" />
        </el-form-item>
        <el-form-item label="计划时间" prop="planDate">
          <el-date-picker clearable
                          v-model="form.planDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择计划时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划班次" prop="planSchedule">
          <el-select v-model="form.planSchedule" placeholder="请选择计划班次">
            <el-option
              v-for="dict in dict.type.mes_planSchedule"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划数量" prop="planNum">
          <el-input v-model="form.planNum" placeholder="请输入计划数量" />
        </el-form-item>
        <el-form-item label="实际数量" prop="actualNum">
          <el-input v-model="form.actualNum" placeholder="请输入实际数量" />
        </el-form-item>
        <el-form-item label="焊接完成数量" prop="weldingFinishNum">
          <el-input v-model="form.weldingFinishNum" placeholder="请输入焊接完成数量" />
        </el-form-item>
        <el-form-item label="不合格数量" prop="failNum">
          <el-input v-model="form.failNum" placeholder="请输入不合格数量" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPlan, getPlan, delPlan, addPlan, updatePlan } from "@/api/produceManage/plan";

export default {
  name: "Plan",
  dicts: ['mes_planSchedule'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 计划管理表格数据
      planList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 不合格数量时间范围
      daterangePlanDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productNo: null,
        planNo: null,
        planDate: null,
        planSchedule: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询计划管理列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangePlanDate && '' != this.daterangePlanDate) {
        this.queryParams.params["beginPlanDate"] = this.daterangePlanDate[0];
        this.queryParams.params["endPlanDate"] = this.daterangePlanDate[1];
      }
      listPlan(this.queryParams).then(response => {
        this.planList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        productNo: null,
        orderNo: null,
        planNo: null,
        planDate: null,
        planSchedule: null,
        planNum: null,
        actualNum: null,
        passNum: null,
        weldingFinishNum: null,
        failNum: null,
        planStatus: "0",
        productBom: null,
        bomImport: null,
        orderSort: null,
        status: "0",
        createTime: null,
        createUser: null,
        modifyUser: null,
        modifyTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangePlanDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加计划管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPlan(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改计划管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePlan(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPlan(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除计划管理编号为"' + ids + '"的数据项？').then(function() {
        return delPlan(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('produceManage/plan/export', {
        ...this.queryParams
      }, `plan_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
