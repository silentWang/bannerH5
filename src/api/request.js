import DataModel from './DataModel'
import axios from "axios";//创建一个axios的对象
//生成一个axios的实例
axios.defaults.headers['token'] = DataModel.getUrlParams()['token'];
const http=axios.create({
	baseURL:"https://www.songshumoban01.com.cn/api",// baseURL会在发送请求的时候拼接在url参数前面
	timeout:15000,//请求超时
});
export default http;//导出