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
        }, 30000);
    }

    static showToast(tips){
        if(!tips) return;
        Toast(tips);
    }

    static hideLoading(){
        Toast.clear();
    }
}
