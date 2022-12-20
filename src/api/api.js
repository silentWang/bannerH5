
import request from "./request";

export const getUserInfo=()=>request.post('/user/info').then(res=>res.data);
export const getBannerDetail=(id,name,age)=>request.post('/template/info',{temp_id:id,name,age}).then(res=>res.data);