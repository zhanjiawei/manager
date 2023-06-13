//统一api管理
import instance from "./axios";
// data json
const userLogin=(data)=>{
    //返回Promise对象
   return instance.request({
        url:'api/mobile/elogin', //fullpath=baseURL+url  http://api.jqrjq.cn/api/mobile/elogin
        method:'post',
        data,
      
    })
}
const adminLogin=(data)=>{
   return instance.request({
    url:'', //url=baseURL+url
        method:'post',
        data
   })
}
//学校信息管理
const schoolPage=()=>{
   return instance.request({
    url:'api/school/all',
    
   })
}
const schoolDelId=(params)=>{
    return instance.request({
        url:'api/school/delete',
        params
    })
}
const schoolAdd=(data)=>{
    return instance.request({
        url:'api/school/add',
        method:'post',
        data
    })
}
const schoolEdit=(data)=>{
    return instance.request({
        url:'api/school/edit',
        method:'post',
        data
    })
}

const Search = (params) => {
    return instance.request({
      url: 'api/school/one/'+params.id,
      method: 'get',
      params
    })
  }
  const Searchs=(data)=>{
    return instance.request({
        url:'api/school/search',
        method:'post',
        data
    })
}

const enableSearch=(params)=>{
    return instance.request({
        url:'api/school/enable',
        method:'get',
        params
    })
}

  //建筑信息管理
  const BuildingPage=(data)=>{
    return instance.request({
     url:'api/building/page',
     method:'post',
     data
    })
 }

 const BuildingAdd=(data)=>{
    return instance.request({
        url:'api/building/add',
        method:'post',
        data
    })
}
const buildingSearch = (params) => {
    return instance.request({
      url: 'api/building/one',
      method: 'get',
      params
    })
  }
  const Searchbyschool = (data) => {
    return instance.request({
      url: 'api/building/getBuildingsBySchoolIdPage',
      method: 'post',
      data
    })
  }
  const buildingEdit=(data)=>{
    return instance.request({
        url:'api/building/edit',
        method:'post',
        data
    })
}
const buildingDelId=(params)=>{
    return instance.request({
        url:'api/building/delete/'+params.id,
        params
    })
}



  //宿舍信息管理
  const DormitoryPage=()=>{
    return instance.request({
        url:'api/dormitory/all',
       })
 }
 const DormitoryAdd=(data)=>{
    return instance.request({
        url:'api/dormitory/add',
        method:'post',
        data
    })
}
const dormitorySearch = (params) => {
    return instance.request({
      url: 'api/dormitory/one',
      method: 'get',
      params
    })
  }
  const DormitoryEdit=(data)=>{
    return instance.request({
        url:'api/dormitory/edit',
        method:'post',
        data
    })
}
const dormitoryDelId=(params)=>{
    return instance.request({
        url:'api/dormitory/delete',
        params
    })
}

const studentSearchbydormitory = (params) => {
    return instance.request({
      url: 'api/dormitory/students/'+params.id,
      method: 'get',
      params
    })
  }
 
  //入住信息管理

  const DormitorystPage=()=>{
    return instance.request({
        url:'api/dormitory-student/all',
       })
 }
 const DormitorysAdd=(data)=>{
    return instance.request({
        url:'api/dormitory-student/add',
        method:'post',
        data
    })
}

const dormitorysSearch = (data) => {
    return instance.request({
      url: 'api/dormitory-student/one/'+data.id,
      method: 'get',
      data,
    })
  }
  const dormitorysEdit=(data)=>{
    return instance.request({
        url:'api/dormitory-student/edit',
        method:'post',
        data
    })
}
const dormitorysDelId=(params)=>{
    return instance.request({
        url:'api/dormitory-student/delete/'+params.id,
        params
    })
}


// const isEven = n => n % 2 === 0;


export {
    userLogin,
    adminLogin,
    schoolPage,
    schoolDelId,
    schoolAdd,
    schoolEdit,
    Search,
    BuildingPage,
    DormitoryPage,
    DormitorystPage,
    DormitorysAdd,
    BuildingAdd,
    DormitoryAdd,
    dormitorysSearch,
    dormitorySearch,
    buildingSearch,
    dormitorysEdit,
    buildingEdit,
    DormitoryEdit,
    Searchs,
    dormitorysDelId,
    buildingDelId,
    dormitoryDelId,
    enableSearch,
    Searchbyschool,
    studentSearchbydormitory
} 