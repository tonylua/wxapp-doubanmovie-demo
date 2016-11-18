const NOOP = ()=>{};
const RE_KV = /([a-z0-9\-]+)\=\"(.*?)\"/gm;
const RE_NOW = /\<li[\r\n\s][^>]*?(id=\"(\d+)\"[^>]*nowplaying[^>]*?)\>[\s\S]*?src\=\"([^"]+)\"/gm;
const RE_LTR = /class\=\"thumb[\s\S]*?src\=\"([\s\S]*?)\"[\s\S]*?href\=\"[\s\S]*?(\d+)[\s\S]*?\>([\s\S]*?)\<\/a\>[\s\S]*?class\=\"dt\"\>([\s\S]*?)\<\/li\>/gm;
const RE_SMR = /property\=\"v\:summary\"[^>]+?\>([\s\S]+?)\<\/span\>/gm;
const RE_GLR = /pic\-col5\"([\s\S]+?)\<\/ul\>/gm;
const RE_IMG = /\<img\s*src=\"([\s\S]+?)\"/g;

function get_page(url, onSuccess=NOOP, onFail=NOOP, onComplete=NOOP) {
    wx.request({
      url,
      method: 'GET',
      header: {
          'Content-Type': 'text/html; charset=utf-8'
      },
      success: res=>onSuccess(res.data),
      fail: onFail,
      complete: onComplete
    })
}

/*
<li
    id="26389466"
    class="list-item hidden"
    data-title="一句顶一万句"
    data-score="6.1"
    data-star="30"
    data-release="2016"
    data-duration="110分钟"
    data-region="中国大陆 香港"
    data-director="刘雨霖"
    data-actors="毛孩 / 李倩 / 刘蓓"
    data-category="nowplaying"
    data-enough="True"
    data-showed="True"
    data-votecount="3578"
    data-subject="26389466"
>
    <ul class="">
        <li class="poster">
            <a href="https://movie.douban.com/subject/3025375/?from=playing_poster" class=ticket-btn target="_blank" data-psource="poster">
                <img src="https://img3.doubanio.com/view/movie_poster_cover/mpst/public/p2388501883.jpg" alt="奇异博士" rel="nofollow" class="" />
*/
function get_movies(type='nowplaying', callback=NOOP, city='beijing') {
    let url = `http://movie.douban.com/${type}/${city}/`;
    get_page(url, data=>{
        let arr = [];
        if (type === 'nowplaying') {
            data.replace(RE_NOW, (_, attrs, id, image)=>{
                let aObj = {id, image};
                attrs.replace(RE_KV, (_, k, v)=>aObj[k]=v);
                arr.push(aObj);
            });
        } else if (type === 'later') {
            data.replace(RE_LTR, (_, image, id, title, time)=>{
                let aObj = {id, image, title, time};
                arr.push(aObj);
            });
        }
        callback(arr);
    })
}
function get_summary(id, callback=NOOP) {
    let url = `https://movie.douban.com/subject/${id}/`;
    wx.showToast({
        icon: 'loading',
        title: 'loading...'
    });
    get_page(url, data=>{
        try {
            let summary = RE_SMR.exec(data)[1];
            callback(summary);
        } catch(ex) {
            console.log('err when get_summary:', ex);
        }
        finally {
            wx.hideToast();
        }  
    });
}
function get_gallary(id, callback=NOOP) {
    let url = `https://movie.douban.com/subject/${id}/all_photos`;
    wx.showToast({
        icon: 'loading',
        title: 'loading...'
    });
    get_page(url, data=>{
        try {
            let urls = [];
            data.replace(RE_GLR, (_, html)=> {
                html.replace(RE_IMG, (_, src)=>{
                    if (/morepic/.test(src)) return;
                    let big = src.replace('albumicon', 'photo');
                    console.log(big);
                    urls.push(big);
                });
            });
            callback(urls);
        } catch(ex) {
            console.log('err when get_gallary:', ex);
        }
        finally {
            wx.hideToast();
        }      
    });
}

module.exports = {
    //列表
    get_movies,
    //简介
    get_summary,
    //图集
    get_gallary
};