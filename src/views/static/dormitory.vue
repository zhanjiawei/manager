<template>
    <!--
         1 el-table显示数据,分页 
         2  token cookie|session 服务端保存状态信息方式   
         H5 token 如果有值 登录状态 否则就是登录
         进入某个页面就要进行拦截：判断用户是否登录
         通过什么方式：路由守卫
         3 添加和更新
    -->
<h2 style="text-align: center;">宿舍管理-宿舍管理{{this.adCates.id}}</h2>

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
              <el-input placeholder="输入宿舍号id" style="width: 120px; margin-left: 80px;"  v-model="id"/>
              <el-button :icon="Search" circle style="margin-left: 10px;" @click="toSearch(this.id)"><el-icon><Search /></el-icon></el-button>
              <el-button  type="primary" @click="shuaxin" plain style="margin-left: 60px;"><el-icon><RefreshLeft /></el-icon>刷新页面</el-button> 
           </el-form-item>

        </div>
        <el-table :data="adCates" style="width: 100%">
            <el-table-column fixed prop="id" label="宿舍号" width="100" />
            <el-table-column prop="school" label="学校(school)" width="190"/>
            <el-table-column prop="building" label="楼栋(building)" width="160" />
            <el-table-column prop="name" label="宿舍名" width="120" />
            <el-table-column prop="leader" label="宿舍长" width="120" />
            <el-table-column prop="status" label="状态" :formatter="formtype" width="80"  />
            <el-table-column prop="type" label="类型"  :formatter="formatStatus" width="80" >
                
                </el-table-column>
            
           
            <el-table-column fixed="right" label="操作" width="380">
                <template #default="scope">
                    <el-button  type="primary" @click="toEdit(scope.row)" plain><el-icon><EditPen /></el-icon>修改</el-button> 
                    <el-button  type="danger" @click="del(scope.row.id)" plain><el-icon><Delete /></el-icon>删除</el-button> 
                    <el-button  type="info" @click="toshow(scope.row)" plain><el-icon><Document /></el-icon>详情</el-button> 
                    <el-button  type="info" @click="toshowstudent(scope.row.id)" plain><el-icon><Avatar /></el-icon>学生</el-button> 
                    
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :page-size="page.size" :total="page.total"
            @current-change="currentchange" />
    </div>

    <!--这个是修改的对话窗口-->
    <el-dialog v-model="dialogFormVisible" title="宿舍信息编辑"  :show-close="false" :close-on-click-modal='false'>
        <el-form :model="adCate">
            <el-form-item label="学校名" :label-width="formLabelWidth">
            <el-select v-model="adCate.school" placeholder="请选择学校" >
                <el-option v-for="item in schools" :key="item.id" :label="item.schoolName" :value="item.schoolName" v-model="adCate.school"  @click="handleBlur"/>
            </el-select>
        </el-form-item>
            <el-form-item label="宿舍名" :label-width="formLabelWidth">
                <el-input v-model="adCate.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="楼栋" :label-width="formLabelWidth">
            <el-select v-model="adCate.building"  placeholder="请选择楼栋" >
                <el-option v-for="item in buildings" :key="item.id" :label="item.name" :value="item.name" v-model="adCate.building"  />
            </el-select>
        </el-form-item>
            <el-form-item label="舍长学号" :label-width="formLabelWidth">
                <el-input v-model="adCate.leader" autocomplete="off" />
            </el-form-item>
            <el-form-item label="总床数" :label-width="formLabelWidth">
                <el-input v-model="adCate.maxNumber" autocomplete="off" />
            </el-form-item>

            <el-form-item label="入住人数" :label-width="formLabelWidth">
                <el-input v-model="adCate.liveNumber" autocomplete="off" />
            </el-form-item>
            
            <el-form-item label="空床位" :label-width="formLabelWidth">
                <el-input v-model="adCate.leftNumber" autocomplete="off" />
            </el-form-item>
            <el-form-item label="状态" :label-width="formLabelWidth">
              
              <el-radio-group v-model="adCate.status">
               <el-radio :label="0" >空宿舍</el-radio>
               <el-radio :label="1">学生宿舍</el-radio>
               <el-radio :label="2">教师宿舍</el-radio>
               <el-radio :label="3">废弃宿舍</el-radio>
              </el-radio-group>
             
            </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth">
                <el-radio-group v-model="adCate.type">
                 <el-radio :label="0" >男寝</el-radio>
                 <el-radio :label="1">女寝</el-radio>
               
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="adCate.comment" autocomplete="off" />
            </el-form-item>
      </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="Cancel">Cancel</el-button>
                <el-button type="primary" @click="save">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>

        <!--这个是查看详情的对话窗口-->
        <el-dialog v-model="dialog" title="宿舍信息详情">
        <el-form :model="adCate">
            <el-form-item label="学校" :label-width="formLabelWidth">
                <el-input v-model="adCate.school" autocomplete="off" />
            </el-form-item>
            <el-form-item label="宿舍名" :label-width="formLabelWidth">
                <el-input v-model="adCate.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="楼栋名" :label-width="formLabelWidth">
                <el-input v-model="adCate.building" autocomplete="off" />
            </el-form-item>
            <el-form-item label="舍长学号" :label-width="formLabelWidth">
                <el-input v-model="adCate.leader" autocomplete="off" />
            </el-form-item>

            <el-form-item label="总床数" :label-width="formLabelWidth">
                <el-input v-model="adCate.maxNumber" autocomplete="off" />
            </el-form-item>

            <el-form-item label="入住人数" :label-width="formLabelWidth">
                <el-input v-model="adCate.liveNumber" autocomplete="off" />
            </el-form-item>
            
            <el-form-item label="空床位" :label-width="formLabelWidth">
                <el-input v-model="adCate.leftNumber" autocomplete="off" />
            </el-form-item>
            <el-form-item label="状态" :label-width="formLabelWidth">
              
              <el-radio-group v-model="adCate.status">
               <el-radio :label="0" >空宿舍</el-radio>
               <el-radio :label="1">学生宿舍</el-radio>
               <el-radio :label="2">教师宿舍</el-radio>
               <el-radio :label="3">废弃宿舍</el-radio>
              </el-radio-group>
             
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth">
                <el-radio-group v-model="adCate.type">
                 <el-radio :label="0" >男寝</el-radio>
                 <el-radio :label="1">女寝</el-radio>
               
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="adCate.comment" autocomplete="off" />
            </el-form-item>
      </el-form>
    </el-dialog>

