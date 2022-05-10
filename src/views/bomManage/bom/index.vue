<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="产品编码" prop="productNo">
        <el-input
          v-model="queryParams.productNo"
          placeholder="请输入产品编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料编码" prop="materialNo">
        <el-input
          v-model="queryParams.materialNo"
          placeholder="请输入物料编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料描述" prop="materialDesc">
        <el-input
          v-model="queryParams.materialDesc"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['bomManage:bom:add']"
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
          v-hasPermi="['bomManage:bom:edit']"
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
          v-hasPermi="['bomManage:bom:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['bomManage:bom:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bomList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="物料id" align="center" prop="id" />
      <el-table-column label="订单编号" align="center" prop="orderNo" />
      <el-table-column label="产品编码" align="center" prop="productNo" />
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column label="物料编码" align="center" prop="materialNo" />
      <el-table-column label="物料描述" align="center" prop="materialDesc" />
      <el-table-column label="产品个数" align="center" prop="productNum" />
      <el-table-column label="产品单位" align="center" prop="productUnit" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bomManage:bom:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['bomManage:bom:remove']"
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

    <!-- 添加或修改物料对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="物料等级" prop="materialLevel">
          <el-input v-model="form.materialLevel" placeholder="请输入物料等级" />
        </el-form-item>
        <el-form-item label="工作站编号" prop="stationNo">
          <el-input v-model="form.stationNo" placeholder="请输入工作站编号" />
        </el-form-item>
        <el-form-item label="产品编码" prop="productNo">
          <el-input v-model="form.productNo" placeholder="请输入产品编码" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="物料编码" prop="materialNo">
          <el-input v-model="form.materialNo" placeholder="请输入物料编码" />
        </el-form-item>
        <el-form-item label="物料描述" prop="materialDesc">
          <el-input v-model="form.materialDesc" placeholder="请输入物料描述" />
        </el-form-item>
        <el-form-item label="产品个数" prop="productNum">
          <el-input v-model="form.productNum" placeholder="请输入产品个数" />
        </el-form-item>
        <el-form-item label="产品单位" prop="productUnit">
          <el-input v-model="form.productUnit" placeholder="请输入产品单位" />
        </el-form-item>
        <el-form-item label="工时" prop="workingHours">
          <el-input v-model="form.workingHours" placeholder="请输入工时" />
        </el-form-item>
        <el-form-item label="生产厂家，供应商" prop="manufacturer">
          <el-input v-model="form.manufacturer" placeholder="请输入生产厂家，供应商" />
        </el-form-item>
        <el-form-item label="产品重量" prop="productWeight">
          <el-input v-model="form.productWeight" placeholder="请输入产品重量" />
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
import { listBom, getBom, delBom, addBom, updateBom } from "@/api/bomManage/bom";

export default {
  name: "Bom",
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
      // 物料表格数据
      bomList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        productNo: null,
        productName: null,
        materialNo: null,
        materialDesc: null,
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
    /** 查询物料列表 */
    getList() {
      this.loading = true;
      listBom(this.queryParams).then(response => {
        this.bomList = response.rows;
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
        orderNo: null,
        materialLevel: null,
        stationNo: null,
        productNo: null,
        productName: null,
        materialNo: null,
        materialDesc: null,
        productNum: null,
        productUnit: null,
        workingHours: null,
        manufacturer: null,
        productWeight: null,
        department: null,
        remark: null,
        status: "0",
        createUser: null,
        createTime: null,
        modifyTime: null,
        modifyUser: null
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
      this.title = "添加物料";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getBom(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改物料";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBom(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addBom(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除物料编号为"' + ids + '"的数据项？').then(function() {
        return delBom(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('bomManage/bom/export', {
        ...this.queryParams
      }, `bom_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
