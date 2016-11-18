import req from '../../utils/request';

Page({
    _cache: [],
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
        if (this._cache.length) {
            this.setData({movies: this._cache});
            return;
        };
        req.get_movies('nowplaying', movies=>{
            console.log('movies: ', movies);
            this._cache = movies;
            this.setData({movies})
        });
    },

    _eventTS: null,
    onToUpper(e) {
        console.log('to upper', e);
    },
    onSummaryClick(e) {
        if (e.timeStamp === this._eventTS) return;
        this._eventTS = e.timeStamp;
        req.get_summary(e.currentTarget.id.replace('btn_', ''), summary=>{
            wx.showModal({
                title: '简介',
                content: summary
            });
        });
    },
    onGallaryClick(e) {
        if (e.timeStamp === this._eventTS) return;
        this._eventTS = e.timeStamp;
        req.get_gallary(e.currentTarget.id.replace('pic_', ''), urls=>{
            wx.previewImage({
                urls
            });
            console.log(urls);
        });
    },
    onPageClick(e) {
        console.warn(e);
    }
});