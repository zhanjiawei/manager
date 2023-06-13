<template>

<h2 style="text-align: center;">宿舍管理-学校管理{{this.adCates.id}}</h2>

    <div class="adCates">
        <el-header>
            <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect" style="background-color: #333;" text-color="#8f8f8f" active-text-color="#409eff">

        <router-link to="/school">
      <el-menu-item  style="margin-left: 205px;"><el-icon><MapLocation /></el-icon>学校管理</el-menu-item>
    </router-link>

    <router-link to="/building">
      <el-menu-item style="margin-left: 100px;" plain><el-icon><OfficeBuilding /></el-icon>建筑管理</el-menu-item>
    </router-link>

    <router-link to="/dormitory">
      <el-menu-item style="margin-left: 100px;" plain><el-icon><School /></el-icon>宿舍管理</el-menu-item>
    </router-link>

    <router-link to="/dormitory-student">
      <el-menu-item style="margin-left: 100px;" plain><el-icon><Avatar /></el-icon>住宿管理</el-menu-item>
    </router-link>

    </el-menu>
  </el-header>

        <div class="adcate-tools" style="margin-top: 20px;">
            <el-form-item >
          
            <span class="ml-3 w-35 text-gray-600 inline-flex items-center" style=" margin-left: 130px;">id查询</span>
              <el-input placeholder="输入学校id" style="width: 90px;"  v-model="id"/>
              <el-button :icon="Search" circle style="margin-left: 10px;" @click="toSearch(this.id)"><el-icon><Search /></el-icon></el-button>
              <span class="ml-3 w-35 text-gray-600 inline-flex items-center" style=" margin-left: 60px;">地区查询</span>

              <el-input placeholder="输入省（必填）" style="width: 120px; "  v-model="search.province"/>
        
        <el-input placeholder="输入市（必填）" style="width: 120px; margin-left: 10px;"  v-model="search.city"/>
        <el-input placeholder="输入县（必填）" style="width: 120px; margin-left: 10px;"  v-model="search.county"/>
          
              <el-button :icon="Search" circle style="margin-left: 10px;" @click="toSearchs(this.search)"><el-icon><Search /></el-icon></el-button>
              <el-form-item label="状态查询" :label-width="formLabelWidth" style=" margin-left: 60px;">
                <el-radio v-model="this.enable" label="0">未启动</el-radio>
                <el-radio v-model="this.enable" label="1">启动</el-radio>
            </el-form-item>
              <el-button :icon="Search" circle style="margin-left: 10px;" @click="toEnbleSearch(this.enable)"><el-icon><Search /></el-icon></el-button>
    
           </el-form-item>

        </div>
        <div> 

            <el-form-item >
            <el-button  type="primary" @click="toAdd" plain style="margin-left: 60px;"><el-icon><DocumentAdd /></el-icon>添加数据</el-button> 
            <el-button  type="primary" @click="shuaxin" plain style="margin-left: 60px;"><el-icon><RefreshLeft /></el-icon>刷新页面</el-button>
            <span class="ml-3 w-35 text-gray-600 inline-flex items-center" style=" margin-left: 60px;">地区查询</span> 
            <el-cascader v-model="value" :options="options" @change="handleChange" ></el-cascader>
            <el-button :icon="Search" circle style="margin-left: 10px;" @click="tojilian"><el-icon><Search /></el-icon></el-button>
        </el-form-item>
        </div>
       
        <el-table :data="adCates" style="width: 100%">
            <el-table-column fixed prop="id" label="id" width="180" />

            <el-table-column prop="schoolName" label="校名" width="180" />
            <el-table-column prop="longitude" label="经度" width="150" />
            <el-table-column prop="latitude" label="纬度" width="180" />
            <el-table-column prop="address" label="地址" width="280" />
            <el-table-column prop="enable" label="状态"  :formatter="formatStatus" width="80" ></el-table-column>
        
            
           
            <el-table-column fixed="right" label="操作" width="270">
                <template #default="scope">
                    <el-button  type="primary" @click="toEdit(scope.row)" plain><el-icon><EditPen /></el-icon>修改</el-button> 
                    <el-button  type="danger" @click="del(scope.row.id)" plain><el-icon><Delete /></el-icon>删除</el-button> 
                    <el-button  type="info" @click="toshow(scope.row)" plain><el-icon><Document /></el-icon>详情</el-button> 

                    
                </template>
            </el-table-column>
        </el-table>
       
    </div>

    <!--这个是修改的对话窗口-->
    <el-dialog v-model="dialogFormVisible" title="信息修改"  :show-close="false" :close-on-click-modal='false'>
        <el-form :model="school">
            <el-form-item label="校名" :label-width="formLabelWidth">
                <el-input v-model="school.schoolName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="地址" :label-width="formLabelWidth">
                <el-input v-model="school.address" autocomplete="off" />
            </el-form-item>
            <el-form-item label="城市" :label-width="formLabelWidth">
                <el-input v-model="school.city" autocomplete="off" />
            </el-form-item>
            <el-form-item label="省" :label-width="formLabelWidth">
                <el-input v-model="school.province" autocomplete="off" />
            </el-form-item>
            <el-form-item label="县" :label-width="formLabelWidth">
                <el-input v-model="school.area" autocomplete="off" />
            </el-form-item>
         
            <el-form-item label="创建时间" :label-width="formLabelWidth">
            <el-date-picker v-model="school.createTime" type="datetime" placeholder="选择日期" autocomplete="off"></el-date-picker>
        </el-form-item>

            <el-form-item label="修改时间" :label-width="formLabelWidth">
            <el-date-picker v-model="school.updateTime" type="datetime" placeholder="选择日期" autocomplete="off"></el-date-picker>
        </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input v-model="school.description" autocomplete="off" />
            </el-form-item>
            <el-form-item label="经度" :label-width="formLabelWidth">
                <el-input v-model="school.longitude" autocomplete="off" />
            </el-form-item>
            <el-form-item label="纬度" :label-width="formLabelWidth">
                <el-input v-model="school.latitude" autocomplete="off" />
            </el-form-item>
         
            <el-form-item label="类型" :label-width="formLabelWidth">
                <el-radio-group v-model="school.enable">
                 <el-radio :label="0" >未启用</el-radio>
                 <el-radio :label="1">启用</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="quxiao">取消</el-button>
                <el-button type="primary" @click="save">
                    修改
                </el-button>
            </span>
        </template>
    </el-dialog>

    <!--这个是展示的对话窗口-->
    <el-dialog v-model="dialog" title="详细信息">
        <el-form :model="school">
            <el-form-item label="校名" :label-width="formLabelWidth">
                <el-input v-model="school.schoolName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="地址" :label-width="formLabelWidth">
                <el-input v-model="school.address" autocomplete="off" />
            </el-form-item>
            <el-form-item label="城市" :label-width="formLabelWidth">
                <el-input v-model="school.city" autocomplete="off" />
            </el-form-item>
            <el-form-item label="省" :label-width="formLabelWidth">
                <el-input v-model="school.province" autocomplete="off" />
            </el-form-item>
            <el-form-item label="县" :label-width="formLabelWidth">
                <el-input v-model="school.area" autocomplete="off" />
            </el-form-item>
         
            <el-form-item label="创建时间" :label-width="formLabelWidth">
            <el-date-picker v-model="school.createTime" type="datetime" placeholder="选择日期" autocomplete="off"></el-date-picker>
        </el-form-item>

            <el-form-item label="修改时间" :label-width="formLabelWidth">
            <el-date-picker v-model="school.updateTime" type="datetime" placeholder="选择日期" autocomplete="off"></el-date-picker>
        </el-form-item>
            <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input v-model="school.description" autocomplete="off" />
            </el-form-item>
            <el-form-item label="经度" :label-width="formLabelWidth">
                <el-input v-model="school.longitude" autocomplete="off" />
            </el-form-item>
            <el-form-item label="纬度" :label-width="formLabelWidth">
                <el-input v-model="school.latitude" autocomplete="off" />
            </el-form-item>
            
            <el-form-item label="类型" :label-width="formLabelWidth">
                <el-radio-group v-model="school.enable">
                 <el-radio :label="0" >未启用</el-radio>
                 <el-radio :label="1">启用</el-radio>
                </el-radio-group>
            </el-form-item>
         
        </el-form>

    </el-dialog>


