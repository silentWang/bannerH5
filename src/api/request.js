import { getUrlVars } from '.././util/utils'
import axios from "axios";//创建一个axios的对象
//生成一个axios的实例
axios.defaults.headers['token'] = getUrlVars('token');
const http=axios.create({
	baseURL:"http://120.26.53.95/api",// baseURL会在发送请求的时候拼接在url参数前面
	timeout:3000,//请求超时
});
export default http;//导出