<!--这个是添加的-->
    <el-dialog v-model="dialogForm" title="宿舍信息添加" :show-close="false" :close-on-click-modal='false'>
        <el-form :model="adCate">
            <el-form-item label="学校名" :label-width="formLabelWidth">
            <el-select v-model="adCate.school" placeholder="请选择学校" >
                <el-option v-for="item in schools" :key="item.id" :label="item.schoolName" :value="item.schoolName" v-model="adCate.school"  @click="handleBlur"/>
            </el-select>
        </el-form-item>
            <el-form-item label="宿舍名" :label-width="formLabelWidth">
                <el-input v-model="adCate.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="楼栋" :label-width="formLabelWidth">
            <el-select v-model="adCate.building"  placeholder="请选择楼栋" >
                <el-option v-for="item in buildings" :key="item.id" :label="item.name" :value="item.name" v-model="adCate.building"  />
            </el-select>
        </el-form-item>
            <el-form-item label="舍长学号" :label-width="formLabelWidth">
                <el-input v-model="adCate.leader" autocomplete="off" />
            </el-form-item>

            
            <el-form-item label="总床数" :label-width="formLabelWidth">
            <el-select v-model="adCate.maxNumber"  placeholder="请选择总床数" >
                <el-option label="1床位" :value="2" v-model="adCate.maxNumber"  @click="left"/>
                <el-option label="2床位" :value="2" v-model="adCate.maxNumber"  @click="left"/>
                <el-option label="3床位" :value="3" v-model="adCate.maxNumber" @click="left" />
                <el-option label="4床位" :value="4" v-model="adCate.maxNumber" @click="left" />
                <el-option label="5床位" :value="5" v-model="adCate.maxNumber"  @click="left"/>
                <el-option label="6床位" :value="6" v-model="adCate.maxNumber" @click="left" />
                <el-option label="7床位" :value="7" v-model="adCate.maxNumber"  @click="left"/>
                <el-option label="8床位" :value="8" v-model="adCate.maxNumber" @click="left" />
               
            </el-select>
        </el-form-item>

            <el-form-item label="入住人数" :label-width="formLabelWidth">
            <el-select v-model="adCate.liveNumber"  placeholder="请选择已入住人数" >
                <el-option label="1人" :value="1" v-model="adCate.liveNumber"  @click="left"/>
                <el-option label="2人" :value="2" v-model="adCate.liveNumber"  @click="left"/>
                <el-option label="3人" :value="3" v-model="adCate.liveNumber" @click="left" />
                <el-option label="4人" :value="4" v-model="adCate.liveNumber"  @click="left"/>
                <el-option label="5人" :value="5" v-model="adCate.liveNumber"  @click="left"/>
                <el-option label="6人" :value="6" v-model="adCate.liveNumber"  @click="left"/>
                <el-option label="7人" :value="7" v-model="adCate.liveNumber" @click="left" />
                <el-option label="8人" :value="8" v-model="adCate.liveNumber" @click="left" />
            </el-select>
        </el-form-item>

            <el-form-item label="空床位" :label-width="formLabelWidth">
                <el-input v-model="adCate.leftNumber" autocomplete="off" />
            </el-form-item>
            <el-form-item label="状态" :label-width="formLabelWidth">
              
                <el-radio-group v-model="adCate.status">
                 <el-radio :label="0" >空宿舍</el-radio>
                 <el-radio :label="1">学生宿舍</el-radio>
                 <el-radio :label="2">教师宿舍</el-radio>
                 <el-radio :label="3">废弃宿舍</el-radio>
                </el-radio-group>
               
            </el-form-item>
            <el-form-item label="类型" :label-width="formLabelWidth">
                <el-radio-group v-model="adCate.type">
                 <el-radio :label="0" >男寝</el-radio>
                 <el-radio :label="1">女寝</el-radio>
               
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" :label-width="formLabelWidth">
                <el-input v-model="adCate.comment" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="Cancel">取消</el-button>
                <el-button type="primary" @click="save">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
    <!--这个是展示学生信息的-->
    <el-dialog v-model="dialogTableVisiblestudent" title="入住学生信息" :show-close="false" :close-on-click-modal='false'>
    <el-table :data="students">
      <el-table-column property="classinfo" label="班级" width="180" />
      <el-table-column property="studentName" label="姓名" width="140" />
      <el-table-column property="studentNo" label="学号" />
    </el-table>
    <template #footer>
            <span class="dialog-footer">
                <el-button @click="Cancelstudent">关闭</el-button>
                
            </span>
        </template>
  </el-dialog>