<!--这个是添加的-->
    <el-dialog v-model="dialogForm" title="学校添加"  :show-close="false" :close-on-click-modal='false'>
        <el-form :model="school">
            <el-form-item label="校名" :label-width="formLabelWidth">
                <el-input v-model="school.schoolName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="地址" :label-width="formLabelWidth">
                <el-input v-model="school.address" autocomplete="off" />
            </el-form-item>
            <el-form-item label="城市" :label-width="formLabelWidth">
                <el-input v-model="school.city" autocomplete="off" />
            </el-form-item>
            <el-form-item label="省" :label-width="formLabelWidth">
                <el-input v-model="school.province" autocomplete="off" />
            </el-form-item>
            <el-form-item label="县" :label-width="formLabelWidth">
                <el-input v-model="school.area" autocomplete="off" />
            </el-form-item>

            <el-form-item label="描述" :label-width="formLabelWidth">
                <el-input v-model="school.description" autocomplete="off" />
            </el-form-item>
            <el-form-item label="经度" :label-width="formLabelWidth">
                <el-input v-model="school.longitude" autocomplete="off" />
            </el-form-item>
            <el-form-item label="纬度" :label-width="formLabelWidth">
                <el-input v-model="school.latitude" autocomplete="off" />
            </el-form-item>
         
            <el-form-item label="状态" :label-width="formLabelWidth">
                <el-switch  active-value="1" inactive-value="0" v-model="school.enable"></el-switch>
            </el-form-item>
        </el-form>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="quxiao">取消</el-button>
                <el-button type="primary" @click="save">
                    添加
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>

