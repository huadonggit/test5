/**
 * Created by gaojian on 16/3/19.
 */
function MaintenancePic ()
{

    this.initialize.apply(this, arguments)
}
MaintenancePic.prototype =
{
    initialize : function (id)
    {
        if(typeof id === "string"&&document.getElementById(id)) {


            var _this = this;
            this.wrap = typeof id === "string" ? document.getElementById(id) : id;
            this.oUl = this.wrap.getElementsByTagName("ul")[0];
            this.aLi = this.wrap.getElementsByTagName("li");
            this.prev = this.wrap.getElementsByTagName("pre")[0];
            this.next = this.wrap.getElementsByTagName("pre")[1];
            this.timer = null;
            this.aSort = [];
            this.iCenter = 1;

            var _w = $(this.wrap).width();
            var _h = parseInt(_w*0.28);
            this._w = _w;
            this.css(this.oUl,"height",_h);

            this._doPrev = function () {
                return _this.doPrev.apply(_this);
            };
            this._doNext = function () {
                return _this.doNext.apply(_this);
            };

            this.options = [
                {width: parseInt(this._w*0.276), height: parseInt(this._w*0.173), top: parseInt(this._w*0.045), left: parseInt(this._w*0.045), zIndex: 3},
                {width: parseInt(this._w*0.319), height: parseInt(this._w*0.2), top: parseInt(this._w*0.022), left: parseInt(this._w*0.35), zIndex: 4},
                {width: parseInt(this._w*0.276), height: parseInt(this._w*0.173), top: parseInt(this._w*0.045), left: parseInt(this._w*0.682), zIndex: 3},
            ];
            for (var i = 0; i < this.aLi.length; i++) this.aSort[i] = this.aLi[i];
            this.setUp();
            this.addEvent(this.prev, "click", this._doPrev);
            this.addEvent(this.next, "click", this._doNext);
            this.doImgClick();
            this.updata_care_table(this.aSort[this.iCenter]);

            $(window).resize(function(){

                _this.resizing();
            });
        }
    },
    doPrev : function ()
    {
        this.aSort.unshift(this.aSort.pop());
        this.updata_care_table(this.aSort[this.iCenter]);
        this.setUp()
    },
    doNext : function ()
    {
        this.aSort.push(this.aSort.shift());
        this.updata_care_table(this.aSort[this.iCenter]);
        this.setUp()
    },
    doImgClick : function ()
    {
        var _this = this;
        for (var i = 0; i < this.aSort.length; i++)
        {
            this.aSort[i].onclick = function ()
            {
                _this.updata_care_table(this);

                if (this.index > _this.iCenter)
                {
                    for (var i = 0; i < this.index - _this.iCenter; i++) _this.aSort.push(_this.aSort.shift());
                    _this.setUp()
                }
                else if(this.index < _this.iCenter)
                {
                    for (var i = 0; i < _this.iCenter - this.index; i++) _this.aSort.unshift(_this.aSort.pop());
                    _this.setUp()
                }
            }
        }
    },
    setUp : function ()
    {
        var _this = this;
        var i = 0;
        for (i = 0; i < this.aSort.length; i++) this.oUl.appendChild(this.aSort[i]);
        for (i = 0; i < this.aSort.length; i++)
        {
            this.aSort[i].index = i;
            if (i < 3)
            {
                this.css(this.aSort[i], "display", "block");
                this.doMove(this.aSort[i], this.options[i], function ()
                {
                    _this.doMove(_this.aSort[_this.iCenter].getElementsByTagName("img")[0], {opacity:100}, function ()
                    {
                        _this.doMove(_this.aSort[_this.iCenter].getElementsByTagName("img")[0], {opacity:100}, function ()
                        {
                        });
                    })
                });
            }
            else
            {
                this.css(this.aSort[i], "display", "none");
                this.css(this.aSort[i], "width", 0);
                this.css(this.aSort[i], "height", 0);
                this.css(this.aSort[i], "top", 37);
                this.css(this.aSort[i], "left", this.oUl.offsetWidth / 2)
            }
            if (i < this.iCenter || i > this.iCenter)
            {
                this.css(this.aSort[i].getElementsByTagName("img")[0], "opacity", 30)
                this.aSort[i].onmouseover = function ()
                {
                    _this.doMove(this.getElementsByTagName("img")[0], {opacity:100})
                };
                this.aSort[i].onmouseout = function ()
                {
                    _this.doMove(this.getElementsByTagName("img")[0], {opacity:35})
                };
                this.aSort[i].onmouseout();
            }
            else
            {
                this.aSort[i].onmouseover = this.aSort[i].onmouseout = null
            }
        }
    },
    addEvent : function (oElement, sEventType, fnHandler)
    {
        return oElement.addEventListener ? oElement.addEventListener(sEventType, fnHandler, false) : oElement.attachEvent("on" + sEventType, fnHandler)
    },
    css : function (oElement, attr, value)
    {
        if (arguments.length == 2)
        {
            return oElement.currentStyle ? oElement.currentStyle[attr] : getComputedStyle(oElement, null)[attr]
        }
        else if (arguments.length == 3)
        {
            switch (attr)
            {
                case "width":
                case "height":
                case "top":
                case "left":
                case "bottom":
                    oElement.style[attr] = parseInt(value) + "px";
                    break;
                case "opacity" :
                    // oElement.style.filter = "alpha(opacity=" + value + ")";
                    // oElement.style.opacity = value / 100;
                    break;
                default :
                    oElement.style[attr] = value;
                    break
            }
        }
    },
    doMove : function (oElement, oAttr, fnCallBack)
    {
        var _this = this;
        clearInterval(oElement.timer);
        oElement.timer = setInterval(function ()
        {
            var bStop = true;
            for (var property in oAttr)
            {
                var iCur = parseFloat(_this.css(oElement, property));
                property == "opacity" && (iCur = parseInt(iCur.toFixed(2) * 100));
                var iSpeed = (oAttr[property] - iCur) / 5;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

                if (iCur != oAttr[property])
                {
                    bStop = false;
                    _this.css(oElement, property, iCur + iSpeed)
                }
            }
            if (bStop)
            {
                clearInterval(oElement.timer);
                fnCallBack && fnCallBack.apply(_this, arguments)
            }
        }, 30)
    },
    updata_care_table : function (li_element)
    {
        var data_title = li_element.getAttribute("data-title");
        var data_table_img = li_element.getAttribute("data-detail_img");
        document.getElementById("car_care_info_table_title").innerText = data_title;
        document.getElementById("car_care_info_table_img").setAttribute("src",data_table_img);
    }
    ,
    resizing : function ()
    {
        this._w = $(this.wrap).width();

        var _h = parseInt(this._w*0.28);
        this.css(this.oUl,"height",_h);

        this.options = [
            {width: parseInt(this._w*0.276), height: parseInt(this._w*0.173), top: parseInt(this._w*0.045), left: parseInt(this._w*0.045), zIndex: 3},
            {width: parseInt(this._w*0.319), height: parseInt(this._w*0.2), top: parseInt(this._w*0.022), left: parseInt(this._w*0.35), zIndex: 4},
            {width: parseInt(this._w*0.276), height: parseInt(this._w*0.173), top: parseInt(this._w*0.045), left: parseInt(this._w*0.682), zIndex: 3},
        ];
        this.setUp();
    }
};
window.onload = function ()
{
    new MaintenancePic("maintenance_header");
};