</template>

<script>

import { defineComponent } from "vue"
import { schoolPage, DormitoryPage,DormitoryAdd,dormitorySearch,DormitoryEdit,dormitoryDelId,Searchbyschool,studentSearchbydormitory} from "../../http";
import { ElMessage, ElMessageBox } from 'element-plus'
import {cloneDeep} from 'lodash-es'


export default defineComponent({
    data() {
        return {
            adCates: [],
            schools:[],
            students:[],
            buildings:[],
            drstudent:[1,2,3,4,5,6,7,8],
            page: {
                total: 1,
                current: 1,
                size: 10
            },
            id:null,
            schoolid:null,
            result: '',
            dialogFormVisible: false,
            dialogForm:false,
            dialog:false,
            dialogTableVisiblestudent:false,
            adCate: {
                "building": "",
                "comment": "",
                "id": 0,
                "leader": 0,
                "leftNumber": 0,
                "liveNumber": 0,
                "maxNumber": 0,
                "name": "",
                "school": "",
                "status": 0,
                "type": 0
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
        this. getAllSchool()
        this.getAdCatesPage()
    },
    methods: {
        toEdit(adcate) {
            console.log(adcate);
            this.dialogFormVisible=true;
            this.adCate=cloneDeep(adcate);    
        },
        formtype: function (row, column, cellValue) {
      if (cellValue == 0) {
        return "空";
      }
      if (cellValue == 1) {
        return "学生宿舍";
      }
      if (cellValue == 2) {
        return "老师宿舍";
      }
      if (cellValue == 3) {
        return "废弃宿舍";
      }
    },
//关闭修改对话窗口同时清空数据
    Cancel(){
        this.dialogFormVisible= false;
       this.dialogForm=false,
        this.adCate.building="";
                        this.adCate. comment= "";
                        this.adCate.leader= 0,
                        this.adCate.leftNumber=0,
                        this.adCate.liveNumber= 0,
                        this.adCate.maxNumber=0,
                        this.adCate.name= "",
                        this.adCate.school="",
                        this.adCate.status=0,
                        this.adCate.type=0,
                        this.adCate.id=0

    },
    left(){
 let max =this.adCate.maxNumber
 let life =this.adCate.liveNumber
 let left =max-life
 this.adCate.leftNumber=left

    },
    Cancelstudent(){
        this.dialogTableVisiblestudent=false
        this.students=[]

    },


    //详情
        toshow(show){
            console.log(show);
            this.dialog=true;
            this.adCate=cloneDeep(show); 
        },
        toshowstudent(id){
            this.dialogTableVisiblestudent=true
            console.log(id)
            const params = {
                id: id
            }
                    //通过学校状态进行查询
 
            console.log(params)
            studentSearchbydormitory(params).then(res => {
                console.log(res.data.students);
                this.students=res.data.students
             // this.adCates=res.data.permission

              console.log(this.students);

              //  this.getAdCatesPage(this.page.current)
            }).catch(err => {
                console.log(err);
            })

        

        }
        ,
        formatStatus(row, column, cellValue) {
    return cellValue === 0 ? '男寝' : '女寝';
  },
        //获取页面数据
        getAdCatesPage() {
  
            DormitoryPage().then(res => {
                console.log(res);
                this.adCates=res.data.dormitories
            }).catch(err => {
                console.log(err);
            })

        },
        selectSchool (selectedname) {
      // 使用 for...in 循环查找
      for (let i in this.schools) {
        if (this.schools[i].schoolName === selectedname) {
          this.schoolid = this.schools[i].id;
          break;
        }
      }},
        handleBlur() {
      // 在此处添加您希望执行的操作
      console.log("选项被点击了！");
      var selectedname = this.adCate.school
      this.selectSchool(selectedname)
      console.log(this.schoolid)
      this.toSearchbyschool(this.schoolid)
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
        dormitoryDelId(params).then(res => {
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
                console.log(adcate)
                DormitoryAdd(adcate).then(res => {
                    if (res.success) {
                        //刷新页面
                        this.dialogForm= false;
                        this.getAdCatesPage()
                        ElMessage.success(res.msg)
                        this.adCate.building="";
                        this.adCate. comment= "";
                        this.adCate.leader= 0,
                        this.adCate.leftNumber=0,
                        this.adCate.liveNumber= 0,
                        this.adCate.maxNumber=0,
                        this.adCate.name= "",
                        this.adCate.school="",
                        this.adCate.status=0,
                        this.adCate.type=0,
                        this.adCate.id=0

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
                DormitoryEdit(adcate).then(res => {
                    if (res.success) {
                        //刷新页面
                        this.dialogFormVisible = false;
                        this.getAdCatesPage(this.page.current)
                        ElMessage.success(res.msg)
                        this.adCate.building="";
                        this.adCate. comment= "";
                        this.adCate.leader= 0,
                        this.adCate.leftNumber=0,
                        this.adCate.liveNumber= 0,
                        this.adCate.maxNumber=0,
                        this.adCate.name= "",
                        this.adCate.school="",
                        this.adCate.status=0,
                        this.adCate.type=0
                        this.adCate.id=0
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
            dormitorySearch(params).then(res => {
                console.log(res.data.dormitory);
                this.adCates=[],
                this.adCates.push(res.data.dormitory)
                this.id=null
             // this.adCates=res.data.permission

             // console.log(this.adCates);

              //  this.getAdCatesPage(this.page.current)
            }).catch(err => {
                console.log(err);
            })
          //  console.log(this.adCates)
        
        },
        shuaxin(){
            this.getAdCatesPage()
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

                //通过学校id进行搜索建组
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
                this.buildings = page.records;
                this.page = page;
               // this.adCates = page.records;
                this.page = page;
            }).catch(err => {
                console.log(err);
            })
        
        },

    }

});
</script>

<style lang="scss" scoped></style>
