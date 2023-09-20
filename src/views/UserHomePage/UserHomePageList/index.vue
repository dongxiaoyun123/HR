<template>
  <div style="margin:8px">
    <el-card>
      <el-form label-width="90px">
        <el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item class="whereClass" label="合同方">
                <el-select v-model="WhereParameter.ParentEnterPriseCode" class="whereClass" filterable placeholder="合同方"
                           @change="GetChildUser"
                >
                  <el-option v-for="item in EnterpriseList" :key="item.ParentEnterPriseCode"
                             :label="item.ParentEnterPriseName" :value="item.ParentEnterPriseCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="whereClass" label="付款方">
                <el-select v-model="WhereParameter.EnterPriseCode" class="whereClass" filterable placeholder="付款方"
                           @change="GetProgramInfoAll"
                >
                  <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode" :label="item.EnterPriseName"
                             :value="item.EnterPriseCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="whereClass" label="人员姓名">
                <el-input v-model="WhereParameter.StaffName" clearable placeholder="人员姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="whereClass" label="证件号码">
                <el-input v-model="WhereParameter.IdentificationNumber" clearable placeholder="证件号码" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item class="whereClass" label="保障方案">
                <el-select v-model="WhereParameter.ProgramCode" class="whereClass" filterable placeholder="保障方案"
                           clearable="" multiple collapse-tags @change="ProgramChange"
                >
                  <el-option v-for="item in ProgramInfoAllList" :key="item.ProgramCode" :label="item.Children"
                             :value="item.ProgramCode"
                  >
                    <span style="float: left">{{ item.Children }}</span>
                    <span v-if="item.StatesName == '过期'" style="float: right; color: #909399; font-size: 13px">{{
                      item.StatesName
                    }}</span>
                    <span v-else style="float: right; color: #13CE66; font-size: 13px">{{ item.StatesName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="whereClass" label="部门名称">
                <el-select v-model="WhereParameter.DepartmentCode" class="whereClass" filterable placeholder="部门名称"
                           clearable="" multiple collapse-tags
                >
                  <el-option v-for="item in ProgramCodeList" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="whereClass" label="添加时间">
                <el-date-picker v-model="WhereParameter.CreateTime" style="width: 100%;" type="daterange"
                                range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions"
                                clearable="" @input="datetimeChange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-button-group class="buttonGroupClass">
                <el-button type="primary" icon="el-icon-search" @click="GetAdmin_PermissionSearch">查 询
                </el-button>
                <el-button type="success" icon="el-icon-circle-plus-outline" @click="ShowAddStaffDialog(null)">增 员
                </el-button>
                <el-button type="danger" icon="el-icon-delete" :disabled="ReadOnly" @click="UpdateDialog">
                  减 员</el-button>
                <el-button type="warning" icon="el-icon-upload2" @click="ImportStaffDialog">
                  批量增减
                </el-button>
                <el-dropdown style="margin-left: 0;" @command="
                  (command) => {
                    handleButtonCommand(command);
                  }
                "
                >
                  <el-button type="info">
                    导 出<i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :disabled="ReadOnly" command="a" icon="el-icon-download">导出当前查询数据(在保)
                      {{ "\xa0" }}
                    </el-dropdown-item>
                    <el-dropdown-item v-show="IfClearableEnterprise" :disabled="ReadOnly" command="b"
                                      icon="el-icon-download"
                    >导出该合同方下全部数据(在保) {{ "\xa0"
                    }}
                    </el-dropdown-item>
                    <el-dropdown-item v-show="rolesFlag && rolesFlag[0] != 1" :disabled="ReadOnly" command="c"
                                      icon="el-icon-download"
                    >导出该合同方下全部数据 {{ "\xa0" }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button-group>
              <el-switch v-model="WhereParameter.Invalid" active-color="#13ce66" inactive-color="#ff4949"
                         style="margin-left:20px;" active-text="在保" inactive-text="过期"
              />
            </el-col>
            <el-col :span="6">
              <div v-if="this.$store.getters.roles.indexOf(7) != -1 || this.$store.getters.roles.indexOf(1) != -1"
                   style="text-align: right;margin-top: 0.23rem;"
              >
                <el-tag v-if="InsuranceTypeCode == 1" type="danger">当前用户生效方式：次日生效</el-tag>
                <el-tag v-else-if="InsuranceTypeCode == 2" type="danger">当前用户生效方式：月底生效</el-tag>
                <el-tag v-else type="danger">当前用户生效方式：暂无配置</el-tag>
              </div>
            </el-col>
            <!-- <el-col :span="6" style="text-align:right ;">
              <mallki class-name="mallki-text" :text="totalMoney" />
            </el-col> -->
          </el-row>
          <!-- <el-row>
            <el-col :span="12">
              <div class="buttonGroupClass">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-card shadow="hover">
                      <el-statistic title="保障方案">
                        <template slot="prefix">
                          <svg-icon class="linkClass" style="color: inherit;" icon-class='plan' />
                        </template>
                        <template slot="formatter">
                          <el-link class="linkClass">2种</el-link>
                        </template>
                      </el-statistic>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <el-card shadow="hover">
                      <el-statistic title="HR添加成员">
                        <template slot="prefix">
                          <svg-icon class="linkClass" style="color: inherit;" icon-class='addpeople' />
                        </template>
                        <template slot="formatter">
                          <el-link class="linkClass">1000人</el-link>
                        </template>
                      </el-statistic>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <el-card shadow="hover">
                      <el-statistic title="当前应缴">
                        <template slot="prefix">
                          <svg-icon class="linkClass" style="color: inherit;" icon-class='money' />
                        </template>
                        <template slot="formatter">
                          <el-link class="linkClass">114,946.12</el-link>
                        </template>
                      </el-statistic>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row> -->
        </el-row>
      </el-form>
    </el-card>
    <el-card class="CardTableClass">
      <el-table ref="multipleTable" v-loading="loading" class="tableCheckClass" :data="StaffList" fit :cell-style="showBackground"
                @selection-change="TableSelect" @row-click="toggleSelection"
      >
        <el-table-column type="selection" width="50" fixed="left" />
        <el-table-column prop="ProgramName" label="方案名称" min-width="140" show-overflow-tooltip
                         fixed="left"
        />
        <el-table-column prop="StaffName" label="姓名" min-width="70" fixed="left" show-overflow-tooltip />
        <el-table-column prop="IdentificationNumber" label="证件号码" min-width="150" fixed="left" show-overflow-tooltip />
        <el-table-column prop="Sex" label="性别" :formatter="SexFormat" min-width="50" />
        <el-table-column prop="DocumentTypeName" label="证件类型" min-width="80" show-overflow-tooltip />
        <el-table-column prop="ProtectionStartDate" label="保障开始" sortable min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 6px">{{ scope.row.ProtectionStartDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ProtectionEndDate" label="保障结束" min-width="120" sortable="" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 6px">{{ scope.row.ProtectionEndDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="EmployeeRelationshipName" label="员工关系" min-width="80" />
        <el-table-column prop="MainStaffName" label="主被姓名" min-width="80" show-overflow-tooltip />
        <el-table-column prop="IdentificationNumberMain" label="主被证件" min-width="150" />
        <el-table-column prop="DateOfBirth" label="出生日期" min-width="120">
          <template slot-scope="scope">
            <i v-if="scope.row.DateOfBirth" class="el-icon-time" />
            <span style="margin-left: 6px">{{ DateOfBirthFormat(scope.row.DateOfBirth) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="PhoneNumber" label="手机号" min-width="100" />
        <el-table-column prop="MedicalInsuranceAddress" label="社保地区" min-width="100" show-overflow-tooltip />
        <el-table-column prop="MedicalInsuranceTypeName" label="社保类型" min-width="180" />
        <el-table-column prop="StaffAddress" label="员工地区" min-width="100" show-overflow-tooltip />
        <el-table-column prop="OccupationCategory" label="职业类别" min-width="100" show-overflow-tooltip />
        <el-table-column prop="DepartmentCode" label="部门" min-width="100" show-overflow-tooltip />
        <el-table-column prop="JobNo" label="工号" min-width="100" show-overflow-tooltip />
        <el-table-column prop="JobType" label="工种" min-width="100" show-overflow-tooltip />
        <!-- <el-table-column prop="CreateTime" label="添加时间" min-width="160">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 6px">{{ dateFormat(scope.row.CreateTime) }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" fixed="right" :width="UpdateWidth">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="text" size="mini" @click="
              ShowAddStaffDialog(scope.row)
            "
            >编辑</el-button>
            <el-button v-if="rolesFlag && rolesFlag[0] == 5" :disabled="ReadOnly" icon="el-icon-delete" type="text"
                       size="mini" @click="
                         DeleteStaffDialog(scope.row)
                       "
            >物理删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background :current-page="WhereParameter.PageIndex" :page-sizes="[20, 50, 100]"
                     :page-size="WhereParameter.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加投保数据 -->
    <el-dialog :visible.sync="addStaffVisible" top="5vh" width="70%" :lock-scroll="false"
               :append-to-body="true" @close="detailAddDialogVisibleClosed"
    >
      <!-- 上面两个属性用来重置滚动条 -->
      <div slot="title" class="dialog-title">
        <span>{{ !IfUpdate ? '添加投保数据' : '修改投保数据' }}</span>
      </div>
      <el-form ref="addStaffRef" :model="addStaffForm" :rules="addStaffRules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名" prop="StaffNameAdd">
              <el-input v-model="addStaffForm.StaffNameAdd" placeholder="姓名" :disabled="rolesFlag && (rolesFlag[0] == 1 || rolesFlag[0] == 2) && IfUpdate"
                        @input="StaffNameAddChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件类型" prop="DocumentTypeCodeAdd">
              <el-select v-model="addStaffForm.DocumentTypeCodeAdd" filterable placeholder="证件类型" :disabled="rolesFlag && (rolesFlag[0] == 1 || rolesFlag[0] == 2) && IfUpdate"
                         @change="changeOther"
              >
                <el-option v-for="item in DocumentTypeArray" :key="item.ConfigValue" :label="item.ConfigName"
                           :value="item.ConfigValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="证件号码" prop="IdentificationNumberAdd">
              <el-input v-model="addStaffForm.IdentificationNumberAdd" placeholder="证件号码" :disabled="rolesFlag && (rolesFlag[0] == 1 || rolesFlag[0] == 2) && IfUpdate"
                        @blur.prevent="changeOther" @input="IdentificationNumberAddChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="SexAdd">
              <el-radio key="0" v-model="addStaffForm.SexAdd" label="0"
                        :disabled="rolesFlag && (rolesFlag[0] == 1 || rolesFlag[0] == 2) && IfUpdate" border
              >男</el-radio>
              <el-radio key="1" v-model="addStaffForm.SexAdd" label="1"
                        :disabled="rolesFlag && (rolesFlag[0] == 1 || rolesFlag[0] == 2) && IfUpdate" border
              >女</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="DateOfBirthAdd">
              <el-date-picker v-model="addStaffForm.DateOfBirthAdd" type="date" placeholder="选择日期"
                              :disabled="rolesFlag && (rolesFlag[0] == 1 || rolesFlag[0] == 2) && IfUpdate"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="PhoneNumberAdd">
              <el-input v-model="addStaffForm.PhoneNumberAdd" placeholder="手机号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="社保类型" prop="MedicalInsuranceTypeCodeAdd">
              <el-select v-model="addStaffForm.MedicalInsuranceTypeCodeAdd" filterable placeholder="社保类型" clearable="">
                <el-option v-for="item in MedicalInsuranceTypeArray" :key="item.ConfigValue" :label="item.ConfigName"
                           :value="item.ConfigValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="社保地区" prop="MedicalInsuranceAddress">
              <el-input v-model="addStaffForm.MedicalInsuranceAddress" placeholder="社保地区" />
              <!-- <el-cascader placeholder="社保地区" :options="regionOptions" v-model="addStaffForm.region" filterable
                clearable></el-cascader> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="员工关系" prop="EmployeeRelationshipCodeAdd">
              <el-select v-model="addStaffForm.EmployeeRelationshipCodeAdd" filterable placeholder="与员工关系"
                         :disabled="IfUpdate" @change="changeOther"
              >
                <el-option v-for="item in EmployeeRelationsArray" :key="item.ConfigValue" :label="item.ConfigName"
                           :value="item.ConfigValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="方案名称" prop="ProgramNameAdd">
              <el-select v-model="addStaffForm.ProgramNameAdd" class="whereFormClass" filterable
                         placeholder="方案名称" :disabled="IfUpdate" @change="ProgramChangeAdd"
              >
                <el-option v-for="item in ProgramCodesArray" :key="item.ProgramCode" :label="item.ProgramName"
                           :value="item.ProgramCode"
                >
                  <span style="float: left">{{ item.ProgramName }}</span>
                  <span v-if="item.StatesName == '过期'" style="float: right; color: #909399; font-size: 13px">{{
                    item.StatesName
                  }}</span>
                  <span v-else style="float: right; color: #13CE66; font-size: 13px">{{ item.StatesName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="主被姓名" prop="MainStaffNameAdd">
              <el-input v-model="addStaffForm.MainStaffNameAdd" placeholder="主被保险人姓名" :disabled="rolesFlag && (rolesFlag[0] == 1 || rolesFlag[0] == 2) && IfUpdate"
                        @input="MainStaffNameAddChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主被证件" prop="IdentificationNumberMainAdd">
              <el-input v-model="addStaffForm.IdentificationNumberMainAdd" placeholder="主被保险人证件号码"
                        :disabled="rolesFlag && (rolesFlag[0] == 1 || rolesFlag[0] == 2) && IfUpdate"
                        @input="MainIdentificationNumberAddChange"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保障期间" required>
              <el-col :span="11">
                <el-form-item prop="ProtectionStartDateAdd" style="margin-bottom: 0;">
                  <el-date-picker v-model="addStaffForm.ProtectionStartDateAdd" style="width: 100%;" type="date"
                                  placeholder="选择日期" class="whereFormClass"
                                  :picker-options="pickerOptionsAdd" :disabled="IfUpdate"
                  />
                </el-form-item>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="ProtectionEndDateAdd" style="margin-bottom: 0;">
                  <el-date-picker v-model="addStaffForm.ProtectionEndDateAdd" style="width: 100%;" type="date"
                                  placeholder="选择日期" class="whereFormClass"
                                  :disabled="IfUpdate"
                  />
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="员工地区" prop="StaffAddressAdd">
              <el-input v-model="addStaffForm.StaffAddressAdd" placeholder="员工地区" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职业类别" prop="AddOccupationCategory">
              <el-input v-model="addStaffForm.AddOccupationCategory" placeholder="职业类别" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="DepartmentCodeAdd">
              <el-select v-model="addStaffForm.DepartmentCodeAdd" clearable filterable allow-create default-first-option
                         placeholder="部门"
              >
                <el-option v-for="item in DepartmentArray" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工号" prop="JobNoAdd">
              <el-input v-model="addStaffForm.JobNoAdd" placeholder="工号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工种" prop="JobTypeAdd">
              <el-input v-model="addStaffForm.JobTypeAdd" placeholder="工种" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-row class="buttonCenter">
          <el-col>
            <el-button :disabled="ReadOnly" type="primary" :loading="LoadingAdd" @click="addStaff">保 存</el-button>
            <el-button v-if="!IfUpdate" :disabled="ReadOnly" @click="detailAddDialogVisibleReset">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog title="修改保障结束日期" :visible.sync="updateDialogVisible" width="30%">
      <el-form :model="updateStaffFrom" label-width="120px">
        <el-form-item label="保障结束日期">
          <el-date-picker v-model="updateStaffFrom.EndDate" type="date" placeholder="选择日期"
                          :picker-options="pickerOptionsUpdate"
          />
        </el-form-item>
      </el-form>
      <el-divider />
      <el-row style="text-align:center;">
        <el-col :span="24">
          <el-button type="primary" :loading="LoadingUpdate" @click="saveUpdate">确
            定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="上传文件" :visible.sync="ImportDialogVisible" width="40%">
      <el-form ref="importRef" label-width="90px">

        <el-alert v-if="EnterpriseData && EnterpriseData.Simples != 1" style="margin-bottom:20px ;" type="success"
                  show-icon title="此公司目前配置的是普通模板" :closable="false"
        />
        <el-alert v-else-if="EnterpriseData && EnterpriseData.Simples == 1" style="margin-bottom:20px ;" type="success"
                  show-icon title="此公司目前配置的是简易模板" :closable="false"
        />
        <el-form-item label="方案名称">
          <el-select v-model="ProgramNameImport" class="whereFormClass" filterable placeholder="方案名称">
            <el-option v-for="item in ProgramCodesArray" :key="item.ProgramCode" :label="item.ProgramName"
                       :value="item.ProgramCode"
            >
              <span style="float: left">{{ item.ProgramName }}</span>
              <span v-if="item.StatesName == '过期'" style="float: right; color: #909399; font-size: 13px">{{
                item.StatesName
              }}</span>
              <span v-else style="float: right; color: #13CE66; font-size: 13px">{{ item.StatesName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-divider />
        <el-tabs v-model="activeName" tab-position="left" style="min-height:150px" @tab-click="handleClick">
          <el-tab-pane label="批量加人" name="first">
            <transition name="el-zoom-in-bottom">
              <div v-show="buttonShow">
                <el-form-item label="下载模板">
                  <el-button @click="downloadTemplate">下载加人模板</el-button>
                </el-form-item>
                <el-form-item label="上传文件">
                  <el-upload ref="upload" :action="actionUrl" :on-preview="handlePreview" :on-remove="handleRemove"
                             :on-success="fileUploadSuccess" :on-error="fileUploadFail" :on-change="fileChange"
                             :file-list="fileList" :limit="1" :auto-upload="false" :headers="myHeaders"
                             :before-upload="BeforeUploadFile"
                  >
                    <el-button slot="trigger" class="buttonM">上传批量加人文档</el-button>
                  </el-upload>
                </el-form-item>
              </div>
            </transition>
          </el-tab-pane>
          <el-tab-pane label="批量减人" name="second">
            <transition name="el-zoom-in-top">
              <div v-show="!buttonShow">
                <el-form-item label="下载模板">
                  <el-button @click="downloadDepeteTemplate">下载减人模板</el-button>
                </el-form-item>
                <el-form-item label="上传文件">
                  <el-upload ref="upload" :action="actionUrl" :on-preview="handlePreview" :on-remove="handleRemove"
                             :on-success="fileUploadSuccess" :on-error="fileUploadFail" :on-change="fileChange"
                             :file-list="fileList" :limit="1" :auto-upload="false" :headers="myHeaders"
                             :before-upload="BeforeUploadFile"
                  >
                    <el-button slot="trigger" class="buttonM">上传批量减人文档</el-button>
                  </el-upload>
                </el-form-item>
              </div>
            </transition>
          </el-tab-pane>
        </el-tabs>
        <el-divider />
        <el-row style="text-align:center;">
          <el-col :span="24">
            <el-button v-loading.fullscreen.lock="uploadLoading" :disabled="ReadOnly" type="primary"
                       @click="submitUpload"
            >开始导入</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <div v-if="isShowProgress" class="popContainer">
      <el-progress type="circle" :percentage="parseInt(fakes.progress * 100)" :stroke-width="9" :color="customColors"
                   style="top: 30%; left: calc(50vw - 58px);color:white"
      />
    </div>
  </div>
</template>

<script>
import { getDateByTimes } from "@/utils"; // 时间日期格式化成字符串
import moment from "moment"; // 导入模块
moment.locale("zh-cn"); // 设置语言 或 moment.lang('zh-cn');
import { isIdentityId } from './components/validate'
import FakeProgress from 'fake-progress';
import {
  GetEnterpriseList,
  GetChildUser,
  GetProgramInfoAll,
  GetDepartmentList,
  GetStaffList,
  GetDataConfigData,
  GetProgramList,
  GetAddDepartmentList,
  GetRangeDate,
  AddStaffinfo,
  IdentityCardValidated,
  UpdateStaffinfo,
  DeleteData,
  ExportStaffList,
  ExportStaffListAll,
  DeleteStaff,
} from "@/api/hrmain";
// import Mallki from '../UserHomePageList/components/TextHoverEffect/'
import axios from "axios";
export default {
  name: 'UserHomePageList',
  components: {
    // Mallki
  },
  data() {
    // 身份证检验规则
    var checkIdentificationNumber = (rule, value, callback) => {
      if (value) {
        // 只检验证件类型是身份证的
        if (this.addStaffForm.DocumentTypeCodeAdd == "1") {
          var errorMsg = isIdentityId(value);
          if (errorMsg != "") {
            return callback(new Error(errorMsg));
          } else {
            return callback();
          }
        } else {
          return callback();
        }
      } else { callback(new Error("请输入证件号码")); }
    };
    // 自定义手机号规则
    var checkMobile = (rule, value, callback) => {
      if (value) {
        const regMobile = /^1[34578]\d{9}$/;
        if (regMobile.test(value)) {
          return callback();
        }
        return callback(new Error("请输入正确的手机号码"));
      } else {
        return callback();
      }
    };
    var checkMedicalInsuranceAddress = (rule, value, callback) => {
      if (this.addStaffForm.MedicalInsuranceTypeCodeAdd == '4') { return callback(); } else if (value) {
        return callback();
      } else {
        return callback(new Error("请输入医保地址"));
      }
    };
    return {
      isShowProgress: false,
      fakes: new FakeProgress({
        timeConstant: 10000,
        autoStart: false
      }),
      customColors: [
        { color: '#ff4949', percentage: 20 },
        { color: '#ffba00', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 }
      ],
      InsuranceTypeCode: null,
      ReadOnly: false, // 演示人员不能操作数据
      myHeaders: { 'X-Token': '' },
      rolesFlag: '',
      // regionOptions: regionData,
      DocumentTypeArray: [],
      MedicalInsuranceTypeArray: [],
      EmployeeRelationsArray: [],
      ProgramCodesArray: [],
      RangeDateArray: [], // 添加时设置日期范围
      addStaffVisible: false,
      addStaffForm: {
        StaffNameAdd: '',
        SexAdd: '',
        DocumentTypeCodeAdd: '',
        IdentificationNumberAdd: '',
        DateOfBirthAdd: '',
        PhoneNumberAdd: '',
        MedicalInsuranceAddress: '',
        MedicalInsuranceTypeCodeAdd: '',
        EmployeeRelationshipCodeAdd: '',
        ProgramNameAdd: '',
        MainStaffNameAdd: '',
        IdentificationNumberMainAdd: '',
        ProtectionStartDateAdd: '',
        ProtectionEndDateAdd: '',
        StaffAddressAdd: '',
        AddOccupationCategory: '',
        DepartmentCodeAdd: '',
        JobNoAdd: '',
        JobTypeAdd: '',
        StaffCode: '', // 修改需要传入参数
        MainStaffCode: '', // 修改需要传入参数
      },
      WhereParameter: {
        ParentEnterPriseCode: '',
        EnterPriseCode: '',
        StaffName: '',
        IdentificationNumber: '',
        ProgramCode: [],
        DepartmentCode: [],
        CreateTime: [],
        BeginTime: '',
        EndTime: '',
        UnderInsurance: false,
        ToBeReviewed: false,
        Rejected: false,
        Invalid: true,
        StaffAdd: false,
        PageIndex: 1,
        PageSize: 20,
      },
      StaffList: [],
      total: 0,
      EnterpriseList: [],
      ChildEnterpriseList: [],
      ProgramInfoAllList: [],
      ProgramCodeList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "本月",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().setTime(new Date().setDate(1)));
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "上月",
            onClick(picker) {
              var range = getDateByTimes()
              const start = range[0];
              const end = range[1];
              picker.$emit("pick", [new Date(start), new Date(end)]);
            },
          },
          {
            text: "本年",
            onClick(picker) {
              const end = new Date();
              var y = end.getFullYear(); // 年

              var startStr = y + "-01-01";

              const start = new Date(startStr);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 360);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      totalMoney: '¥6666.88',
      loading: false,
      LoadingAdd: false,
      multipleSelection: [],
      collectionStateFlag: false,
      StaffCodeArray: [], // 选中的人员编号数组
      DepartmentArray: [],
      pickerOptionsAdd: {},
      addStaffRules: {
        StaffNameAdd: [
          { required: true, message: "请输入姓名", trigger: "blur" },
        ],
        SexAdd: [
          { required: true, message: "请选择性别", trigger: "blur" },
        ],
        DocumentTypeCodeAdd: [
          { required: true, message: "请选择证件类型", trigger: "change" },
        ],
        PhoneNumberAdd: [
          { required: false, message: "", trigger: "blur", validator: checkMobile, },
        ],
        IdentificationNumberAdd: [
          { required: true, message: "", trigger: "blur", validator: checkIdentificationNumber, },
        ],
        DateOfBirthAdd: [
          { required: true, message: "请选择出生日期", trigger: "change" },
        ],
        MedicalInsuranceAddress: [
          { required: true, message: "请输入医保地址", trigger: "blur", validator: checkMedicalInsuranceAddress, },
        ],
        MedicalInsuranceTypeCodeAdd: [
          { required: true, message: "请选择医保类型", trigger: "change" },
        ],
        EmployeeRelationshipCodeAdd: [
          { required: true, message: "请选择与员工关系", trigger: "change" },
        ],
        MainStaffNameAdd: [
          { required: true, message: "请输入主被保险人姓名", trigger: "blur" },
        ],
        IdentificationNumberMainAdd: [
          { required: true, message: "请输入主被保险人证件号码", trigger: "blur" },
        ],
        ProgramNameAdd: [
          { required: true, message: "请选择方案名称", trigger: "change" },
        ],
        ProtectionStartDateAdd: [
          { required: true, message: "请选择保障开始期间", trigger: "change" },
        ],
        ProtectionEndDateAdd: [
          { required: true, message: "请选择保障结束期间", trigger: "change" },
        ],
      },
      IfUpdate: false, // 用来判断是添加还是修改
      updateDialogVisible: false,
      updateStaffFrom: {
        EndDate: '',
      },
      pickerOptionsUpdate: {},
      LoadingUpdate: false,
      ProgramNameImport: '',
      ImportDialogVisible: false,
      activeName: 'first',
      buttonShow: true, // 默认第一个选项卡显示
      UploadFlag: false, // 上传标识和buttonShow是反向的，但是如果是批量删除并且继续提交的话，那么这两个参数都需要传入false
      EnterpriseData: null,
      uploadLoading: false,
      fileList: [], // 文件列表
      fileListRepeatDelete: [], // 文件列表
      fileDeleteCatch: null, // 批量删除并且继续提交用到此参数
      UpdateWidth: 80,
      IfClearableEnterprise: true,
    };
  },
  computed: {
    // 计算属性不需要在上面数据中重新定义了，直接在组件中使用即可
    actionUrl() {
      return process.env.VUE_APP_BASE_API + "/HrMain/UploadFiles?EnterPriseCode=" + this.WhereParameter.EnterPriseCode +
        '&ProgramCode=' + this.ProgramNameImport + '&flag=' + this.buttonShow + '&deleteFlag=' + this.UploadFlag;
    }
  },
  created() { },
  // 加载完成后执行调取回款数据接口
  mounted() {
    if (this.$store.getters.roles.indexOf(7) != -1) { this.ReadOnly = true }
    this.myHeaders['X-Token'] = this.$store.getters.token;
    this.rolesFlag = this.$store.getters.roles;

    this.IfClearableEnterprise = !this.$store.getters.ParentCode;

    if (this.rolesFlag[0] == 5) { this.UpdateWidth = 170; } else { this.UpdateWidth = 80; }
    // 只有客服和超级管理员能获取多个公司，公司账号只能获取自己本身的公司
    // if (this.UserBaseInfoLoginBackstage) {
    this.GetEnterpriseList();
    // }
    this.InsuranceTypeCode = this.$store.getters.InsuranceTypeCode;
  },
  methods: {
    async DeleteStaffDialog(row) {
      const confirmResult = await this.$confirm(
        "删除会连同他下面的关联人的投保数据一起删除不可恢复，是否执行删除？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      } else {
        DeleteStaff(row.StaffCode, row.ProgramCode, this.WhereParameter.EnterPriseCode).then((res) => {
          if (res.success) {
            this.$message.success("操作成功");
            this.GetProgramInfoAll(this.WhereParameter.EnterPriseCode, false)
          } else {
            this.$message.error("删除失败");
          }
        });
      }
    },
    // 执行上方按钮更多操作
    handleButtonCommand(flag) {
      this.isShowProgress = true;
      this.fakes.start();
      switch (flag) {
        case "a":
          this.ExportStaff();
          break;
        case "b":
          this.ExportStaffAll(false);
          break;
        case "c":
          this.ExportStaffAll(true);
          break;
      }
    },
    // 导出选中方案在保
    ExportStaff() {
      if (this.WhereParameter.CreateTime && this.WhereParameter.CreateTime.length > 0) {
        this.WhereParameter.BeginTime = this.$moment(this.WhereParameter.CreateTime[0]).format("YYYY-MM-DD");
        this.WhereParameter.EndTime = this.$moment(this.WhereParameter.CreateTime[1]).format("YYYY-MM-DD");
      } else {
        this.WhereParameter.BeginTime = '';
        this.WhereParameter.EndTime = '';
      }
      var parameter = {
        EnterPriseCode: this.WhereParameter.EnterPriseCode,
        StaffName: this.WhereParameter.StaffName,
        IdentificationNumber: this.WhereParameter.IdentificationNumber,
        ProgramCode: this.WhereParameter.ProgramCode,
        DepartmentCode: this.WhereParameter.DepartmentCode,
        BeginTime: this.WhereParameter.BeginTime,
        EndTime: this.WhereParameter.EndTime,
        UnderInsurance: this.WhereParameter.UnderInsurance,
        ToBeReviewed: this.WhereParameter.ToBeReviewed,
        Rejected: this.WhereParameter.Rejected,
        Invalid: !this.WhereParameter.Invalid,
        StaffAdd: this.WhereParameter.StaffAdd,
        PageIndex: 1,
        PageSize: 100000,
      }
      ExportStaffList(parameter).then((res) => {
        this.fakes.end();
        // 初始化进度条
        setTimeout(() => {
          this.fakes = new FakeProgress({
            timeConstant: 10000,
            autoStart: false
          });
          this.isShowProgress = false;
        }, 800)
        if (res.success) {
          window.location.href = res.result;
        } else {
          this.$message.error("导出失败，请重新刷新页面");
        }
      });
    },
    // 导出选中方案在保
    ExportStaffAll(ifNoInsurance) {
      ExportStaffListAll(this.WhereParameter.ParentEnterPriseCode, ifNoInsurance).then((res) => {
        this.fakes.end();
        // 初始化进度条
        setTimeout(() => {
          this.fakes = new FakeProgress({
            timeConstant: 10000,
            autoStart: false
          });
          this.isShowProgress = false;
        }, 800)
        if (res.success) {
          window.location.href = res.result;
        } else {
          this.$message.error("导出失败，请重新刷新页面");
        }
      });
    },
    handleClick(tab, event) {
      if (tab.name == 'first') {
        this.buttonShow = true;
        this.UploadFlag = false;
      } else {
        this.buttonShow = false;
        this.UploadFlag = true;
      }
    },
    // 只考虑修改数据的情况，如果是本人，那么关联修改
    StaffNameAddChange() {
      if (this.addStaffForm.DocumentTypeCodeAdd == "1" && this.IfUpdate) { this.addStaffForm.MainStaffNameAdd = this.addStaffForm.StaffNameAdd; }
    },
    // 只考虑修改数据的情况，如果是本人，那么关联修改
    IdentificationNumberAddChange() {
      if (this.addStaffForm.DocumentTypeCodeAdd == "1" && this.IfUpdate) { this.addStaffForm.IdentificationNumberMainAdd = this.addStaffForm.IdentificationNumberAdd; }
    },
    // 只考虑修改数据的情况，如果是本人，那么关联修改
    MainStaffNameAddChange() {
      if (this.addStaffForm.DocumentTypeCodeAdd == "1" && this.IfUpdate) { this.addStaffForm.StaffNameAdd = this.addStaffForm.MainStaffNameAdd; }
    },
    // 只考虑修改数据的情况，如果是本人，那么关联修改
    MainIdentificationNumberAddChange() {
      if (this.addStaffForm.DocumentTypeCodeAdd == "1" && this.IfUpdate) { this.addStaffForm.IdentificationNumberAdd = this.addStaffForm.IdentificationNumberMainAdd; }
    },
    // 切换方案
    ProgramChangeAdd() {
      this.ProgramCodesArray.forEach((item) => {
        if (item.ProgramCode == this.addStaffForm.ProgramNameAdd) {
          this.addStaffForm.ProtectionEndDateAdd = moment(item.EndTime).format('YYYY-MM-DD');
        }
      })
    },
    // 根据身份证自动赋值
    changeOther() {
      if (this.addStaffForm.IdentificationNumberAdd && this.addStaffForm.DocumentTypeCodeAdd == "1") {
        if (!this.isCardNo(this.addStaffForm.IdentificationNumberAdd)) {
          return;
        } else {
          if (this.addStaffForm.EmployeeRelationshipCodeAdd == "1") {
            this.addStaffForm.MainStaffNameAdd = this.addStaffForm.StaffNameAdd;
            this.addStaffForm.IdentificationNumberMainAdd = this.addStaffForm.IdentificationNumberAdd;
          }
        }
        IdentityCardValidated(this.addStaffForm.IdentificationNumberAdd).then((res) => {
          if (res.success) {
            this.addStaffForm.DateOfBirthAdd = res.result.birthday;
            this.addStaffForm.SexAdd = res.result.sex == "男" ? "0" : "1";
          }
        });
      }
    },
    isCardNo(card) {
      // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (reg.test(card) === false) {
        return false;
      } else {
        return true;
      }
    },
    // 添加投保数据
    addStaff() {
      this.LoadingAdd = true;
      // 提交请求前，表单预验证
      this.$refs.addStaffRef.validate(async (valid, object) => {
        // 表单预校验失败
        if (!valid) {
          this.LoadingAdd = false;
          return;
        } else {
          if (moment(this.addStaffForm.ProtectionStartDateAdd).valueOf() > moment(this.addStaffForm.ProtectionEndDateAdd).valueOf()) {
            this.LoadingAdd = false;
            return this.$message.warning("投保的开始日期不能大于结束日期，请检查");
          }
          // 日期格式化
          this.addStaffForm.ProtectionStartDateAdd = this.addStaffForm.ProtectionStartDateAdd
            ? moment(this.addStaffForm.ProtectionStartDateAdd).format('YYYY-MM-DD')
            : "";
          this.addStaffForm.ProtectionEndDateAdd = this.addStaffForm.ProtectionEndDateAdd
            ? moment(this.addStaffForm.ProtectionEndDateAdd).format('YYYY-MM-DD')
            : "";
          this.addStaffForm.DateOfBirthAdd = this.addStaffForm.DateOfBirthAdd
            ? moment(this.addStaffForm.DateOfBirthAdd).format('YYYY-MM-DD')
            : "";
          var addparameter = {
            StaffName: this.addStaffForm.StaffNameAdd,
            IdentificationNumber: this.addStaffForm.IdentificationNumberAdd,
            DateOfBirth: this.addStaffForm.DateOfBirthAdd,
            MedicalInsuranceAddress: this.addStaffForm.MedicalInsuranceAddress,
            EmployeeRelationshipCode: this.addStaffForm.EmployeeRelationshipCodeAdd,
            IdentificationNumberMain: this.addStaffForm.IdentificationNumberMainAdd,
            DocumentTypeCode: this.addStaffForm.DocumentTypeCodeAdd,
            Sex: this.addStaffForm.SexAdd,
            PhoneNumber: this.addStaffForm.PhoneNumberAdd,
            MedicalInsuranceTypeCode: this.addStaffForm.MedicalInsuranceTypeCodeAdd,
            MainStaffName: this.addStaffForm.MainStaffNameAdd,
            ProgramName: this.addStaffForm.ProgramNameAdd,
            StaffAddress: this.addStaffForm.StaffAddressAdd,
            DepartmentCode: this.addStaffForm.DepartmentCodeAdd,
            JobNo: this.addStaffForm.JobNoAdd,
            JobType: this.addStaffForm.JobTypeAdd,
            ProtectionStartDate: this.addStaffForm.ProtectionStartDateAdd,
            ProtectionEndDate: this.addStaffForm.ProtectionEndDateAdd,
            OccupationCategory: this.addStaffForm.AddOccupationCategory,
            EnterpriseCode: this.WhereParameter.EnterPriseCode,
            StaffCode: this.addStaffForm.StaffCode,
            MainStaffCode: this.addStaffForm.MainStaffCode,
          };
          if (this.IfUpdate) {
 UpdateStaffinfo(addparameter).then((res) => {
              this.LoadingAdd = false;
              if (res.success) {
                this.$message.success("修改成功");
                this.addStaffVisible = false;
                this.GetStaffList();
              } else {
                this.$message.error(res.resultMessage);
              }
            });
} else {
 AddStaffinfo(addparameter).then((res) => {
              this.LoadingAdd = false;
              if (res.success) {
                this.$message.success("添加成功");
                this.addStaffVisible = false;
                this.GetProgramInfoAll(this.WhereParameter.EnterPriseCode, false)
              } else {
                this.$message.error(res.resultMessage);
              }
            });
}
        }
      });
    },
    // 添加窗口关闭
    detailAddDialogVisibleClosed() {
      // //初始化data-addStaffForm 的数据
      // 使用重置数据不能再data中定义this，可以在初始化时定义
      this.$data.addStaffForm = this.$options.data().addStaffForm;
      this.$refs.addStaffRef.resetFields();
      this.addStaffVisible = false;
    },
    detailAddDialogVisibleReset() {
      this.$data.addStaffForm = this.$options.data().addStaffForm;
      this.addStaffForm.DocumentTypeCodeAdd = '1';
      this.addStaffForm.EmployeeRelationshipCodeAdd = '1';
      this.$refs.addStaffRef.resetFields();
    },
    // 正序
    sortKey(array, key) {
      return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : (x > y) ? 1 : 0)
      })
    },

    // 弹出添加窗口(修改需要传入参数)
    ShowAddStaffDialog(row) {
      // 获取配置下拉数据
      GetDataConfigData().then((res) => {
        if (res.success) {
          this.DocumentTypeArray = this.sortKey(res.result.filter((item) => {
            return item.DataTypes == "DocumentType";
          }), 'ConfigValue');
          this.MedicalInsuranceTypeArray =
            this.sortKey(res.result.filter((item) => {
              return item.DataTypes == "MedicalInsuranceType";
            }), 'ConfigValue');

          this.EmployeeRelationsArray =
            this.sortKey(res.result.filter((item) => {
              return item.DataTypes == "EmployeeRelations";
            }), 'ConfigValue');
        } else {
          this.DataConfigList = [];
        }
      });
      var whereClass = {
        EnterpriseCode: this.WhereParameter.EnterPriseCode,
        States: 0,
        PageIndex: 1,
        PageSize: 100000,
      }
      // 获取当前选中付款方的方案数据
      GetProgramList(whereClass).then((res) => {
        if (res.success) {
          this.ProgramCodesArray = res.result.data;
        } else {
          this.ProgramCodesArray = [];
        }
      });
      // 获取当前付款方的部门历史数据
      GetAddDepartmentList(this.WhereParameter.EnterPriseCode).then((res) => {
        if (res.success) {
          this.DepartmentArray = res.result;
        } else {
          this.DepartmentArray = [];
        }
      });
      // 获取企业用户日期范围限制参数
      GetRangeDate(true).then((res) => {
        if (res.success) {
          this.RangeDateArray = res.result;
          this.pickerOptionsAdd.disabledDate = (time) => {
            return (
              time.getTime() < moment(this.RangeDateArray.BeginDate).valueOf() ||
              time.getTime() > moment(this.RangeDateArray.EndDate).valueOf()
            );
            // if (this.RangeDateArray.InsuranceTypeCode == 1) {
            //   return (
            //     time.getTime() < moment(this.RangeDateArray.MinDate).valueOf()
            //     || time.getTime() > moment(this.RangeDateArray.EndDate).valueOf()
            //   );
            // }
            // else {
            //   return (
            //     time.getTime() < moment(this.RangeDateArray.BeginDate).valueOf()
            //     || time.getTime() > moment(this.RangeDateArray.EndDate).valueOf()
            //   );
            // }
          }
        } else {
          this.RangeDateArray = [];
        }
      });
      // 如果是修改数据
      if (row) {
        this.IfUpdate = true;
        this.addStaffForm.StaffNameAdd = row.StaffName;
        this.addStaffForm.SexAdd = row.Sex != null ? row.Sex.toString() : null;
        this.addStaffForm.DocumentTypeCodeAdd = row.DocumentTypeCode;
        this.addStaffForm.IdentificationNumberAdd = row.IdentificationNumber;
        this.addStaffForm.DateOfBirthAdd = moment(row.DateOfBirth).format('YYYY-MM-DD');
        this.addStaffForm.PhoneNumberAdd = row.PhoneNumber;
        this.addStaffForm.MedicalInsuranceAddress = row.MedicalInsuranceAddress;
        this.addStaffForm.MedicalInsuranceTypeCodeAdd = row.MedicalInsuranceTypeCode;
        this.addStaffForm.EmployeeRelationshipCodeAdd = row.EmployeeRelationshipCode;
        this.addStaffForm.ProgramNameAdd = row.ProgramCode;
        this.addStaffForm.MainStaffNameAdd = row.MainStaffName;
        this.addStaffForm.IdentificationNumberMainAdd = row.IdentificationNumberMain;
        this.addStaffForm.ProtectionStartDateAdd = moment(row.ProtectionStartDate).format('YYYY-MM-DD');
        this.addStaffForm.ProtectionEndDateAdd = moment(row.ProtectionEndDate).format('YYYY-MM-DD');
        this.addStaffForm.StaffAddressAdd = row.StaffAddress;
        this.addStaffForm.AddOccupationCategory = row.OccupationCategory;
        this.addStaffForm.DepartmentCodeAdd = row.DepartmentCode;
        this.addStaffForm.JobNoAdd = row.JobNo;
        this.addStaffForm.JobTypeAdd = row.JobType;
        this.addStaffForm.StaffCode = row.StaffCode;
        this.addStaffForm.MainStaffCode = row.MainStaffCode;
      } else {
        this.addStaffForm.DocumentTypeCodeAdd = '1';
        this.addStaffForm.EmployeeRelationshipCodeAdd = '1';
        this.IfUpdate = false;
      }
      this.addStaffVisible = true;
    },

    // 列表时间格式化
    dateFormat(row) {
      if (row) {
        return this.$moment(row).format("YYYY-MM-DD HH:mm:ss");
      } else { return null; }
    },
    // 性别格式化
    SexFormat(row, column, cellValue, index) {
      const daterc = row[column.property]
      if (daterc != null) {
        return daterc == '0' ? '男' : '女'
      }
    },
    // 出生日期
    DateOfBirthFormat(row) {
      if (row) {
        return this.$moment(row).format("YYYY-MM-DD");
      } else { return null; }
    },
    toggleSelection(row, column, event) {
      if (column && column.label != "操作") { this.$refs.multipleTable.toggleRowSelection(row); }
    },
    TableSelect(selection) {
      this.multipleSelection = selection;
      if (selection.length != 0) {
        this.StaffCodeArray = [];
        selection.forEach((element) => {
          const item = {
            StaffCode: element.StaffCode,
            ProgramCode: element.ProgramCode,
            OrderCode: element.OrderCode,
          }
          this.StaffCodeArray.push(item);
        });
      } else {
        this.StaffCodeArray = [];
      }
    },
    showBackground({ row }) {
      const checkIdList = this.multipleSelection.map((item) => item.ProgramName + item.IdentificationNumber + item.CreateTime);
      if (checkIdList.includes(row.ProgramName + row.IdentificationNumber + row.CreateTime)) {
        return {
          backgroundColor: "#EAF6E3",
        };
      } else {
        return {
          backgroundColor: "#FFFFFF",
        };
      }
    },
    // 保存修改
    saveUpdate() {
      if (!this.updateStaffFrom.EndDate) {
        this.$message.warning("请选择修改的保障结束日期");
        return
      }
      this.LoadingUpdate = true;
      const where = {
        EndDate: moment(this.updateStaffFrom.EndDate).format('YYYY-MM-DD'),
        StaffCodeArray: this.StaffCodeArray,
        EnterPriseCode: this.WhereParameter.EnterPriseCode,
      }
      DeleteData(where).then((res) => {
        if (res.success) {
          this.updateStaffFrom.EndDate = '';
          this.updateDialogVisible = false;
          this.$message.success("操作成功");
          this.GetProgramInfoAll(this.WhereParameter.EnterPriseCode, false);
        } else {
          this.$message.error(res.resultMessage);
        }
        this.LoadingUpdate = false;
      });
    },

    // 监听 pagesize改变的事件
    handleSizeChange(newSize) {
      this.WhereParameter.PageSize = newSize;
      this.GetStaffList();
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newSize) {
      this.WhereParameter.PageIndex = newSize;
      this.GetStaffList();
    },
    // 弹出上传文件窗口
    ImportStaffDialog() {
      var whereClass = {
        EnterpriseCode: this.WhereParameter.EnterPriseCode,
        States: 0,
        PageIndex: 1,
        PageSize: 100000,
      }
      // 获取当前选中付款方的方案数据
      GetProgramList(whereClass).then((res) => {
        if (res.success) {
          this.ProgramCodesArray = res.result.data;
        } else {
          this.ProgramCodesArray = [];
        }
      });
      this.ImportDialogVisible = true;
    },
    // 弹出修改日期窗口
    UpdateDialog() {
      if (this.StaffCodeArray.length == 0) {
        this.$message.info("请勾选要修改结束日期的投保数据！");
        return;
      }
      this.updateStaffFrom.EndDate = "";
      // 获取企业用户日期范围限制参数
      GetRangeDate(false).then((res) => {
        if (res.success) {
          this.pickerOptionsUpdate.disabledDate = (time) => {
            return (
              time.getTime() < moment(res.result.BeginDate).valueOf() ||
              time.getTime() > moment(res.result.EndDate).valueOf()
            );
          }
        }
      });
      this.updateStaffFrom.EndDate = '';
      this.updateDialogVisible = true;
    },
    GetAdmin_PermissionSearch() {
      this.WhereParameter.PageIndex = 1;
      this.WhereParameter.PageSize = 20;
      this.GetStaffList();
    },
    // 获取员工方案列表数据
    GetStaffList() {
      this.loading = true;
      if (this.WhereParameter.CreateTime && this.WhereParameter.CreateTime.length > 0) {
        this.WhereParameter.BeginTime = this.$moment(this.WhereParameter.CreateTime[0]).format("YYYY-MM-DD");
        this.WhereParameter.EndTime = this.$moment(this.WhereParameter.CreateTime[1]).format("YYYY-MM-DD");
      } else {
        this.WhereParameter.BeginTime = '';
        this.WhereParameter.EndTime = '';
      }
      var parameter = {
        EnterPriseCode: this.WhereParameter.EnterPriseCode,
        StaffName: this.WhereParameter.StaffName,
        IdentificationNumber: this.WhereParameter.IdentificationNumber,
        ProgramCode: this.WhereParameter.ProgramCode,
        DepartmentCode: this.WhereParameter.DepartmentCode,
        BeginTime: this.WhereParameter.BeginTime,
        EndTime: this.WhereParameter.EndTime,
        UnderInsurance: this.WhereParameter.UnderInsurance,
        ToBeReviewed: this.WhereParameter.ToBeReviewed,
        Rejected: this.WhereParameter.Rejected,
        Invalid: !this.WhereParameter.Invalid,
        StaffAdd: this.WhereParameter.StaffAdd,
        PageIndex: this.WhereParameter.PageIndex,
        PageSize: this.WhereParameter.PageSize,
      }
      GetStaffList(
        parameter
      ).then((res) => {
        if (res.success) {
          this.StaffList = res.result.data;
          this.total = res.result.count;
        } else {
          this.StaffList = [];
          this.total = 0;
        }
        this.loading = false;
      });
    },

    UploadHttpRequest() {
      if (!this.ProgramNameImport) {
        this.$message.warning("请选择方案！");
        return false;
      }
      if (this.fileList.length <= 0) {
        this.$message.warning("请先选择需要上传的文件！");
        return false;
      }
      this.uploadLoading = true;
      var token = this.$store.getters.token;
      const formData = new FormData();
      formData.append("file", this.fileDeleteCatch);
      formData.append("EnterPriseCode", this.WhereParameter.EnterPriseCode);
      formData.append("ProgramCode", this.ProgramNameImport);
      formData.append("flag", this.buttonShow);
      formData.append("deleteFlag", this.UploadFlag);
      axios({
        // 用axios发送post请求
        method: "post",
        url: process.env.VUE_APP_BASE_API + "/HrMain/UploadFiles",
        headers: {
          'X-Token': token,
        },
        data: formData
      }).then((response) => {
        this.uploadLoading = false;
        this.fileList = [];
        if (response.status == 200) {
          // 删除时传入的存储缓存清空
          this.fileDeleteCatch = null;
          this.$message({
            type: 'success',
            showClose: true,
            message: response.data.resultMessage,
            duration: 6000
          });
          this.ProgramNameImport = '';
          this.activeName = 'first';
          this.buttonShow = true;
          this.UploadFlag = false;
          this.ImportDialogVisible = false;
          this.GetProgramInfoAll(this.WhereParameter.EnterPriseCode, false);
        }
      });
    },
    BeforeUploadFile(file) {
      this.fileDeleteCatch = file;
    },
    // 导入方法
    submitUpload(param) {
      if (!this.ProgramNameImport) {
        this.$message.warning("请选择方案！");
        return false;
      }
      if (this.fileList.length <= 0) {
        this.$message.warning("请先选择需要上传的文件！");
        return false;
      }
      this.uploadLoading = true;
      this.$refs.upload.submit();
    },
    // 文件上传服务端失败时的钩子
    fileUploadFail: function (err, file, fileList) {
      console.log(err);
    },
    // 文件上传服务端成功时的钩子
    fileUploadSuccess: async function (response, file, fileList) {
      this.uploadLoading = false;
      this.fileListRepeatDelete = this.fileList;
      this.fileList = [];
      // 清空已上传的文件列表
      this.$refs.upload.clearFiles();
      if (response.success) {
        // if (this.buttonShow)
        //   this.$message.success(response.resultMessage);
        // else
        //   this.$message.success(response.resultMessage);
        this.$message({
          type: 'success',
          showClose: true,
          message: response.resultMessage,
          duration: 6000
        });
        this.ProgramNameImport = '';
        this.activeName = 'first';
        this.buttonShow = true;
        this.UploadFlag = false;
        this.ImportDialogVisible = false;
        this.GetProgramInfoAll(this.WhereParameter.EnterPriseCode, false);
      // eslint-disable-next-line brace-style
      }
      // 删除时里面有之前删除的数据，那么需要问询是否继续操作
      else if (!response.success && response.resultCode == "continue") {
        const confirmResult = await this.$confirm(
          response.resultMessage,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => err);
        if (confirmResult !== "confirm") {
          return this.$message.info("已取消删除");
        } else {
          this.fileList = this.fileListRepeatDelete;
          this.uploadLoading = true;
          this.activeName = 'first';
          this.buttonShow = false;
          this.UploadFlag = false;
          this.UploadHttpRequest();
        }
      } else {
        this.$message.error(response.resultMessage);
      }
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    fileChange(file, fileList) {
      // 解决无法判断el-upload是否上传过文件问题
      this.fileList = fileList;
      this.fileListCopy = fileList;
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.fileList = [];
      // return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log(file);
    },
    // 模板下载
    downloadTemplate() {
      var EnterPriseCode = this.WhereParameter.EnterPriseCode;
      var token = this.$store.getters.token;
      axios({
        // 用axios发送post请求
        method: "post",
        url: process.env.VUE_APP_BASE_API + "/HrMain/ExportEmployee", // 请求地址
        responseType: "blob", // 表明返回服务器返回的数据类型
        headers: {
          "Content-Type": "application/json",
          'X-Token': token,
        },
        params: { EnterPriseCode }
      }).then((res) => {
        // 处理返回的文件流
        const blob = new Blob([res.data]); // new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
        const fileName = (this.EnterpriseData && this.EnterpriseData.Simples != 1) ? "批量上传普通模板.xlsx" : "批量上传简易模板.xlsx"; // 下载文件名称
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      });
    },
    // 删减模板下载
    downloadDepeteTemplate() {
      var token = this.$store.getters.token;
      axios({
        // 用axios发送post请求
        method: "post",
        url: process.env.VUE_APP_BASE_API + "/HrMain/ExportDeleteEmployee", // 请求地址
        responseType: "blob", // 表明返回服务器返回的数据类型
        headers: {
          "Content-Type": "application/json",
          'X-Token': token,
        },
      }).then((res) => {
        // 处理返回的文件流
        const blob = new Blob([res.data]);
        const fileName = "批量删减模板.xlsx"; // 下载文件名称
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      });
    },
    // 如果登陆人是客服，那么获取公司列表
    GetEnterpriseList() {
      // 传入vuex存储的值
      GetEnterpriseList().then((res) => {
        if (res.success) {
          this.EnterpriseList = res.result.filter((item) => { return item.MenuPermissions != 2 });
          // 如果有数据那么赋个默认的值
          if (this.EnterpriseList.length > 0) {
            this.WhereParameter.ParentEnterPriseCode = this.EnterpriseList[0].ParentEnterPriseCode;
            this.GetChildUser(this.EnterpriseList[0].ParentEnterPriseCode);
          }
        } else {
          this.EnterpriseList = [];
        }
      });
    },
    // 根据父级公司获取分公司
    GetChildUser(ParentEnterPriseCode) {
      this.WhereParameter.EnterPriseCode = '';
      GetChildUser(ParentEnterPriseCode).then((res) => {
        if (res.success) {
          this.ChildEnterpriseList = res.result;
          if (this.ChildEnterpriseList.length > 0) {
            this.WhereParameter.EnterPriseCode = this.ChildEnterpriseList[0].EnterPriseCode;
            this.GetProgramInfoAll(this.ChildEnterpriseList[0].EnterPriseCode, true)
          }
        } else {
          this.ChildEnterpriseList = [];
        }
      });
    },
    // 根据分公司获取改公司下所有方案
    GetProgramInfoAll(EnterPriseCode, Flag) {
      GetProgramInfoAll(
        EnterPriseCode
      ).then((res) => {
        // 初次加载需要清空一下数据
        if (Flag) {
          // 方案和部门清空选中数据默认为空
          this.WhereParameter.ProgramCode = [];
          this.WhereParameter.DepartmentCode = [];
        }

        if (res.success) {
          this.ProgramInfoAllList = res.result;
          // 公司数据
          this.EnterpriseData = res.result1;
          if (this.ProgramInfoAllList.length > 0) {
            // this.WhereParameter.ProgramCode = this.ProgramInfoAllList[0].ProgramCode;
            // 加载完方案后调用加载数据接口
            this.GetAdmin_PermissionSearch();
            this.GetDepartmentList(EnterPriseCode, [])
          }
        } else {
          this.ProgramInfoAllList = [];
        }
      });
    },
    // 根据方案和公司-必填，获取部门信息(公司字段是必须要有的，如果方案为空，那么需要根据付款方来查询下面所有的部门)
    GetDepartmentList(EnterPriseCode, ProgramCodeArray) {
      var parameter = {
        EnterPriseCode: EnterPriseCode,
        ProgramCodeArray: ProgramCodeArray,
      }
      // 方案和部门清空选中数据默认为空
      this.WhereParameter.DepartmentCode = [];
      GetDepartmentList(parameter).then((res) => {
        if (res.success) {
          this.ProgramCodeList = res.result;
        } else {
          this.ProgramCodeList = [];
        }
      });
    },
    // 多选方案改变事件
    ProgramChange(ProgramCodeArray) {
      this.GetDepartmentList(this.WhereParameter.EnterPriseCode, ProgramCodeArray);
    },
    datetimeChange(time) {
      // 强制刷新
      this.$forceUpdate();
    },
  }
};
</script>

<style scoped>
.rangeTimeClass {
  width: 100%;
}

.whereClass {
  width: 100%;
}

.buttonGroupClass {
  margin-left: 1.3rem;
}

.linkClass {
  font-size: 16px;
}

.mallki-text {
  margin-left: 20px;
  vertical-align: middle;
  font-size: 15px;
}

.buttonCenter {
  text-align: center;
  margin-top: 20px;
}

.whereFormClass {
  width: 100%;
}

.line {
  text-align: center;
}

/* 过渡动画用到此样式 */
.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409EFF;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}

.el-range-editor--small.el-input__inner {
  width: 100%;
}

/*遮罩层*/
.popContainer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.6);
}

::v-deep .el-progress__text {
  color: white !important;
}
</style>
