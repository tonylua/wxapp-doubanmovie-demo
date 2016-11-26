Page({
    data: {
        v_url: null
    },
    onLoad(option) {
        this.setData({v_url: option.v_url});
    },
    onVideoError(e) {
        console.log(e);
    }
});