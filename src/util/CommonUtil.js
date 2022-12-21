import { Toast } from 'vant';
export default class CommonUtil {
    static showLoading(tips){
        Toast.loading({
            duration: 0, // 持续展示 toast
            message: tips || '加载中...',
            forbidClick: true,
        });
        setTimeout(() => {
            this.hideLoading();
        }, 5000);
    }

    static hideLoading(){
        Toast.clear();
    }
}