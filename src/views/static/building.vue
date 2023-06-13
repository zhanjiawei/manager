<template>
    <!--
         1 el-table显示数据,分页 
         2  token cookie|session 服务端保存状态信息方式   
         H5 token 如果有值 登录状态 否则就是登录
         进入某个页面就要进行拦截：判断用户是否登录
         通过什么方式：路由守卫
         3 添加和更新
    -->
<h2 style="text-align: center;">宿舍管理-建筑管理{{this.adCates.id}}</h2>


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
            <el-button  type="primary" @click="toAdd" plain style="margin-left: 60px;"><el-icon><DocumentAdd /></el-icon>添加数据</el-button> 
              <el-input placeholder="请输入建筑id" style="width: 120px; margin-left: 80px;"  v-model="id"/>
              <el-button :icon="Search" circle style="margin-left: 10px;" @click="toSearch(this.id)"><el-icon><Search /></el-icon></el-button>

              <el-select v-model="schoolId" placeholder="请选择学校" style="margin-left: 80px;">
                <el-option v-for="item in schools" :key="item.id" :label="item.schoolName" :value="item.id" v-model="schoolId" />
            </el-select>
              <el-button :icon="Search" circle style="margin-left: 10px;" @click="toSearchbyschool(this.schoolId)"><el-icon><Search /></el-icon></el-button>
              <el-button  type="primary" @click="shuaxin" plain style="margin-left: 60px;"><el-icon><RefreshLeft /></el-icon>刷新页面</el-button> 
           </el-form-item>

        </div>
        <el-table :data="adCates" style="width: 100%">
            <el-table-column fixed prop="id" label="id" width="180" />
            <el-table-column prop="chager" label="楼管" width="270"/>
            <el-table-column prop="name" label="楼栋名" width="270" />
            <el-table-column prop="schoolId" label="所属校园编号（schoolid）" width="270" />
            
           
            <el-table-column fixed="right" label="操作" width="220">
                <template #default="scope">
                    <el-button  type="primary" @click="toEdit(scope.row)" plain><el-icon><EditPen /></el-icon>修改</el-button> 
                    <el-button  type="danger" @click="del(scope.row.id)" plain><el-icon><Delete /></el-icon>删除</el-button> 
                    
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :page-size="page.size" :total="page.total"
            @current-change="currentchange" />
    </div>

    <!--这个是修改的对话窗口-->
    <el-dialog v-model="dialogFormVisible" title="建筑信息编辑" :show-close="false" :close-on-click-modal='false'>
        <el-form :model="adCate">
          
            <el-form-item label="楼管" :label-width="formLabelWidth">
                <el-input v-model="adCate.chager" autocomplete="off" />
            </el-form-item>
            <el-form-item label="所属学校" :label-width="formLabelWidth">
            <el-select v-model="adCate.schoolId" placeholder="请选择学校">
                <el-option v-for="item in schools" :key="item.id" :label="item.schoolName" :value="item.id" v-model="schoolId" />
            </el-select>
            </el-form-item>
            <el-form-item label="楼栋名" :label-width="formLabelWidth">
                <el-input v-model="adCate.name" autocomplete="off" />
            </el-form-item>
      </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">Cancel</el-button>
                <el-button type="primary" @click="save">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>

<!--这个是添加的-->
    <el-dialog v-model="dialogForm" title="建筑添加" :show-close="false" :close-on-click-modal='false'>
        <el-form :model="adCate">
          
            <el-form-item label="楼管" :label-width="formLabelWidth">
                <el-input v-model="adCate.chager" autocomplete="off" />
            </el-form-item>
           
            <el-form-item label="所属学校" :label-width="formLabelWidth">
            <el-select v-model="adCate.schoolId" placeholder="请选择学校">
                <el-option v-for="item in schools" :key="item.id" :label="item.schoolName" :value="item.id" v-model="schoolId" />
            </el-select>
            </el-form-item>

            <el-form-item label="楼栋名" :label-width="formLabelWidth">
                <el-input v-model="adCate.name" autocomplete="off" />
            </el-form-item>
       
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogForm = false">取消</el-button>
                <el-button type="primary" @click="save">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>