import { defineComponent } from "vue"
import { schoolPage, schoolDelId, schoolAdd, schoolEdit ,Search,Searchs,enableSearch,studentSearchbydormitory} from "../../http";
import { ElMessage, ElMessageBox } from 'element-plus'
import {cloneDeep} from 'lodash-es'


export default defineComponent({
    data() {
        return {
            adCates: [],
            page: {
                total: 1,
                current: 1,
                size: 10
            },
            id:null,
            enable:0,
            search:{
                "province": "",
                  "city": "",
                  "county": "",
            },
            value:[], // 用来存储选中的省市县数据
            
            options :[ // 需要提前定义好级联选择器的选项数据
      {
        value: '福建省',
        label: '福建省',
        children: [
          {
            value: '泉州市',
            label: '泉州市',
            children: [
              {
                value: '丰泽区',
                label: '丰泽区',
              },
              {
                value: '鲤城区',
                label: '鲤城区',
              },
            ],
          },

          {
            value: '厦门市',
            label: '厦门市',
            children: [
              {
                value: '思明区',
                label: '思明区',
              },
              {
                value: '湖里区',
                label: '湖里区',
              },
            ],
          }
        
        
        ]
        }
        ],

            result: '',
            dialogFormVisible: false,
            dialogForm:false,
            dialog:false,
            school: {
                "province": "",
                  "city": "",
                  "area": "",
                  "schoolName": "",
                  "longitude": "",
                  "id": 0,
                  "latitude": "",
                  "address": "",
                  "enable": "",
                  "description": "",
                  "createTime":"",
                  "updateTime":'',
                  "deleted":'0',
            },

            formLabelWidth: 80
        }
    },
    mounted() {
        this.getAdCatesPage()
    },

    methods: {
        toEdit(adcate) {
            console.log(adcate);
            this.dialogFormVisible=true;
            this.school=cloneDeep(adcate);    
        },

        toshow(adcate){
            console.log(adcate);
            this.dialog=true;
            this.school=cloneDeep(adcate); 
        },
        formatStatus(row, column, cellValue) {
    return cellValue === 0 ? '未启用' : '启用';
  },

  tojilian(){
console.log(this.value)
this.search.province=this.value[0]
this.search.city=this.value[1]
this.search.county=this.value[2]
console.log(this.search)
Searchs(this.search).then(res => {
                console.log(res.data.schools);
                this.adCates=[],
                this.adCates=res.data.schools
                this.search.province=""
                this.search.city=""
                this.search.county=""
            }).catch(err => {
                console.log(err);
            })     
  },
  quxiao(){
   this.dialogFormVisible=false,
   this.dialogForm=false
   this.qingkong()
  },
  qingkong(){
   this. school.province= "",
   this. school.city= "",
   this. school.area="",
   this. school.schoolName="",
   this. school.longitude="",
   this. school.id= 0,
   this. school.latitude= "",
   this. school.address= "",
   this. school.enable= "",
   this. school.description= "",
   this. school.createTime="",
   this. school.updateTime='',
   this. school.deleted='0'
  },
        //获取页面数据
        getAdCatesPage() {
  
            schoolPage().then(res => {
                console.log(res);
                this.adCates=res.data.schools
            }).catch(err => {
                console.log(err);
            })

        },

        currentchange(current) {
            // console.log(current);
            this.getAdCatesPage(current);
            this.page.current = current;//数据更新目前显示的页面
        },
        del(id) {
  
            //删除数据
            //模拟删除，服务器进行处理 
            //要别人反悔机会
            // 如果只有一条数据，删除数据之后如何处理？
            //人机交互
            console.log(id)
            const params = {
                id: id
            }
            ElMessageBox.confirm('确定删除该信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 用户点击了确定按钮，执行下面代码。 
        console.log(params)
        schoolDelId(params).then(res => {
                if (res.success) {
                    this.getAdCatesPage()
                    ElMessage.success(res.msg)

                }
                else {
                    console.log(res.msg)
                    ElMessage.error(res.msg)
                    return false
                }

            }).catch(err => {

            })
        console.log("需要删除的id为：" + id);
      }).catch(() => {
        // 用户点击了取消按钮或者弹框关闭。
        console.log("用户取消了删除操作");
      });
        

        },
        toAdd() {
            //到添加的页面
            this.dialogForm = true;
        },
        save() {
            const school = this.school;
            if (school.id == 0) {
                schoolAdd(school).then(res => {
                    if (res.success) {
                        //刷新页面
                        this.dialogForm = false;
                        this.getAdCatesPage();
                        this.qingkong();
                        ElMessage.success(res.msg)
                    }
                    else {
                        ElMessage(res.msg)
                        return false
                    }
                }).catch(err => {
                    ElMessage('网络错误联系管理员')
                })
            }
            else{
                schoolEdit(school).then(res => {
                    if (res.success) {
                        //刷新页面
                        this.dialogFormVisible = false;
                        this.getAdCatesPage();
                        this.qingkong();
                        ElMessage(res.msg)
                    }
                    else {
                        ElMessage(res.msg)
                        return false
                    }
                }).catch(err => {
                    ElMessage('网络错误联系管理员')
                })
            }

        },
        //通过id进行搜索
        toSearch(id){
            const params = {
                id: id
            }
            Search(params).then(res => {
                console.log(res.data.school);
                this.adCates=[],
                this.adCates.push(res.data.school)
             // this.adCates=res.data.permission

             // console.log(this.adCates);

              //  this.getAdCatesPage(this.page.current)
            }).catch(err => {
                console.log(err);
            })
          //  console.log(this.adCates)
        
        },
        //多条件查询
        toSearchs(search){
           
            console.log(search);
            Searchs(search).then(res => {
                console.log(res.data.schools);
                this.adCates=[],
                this.adCates=res.data.schools
            }).catch(err => {
                console.log(err);
            })     
        },
        //页面刷新
        shuaxin(){
            this.getAdCatesPage();
        },
        //通过学校状态进行查询
        toEnbleSearch(enable){
            const params = {
                enable: enable
            }
            console.log(params)
            enableSearch(params).then(res => {
                console.log(res.data.schools);
                this.adCates=res.data.schools
             // this.adCates=res.data.permission

             // console.log(this.adCates);

              //  this.getAdCatesPage(this.page.current)
            }).catch(err => {
                console.log(err);
            })

        }

    }

});
</script>

<style lang="scss" scoped></style>
