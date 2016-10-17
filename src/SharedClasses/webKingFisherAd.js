/*
 * web捕鱼达人 广告投放js
 * 2012-10-15 v1
 * 该文件包括广告投放的相关函数
 *
 */
/**********/
var webKingFisherAd = function () {
    var adid = '',
        Time = new Date(),
        link_id = 'webKingFisherad_link',
        img_id = 'webKingFisherad_img',
        url = 'http://tjs.punchbox.org/imp/?v=4&ckid=66666666&dt=Web&sr=1024,768&app=AAEE775A-54DC-4963-211D-44073E27F98D&appv=1.0&cc=CN&lang=zh&sdk=1.0&sz=728x90',
        cookieName = 'PunchBox_UDID',
        cookieTime = (24 * 60 * 60 * 1000 * 730),
        sendInfo = {
            weburl:"http://tjs.punchbox.org/imp/", //Web应用广告位URL接口	使用HTTP GET方法
            v:"4", //URL接口版本	文本数字，当前值为4
            ckid:"66666666", //触控自己的UDID计算规则
            dt:"Web", //终端类型	Web
            sr:"1024,768", //屏幕分辨率：	宽度,高度。如：1024,768
            bs:"", //浏览器尺寸	数值比浏览器尺寸小
            app:"AAEE775A-54DC-4963-211D-44073E27F98D", //APPUID
            appv:"1.0.1", //APP版本号	1.0.2.3
            cc:"CN", //国家代码	由设备发送过来的字符串，如：US
            lang:"cn", //终端语言	由设备发送过来的字符串，如：en
            sdk:"1.0", //SDK版本号	1.234.56
            sz:"728x90", //728x90	广告尺寸	728x90
            ref:""    //页面来源地址
        };

    var _onComplete = function (callback) {
        if (callback) {
            typeof callback == "string" ? eval(callback) : callback();
        }
    };

    //ajax 方式请求服务器
    var sendServer = function (url, callback) {
        try {
            var xmlhttp;
            url = "http://minisite.punchbox.org/minisite/callback/index.php?url=" + getUrlInfo();
            //url = "1.xml";
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    //检验数据是否合法
                    var data = xmlhttp.responseText;
                    if (data.length > 0) {
                        calls(data);
                        _onComplete(callback);
                    }
                }
            };
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        }
        catch (e) {
            cc.log(e.message);
        }
    };

    /*
     *获取操作系统自然语言
     */
    var getLang = function () {
        var lang = window.navigator.language;
        switch (lang.substring(0, 2)) {
            case'zh':
                lang = "cn";
                break;
            case'en':
                lang = "en";
                break;
            case'ja':
                lang = "ja";
                break;
            case'ko':
                lang = "ko";
                break;
            default:
                lang = "";
                break;
        }
        return lang
    };

    var getUrlInfo = function () {
        return sendInfo.weburl + "?"
            + "v=" + sendInfo.v
            + "&ckid=" + sendInfo.ckid
            + "&dt=" + sendInfo.dt
            + "&sr=" + sendInfo.sr
            + "&bs=" + sendInfo.bs
            + "&app=" + sendInfo.app
            + "&appv=" + sendInfo.appv
            + "&cc=" + sendInfo.cc
            + "&lang=" + sendInfo.lang
            + "&sdk=" + sendInfo.sdk
            + "&sz=" + sendInfo.sz
            + "&ref=" + sendInfo.ref;
    };

    /*
     *设置or获取UDID
     */
    var setCkid = function () {
        var userkey = getCookie(cookieName);
        if (!userkey) {
            expdate = Time;
            userkey = String(Time.getTime()) + String(parseInt(Math.random() * 100000000000000000));
            setCookie('PunchBox_UDID', userkey, expdate, '/', '', '');
            //console.log("Cookie:" + userkey);
        }
        else {
            //console.log("Cookie:" + userkey);
        }
        return userkey
    };

    /*
     *
     */
    var getCookieVal = function (offset) {
        var endstr = document.cookie.indexOf(";", offset);
        if (endstr == -1) {
            endstr = document.cookie.length;
        }
        return unescape(document.cookie.substring(offset, endstr));
    };

    /*
     *获取cookie
     */
    var getCookie = function (name) {
        var arg = name + "=";
        var alen = arg.length;
        var clen = document.cookie.length;
        var i = 0;
        while (i < clen) {
            var j = i + alen;
            if (document.cookie.substring(i, j) == arg) {
                return getCookieVal(j);
            }
            i = document.cookie.indexOf(" ", i) + 1;
            if (i == 0) {
                break;
            }
        }
        return null;
    };

    /*
     *设置cookie
     */
    var setCookie = function (name, value, expires, path, domain, secure) {
        expdate.setTime(expdate.getTime() + (cookieTime));//加上2年时间
        document.cookie = name + "=" + escape(value) +
            ((expires) ? "; expires=" + expires.toGMTString() : "") +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            ((secure) ? "; secure" : "");

    };

    /*
     *删除cookie
     */
    var deleteCookie = function (name) {
        expdate = new Date();
        expdate.setTime(expdate.getTime() - cookieTime);
        setCookie(name, "", expdate);
    };


    /*
     *设置连接参数
     */
    var setSendInfo = function () {
        sendInfo.sr = window.screen.width + "," + window.screen.height;//获取屏幕的宽高
        sendInfo.bs = document.body.scrollWidth + "," + document.body.scrollHeight;//获取浏览器尺寸
        sendInfo.lang = getLang();//获取操作系统自然语言
        sendInfo.ref = window.location.href;//页面来源地址
        sendInfo.ckid = setCkid();
        getUrlInfo();
        return sendInfo;
    };

    /*
     *设置广告
     */
    var setad = function (addata) {
        try {
            var adbox = document.getElementById(adid);
            if (adbox) {
                var data = JSON.parse(addata);

                var imgLink = document.getElementById(link_id);
                if (!imgLink) {
                    imgLink = document.createElement("a");
                    adbox.appendChild(imgLink);
                    imgLink.setAttribute("id", link_id);
                    imgLink.setAttribute("target", "_blank");
                }
                imgLink.setAttribute("onClick", data['count']);
                imgLink.setAttribute("href", data['link']);

                var img = document.getElementById(img_id);
                if (!img) {
                    img = new Image();
                    imgLink.appendChild(img);
                    img.setAttribute("id", img_id);
                    img.setAttribute("style", "border:none;");
                }
                img.setAttribute("src", data['img']);
            }
        }
        catch (e) {
            cc.log(e.message);
        }
    };

    var calls = function (addata) {
        setad(addata);
    };

    /*
     *请求广告
     */
    var request = function (callback) {
        return sendServer(url, callback);
    };

    /*
     *初始化
     */
    var init = function (id, callback) {
        adid = id;
        setSendInfo();
        sendServer(url, callback);
    };


    return{
        init:init,
        calls:calls,
        request:request,
        sendServer:sendServer,
        product:'Web KingFisher Ad',
        version:sendInfo.sdk
    };
};
