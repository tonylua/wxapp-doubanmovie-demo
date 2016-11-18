import req from '../../utils/request';

Page({
    data: {
        movies: [],
        scrollHeight: 0
    },
    onLoad() {
        console.log('movies onLoad');
        this.fetchData();
    },
    onShow: function () {
        wx.getSystemInfo({
            success: res=>{
                let topH = 60; //顶部区域高度
                let rpx = topH*(res.windowWidth/750); //rpx转px 屏幕宽度/750
                this.setData({
                    scrollHeight: parseInt(res.windowHeight - rpx)
                });
            }
        });
    },
    fetchData() {
        req.get_movies('later', movies=>{
            console.log('movies: ', movies);
            this.setData({movies})
        });
    }
});