import { defineComponent } from "vue"
import { schoolPage,BuildingPage,BuildingAdd, buildingSearch,buildingEdit,Searchbyschool,buildingDelId} from "../../http";
import { ElMessage, ElMessageBox } from 'element-plus'
import {cloneDeep} from 'lodash-es'


export default defineComponent({
    data() {
        return {
            adCates: [],
            schools:[],
            page: {
                total: 1,
                current: 1,
                size: 10
            },
            id:null,
            schoolId:null,
            result: '',
            dialogFormVisible: false,
            dialogForm:false,
            adCate: {
                "chager": 0,
                "id": 0,
                "name": "",
                "schoolId": 0
            },

            addpermission:{
                
                  "code": "",
                  "createTime": "",
                  "deleted": 0,
                  "description": "",
                  "hasChildren": 0,
                  "id": 0,
                  "pid": 0,
                  "type": "",
                  "updateTime": "",
                  "url": ""

            },
            formLabelWidth: 80
        }
    },
    mounted() {
        this.getAdCatesPage(1)
        this.getAllSchool()
    },
    methods: {
        toEdit(adcate) {
            console.log(adcate);
            this.dialogFormVisible=true;
            this.adCate=cloneDeep(adcate);    
        },
        cancel(){
            this.dialogFormVisible=false;
            this.adCate.chager=0;
            this.adCate.name=0;
            this.adCate.schoolId=0;
            this.adCate.id=0
        },
        //获取页面数据
        getAdCatesPage(current) {
  
            const data = {
                current: current,
                size: 5
            }
            BuildingPage(data).then(res => {
                console.log(res);
                const page = res.data.page;
                this.adCates = page.records;
                this.page = page;
            }).catch(err => {
                console.log(err);
            })
        },
        //查询校园的全部信息
        getAllSchool(){

            schoolPage().then(res => {
                console.log(res);
                this.schools=res.data.schools
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
        buildingDelId(params).then(res => {
                if (res.success) {
                    this.getAdCatesPage(1)
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
        //添加建筑数据
        toAdd() {
            //到添加的页面
            this.dialogForm = true;
        },
        save() {
            const adcate = this.adCate;
            if (adcate.id == 0) {
                BuildingAdd(adcate).then(res => {
                    if (res.success) {
                        //刷新页面
                        this.dialogForm = false;
                        //清空信息
                        this.adCate.chager= 0,
                        this.adCate.id= 0,
                        this.adCate.name= "",
                        this.adCate.schoolId= 0
                        this.getAdCatesPage(this.page.current)
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
                //编辑的
                buildingEdit(adcate).then(res => {
                    if (res.success) {
                        //刷新页面
                        this.dialogFormVisible = false;
                         //清空信息
                         this.adCate.chager= 0,
                        this.adCate.id= null,
                        this.adCate.name= "",
                        this.adCate.schoolId= 0
                        this.getAdCatesPage(this.page.current)
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

        },
        //通过id进行搜索
        toSearch(id){
            const params = {
                id: id
            }
            buildingSearch(params).then(res => {
                console.log(res.data.building);
                this.adCates=[],
                this.adCates.push(res.data.building)
                this.id=null
                
             // this.adCates=res.data.permission

             // console.log(this.adCates);

              //  this.getAdCatesPage(this.page.current)
            }).catch(err => {
                console.log(err);
            })
          //  console.log(this.adCates)
        
        },
                //通过学校id进行搜索
    toSearchbyschool(id){
            const data = {
                schoolId: id,
                current: 1,
                size: 10000

            }
            console.log(data)
            Searchbyschool(data).then(res => {
                console.log(res);
                const page = res.data.page;
                this.adCates = page.records;
                this.page = page;
               // this.adCates = page.records;
                this.page = page;
            }).catch(err => {
                console.log(err);
            })
        
        },
        shuaxin(){
            this.getAdCatesPage(this.page.current)
        }

    }

});
</script>

<style lang="scss" scoped>

</style>

