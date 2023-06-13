<template>
    <!--
         1 el-table显示数据,分页 
         2  token cookie|session 服务端保存状态信息方式   
         H5 token 如果有值 登录状态 否则就是登录
         进入某个页面就要进行拦截：判断用户是否登录
         通过什么方式：路由守卫
         3 添加和更新
    -->
<h2 style="text-align: center;">宿舍管理-住宿管理{{this.adCates.id}}</h2>

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
            <el-button  type="primary" @click="toAdd" plain style="margin-left: 60px;"><el-icon><DocumentAdd /></el-icon>添加入住信息</el-button> 
            <span class="ml-3 w-35 text-gray-600 inline-flex items-center" style="margin-left: 80px;">id查询</span>
              <el-input placeholder="输入id" style="width: 120px; margin-left: 80px;"  v-model="id"/>
              <el-button :icon="Search" circle style="margin-left: 10px;" @click="toSearch(this.id)"><el-icon><Search /></el-icon></el-button>
              <el-button  type="primary" @click="shuaxin" plain style="margin-left: 60px;"><el-icon><RefreshLeft /></el-icon>刷新页面</el-button> 
           </el-form-item>

        </div>
        <el-table :data="adCates" style="width: 100%">
            <el-table-column fixed prop="id" label="id" width="280" />
            <el-table-column prop="studentId" label="学生id（studentId）" width="370"/>
            <el-table-column prop="dormitoryId" label="宿舍id（dormitoryId）" width="370" />
         
            
           
            <el-table-column fixed="right" label="操作" width="220">
                <template #default="scope">
                    <el-button  type="primary" @click="toEdit(scope.row)" plain><el-icon><EditPen /></el-icon>修改</el-button> 
                    <el-button  type="danger" @click="del(scope.row.id)" plain><el-icon><Delete /></el-icon>删除</el-button> 
                    
                </template>
            </el-table-column>
        </el-table>
    
    </div>

    <!--这个是修改的对话窗口-->
    <el-dialog v-model="dialogFormVisible" title="宿舍成员编辑" :show-close="false" :close-on-click-modal='false'>
        <el-form :model="adCate">
          
          <el-form-item label="学号" :label-width="formLabelWidth">
              <el-input v-model="adCate.studentId" autocomplete="off" />
          </el-form-item>
          <el-form-item label="宿舍" :label-width="formLabelWidth">
            <el-select v-model="adCate.dormitoryId" placeholder="请选择宿舍" style="width: 200px">
                <el-option v-for="item in dormitory" :key="item.id" :label="'宿舍名：&nbsp '+item.name+ '&nbsp &nbsp id： '+item.id" :value="item.id" v-model="adCate.dormitoryId" />
            </el-select>
        </el-form-item>

      </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="quxiao">取消</el-button>
                <el-button type="primary" @click="save">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>

<!--这个是添加的-->
    <el-dialog v-model="dialogForm" title="入住人信息添加" :show-close="false" :close-on-click-modal='false'>
        <el-form :model="adCate">
          
            <el-form-item label="学号" :label-width="formLabelWidth">
                <el-input v-model="adCate.studentId" autocomplete="off" />
            </el-form-item>
            <el-form-item label="宿舍" :label-width="formLabelWidth">
            <el-select v-model="adCate.dormitoryId" placeholder="请选择宿舍" >
                <el-option v-for="item in dormitory" :key="item.id" :label="'宿舍名：&nbsp '+item.name+ '&nbsp &nbsp id： '+item.id" :value="item.id" v-model="adCate.dormitoryId" />
            </el-select>
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
    <div>

  </div>
</template>

<script>

import { defineComponent } from "vue"
import { DormitorystPage,DormitorysAdd,dormitorysSearch,dormitorysEdit,dormitorysDelId,DormitoryPage} from "../../http";
import { ElMessage, ElMessageBox } from 'element-plus'
import {cloneDeep} from 'lodash-es'



export default defineComponent({
    data() {
        return {
            adCates: [],
            dormitory:[],
            page: {
                total: 1,
                current: 1,
                size: 10
            },
            $confirm:'',
            $message:'',
            id:null,
            result: '',
            dialogFormVisible: false,
            dialogForm:false,
            adCate: {
                
                  "dormitoryId": 0,
                  "id": 0,
                  "studentId": 0,
            },

            formLabelWidth: 80
        }
    },
    mounted() {
       this. toSearchDormitory()
        this.getAdCatesPage()
    },
    methods: {
        toEdit(adcate) {
            console.log(adcate);
            this.dialogFormVisible=true;
            this.adCate=cloneDeep(adcate);    
        },
        //刷新页面
        shuaxin(){
            this.getAdCatesPage()
        },
        //取消界面
        quxiao(){
           this.dialogForm = false;
           this.dialogFormVisible= false,
           this.qingkong()
        },
        //获取页面数据
        getAdCatesPage() {
  
            DormitorystPage().then(res => {
                console.log(res);
                this.adCates=res.data.dormitoryStudents
            }).catch(err => {
                console.log(err);
            })

        },

        //清空数据
    qingkong(){
                  this.adCate.dormitoryId= 0,
                  this.adCate.id= 0,
                  this.adCate.studentId= 0

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
            dormitorysDelId(params).then(res => {
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
            const adcate = this.adCate;
            if (adcate.id == 0) {
                DormitorysAdd(adcate).then(res => {
                    if (res.success) {
                        //刷新页面
                        this.dialogForm = false;
                        this.adCate.dormitoryId=null;
                        this.adCate.studentId=null;
                        this.getAdCatesPage()
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
                dormitorysEdit(adcate).then(res => {
                    if (res.success) {
                        //刷新页面
                        this.dialogFormVisible = false;
                        this.getAdCatesPage(this.page.current)
                        this.qingkong()
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
            const data = {
                id: id
            }
            dormitorysSearch(data).then(res => {
                console.log(res.data.dormitoryStudent);
                this.adCates=[],
                this.adCates.push(res.data.dormitoryStudent)
             // this.adCates=res.data.permission

             // console.log(this.adCates);

              //  this.getAdCatesPage(this.page.current)
            }).catch(err => {
                console.log(err);
            })
          //  console.log(this.adCates)
        
        },
        //查询宿舍全部信息
        toSearchDormitory(){
            DormitoryPage().then(res => {
                console.log(res);
                this.dormitory=res.data.dormitories
                console.log(this.dormitory)
            }).catch(err => {
                console.log(err);
            })
            
        }


    }

});
</script>

<style lang="scss" scoped>
/* 修改el-header组件的样式 */


</style>
