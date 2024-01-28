var imgLazyLoad_bol = imgLazyLoad_bol || document.createElement('canvas').toDataURL('image/webp', 0.5).indexOf('data:image/webp') === 0;
$(function () {
    // 多语言事件
    $('.language_modal_mask').click(function () {
        $('body').removeClass('language_modal_mask_body');
    });
    $('.language_modal_click').click(function(){
        $('body').toggleClass("language_modal_mask_body");
        var img = $('.language_modal_a img');
        img.each(function(){
            var imgs = $(this),
                src = imgs.attr("lans-src");
            imgs.attr('src',src).removeAttr("lans-src");
        })
    })

    window['foot_enquiry_fun'] = function () {
        window['gtag_report_conversion'] && window['gtag_report_conversion']();
    }

    imgLazyLoad()
    $(window).on('scroll', imgLazyLoad)
    $('.body_color_bgs .content').on('scroll', imgLazyLoad)

    //视频
    if($('#video_autoplay_open').val() === '1'){
        __fn()
    }

    initVideo(55);

    $(window).on('scroll', initVideo);

    var checkInterval  =  setInterval(function(){
        var isInit = false
        $('.swiper-container').each(function(){
            if($(this).context.swipers){
                isInit = true
            }
        })
        if(isInit){
            initVideo();
            clearInterval(checkInterval)
        }
    }, 1000);


    // 移入gif
    // $(".img_par").mouseenter(function(){
    $("body").on('mouseenter',".img_par",function(){
        var par = $(this),
            img = par.find(">[img_preview_gif]"),
            img_preview_gif = par.find(">.img_preview_gif");
        if (img_preview_gif.length) {
            // par.addClass('gif_shows');
            return;
        }
        if (img.length==0 || !img.attr('img_preview_gif')) {return}
        var src = img.attr('img_preview_gif'),
            img_gif = new Image();
        img_gif.src = src;
        img_gif.onload = function(){
            var that = $(this);
            that.addClass('img_preview_gif')
            img.after(that);
            par.addClass('gif_shows')
        }
    })
    // .on('mouseleave',".img_par",function(){
    //     var par = $(this);
    //     if (par.hasClass('gif_shows')) {
    //         par.removeClass("gif_shows");
    //     }
    // })

    $('.preview_3d_btn').click(function(){
        preview3d($(this))
    })
});

$(function() {
    var body = document.body,
        zoomOverlay = $("<div>").addClass("zoom-overlay").appendTo(body).append($("<div>").addClass("zoom-overlay-bg")),
        maxZoomWidth = 0,
        maxZoomHeight = 0,
        current = null,
        imgLookup = {};
    function zoomOut(that) {
        /// <param name="that" type="HTMLElement"/>
        var img = $(that).find("img"),
            cur = current,
            data = img.data("original") || {};
        if (current !== null) {
            current = null;
            $(body).removeClass("zoomed");

            img.css("WebkitTransform", data.unprefixed).css("transform", data.unprefixed);
            // setTimeout(function () {
            //     if (cur) {
            //         $(cur).removeClass("zoom-hidden");
            //     }
            // }, 250);
            setTimeout(function () {
                if (img) {
                    img.remove();
                }
            }, 350);
        }
    }
    var zoomList1 =[]
    $.fn.zoomable = function (getSrc) {
        var that = this[0], src = typeof getSrc === 'function' ? getSrc.call(that) : that.src, bcr = that.getBoundingClientRect(),
            width, height, img,
            imgWidth = bcr.right - bcr.left, imgHeight = bcr.bottom - bcr.top,
            zoomedWidth, zoomedHeight, zoomedTop, zoomedLeft, unzoomedScale, unzoomedTx, unzoomedTy, originalTransform = { ms: "", unprefixed: "" };
        if (current) { return; }
        function IsPc(){
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"]
            for(let v=0;v<Agents.length;v++){
                if(userAgentInfo.indexOf(Agents[v])>0){
                    return true
                }
            }
            return false
        }

        function imgLoad() {

            $(img).show();
            current = that;
            width = img.naturalWidth;
            height = img.naturalHeight;

            if (width < maxZoomWidth && height < maxZoomHeight) {
                zoomedWidth = width;
                zoomedHeight = height;
            } else {
                if (width / height > maxZoomWidth / maxZoomHeight) {
                    zoomedWidth = maxZoomWidth;
                    zoomedHeight = imgHeight * maxZoomWidth / imgWidth;
                } else {
                    zoomedWidth = imgWidth * maxZoomHeight / imgHeight;
                    zoomedHeight = maxZoomHeight;
                }
            }
            zoomedLeft = pageXOffset + (innerWidth - zoomedWidth) / 2;
            zoomedTop = pageYOffset + (innerHeight - zoomedHeight) / 2;
            unzoomedScale = (bcr.right - bcr.left) / zoomedWidth;
            unzoomedTy = bcr.top + zoomedHeight * unzoomedScale / 2 - innerHeight / 2;
            unzoomedTx = bcr.left + zoomedWidth * unzoomedScale / 2 - innerWidth / 2;

            originalTransform.ms = "translate(" + unzoomedTx + "px," + unzoomedTy + "px) scale(" + unzoomedScale + ")";
            originalTransform.unprefixed = "translate3D(" + unzoomedTx + "px," + unzoomedTy + "px,0) scale(" + unzoomedScale + ")";
            // Zoom image in

            $(body).addClass("zoomed");

            // img.addClass("zoom-overlay-img")

            img.style.cssText = "top:" + zoomedTop + "px;left:" + zoomedLeft + "px;height:" +
                zoomedHeight + "px;width:" + zoomedWidth + "px";
            img.style.msTransform = originalTransform.ms;
            img.style.WebkitTransform = originalTransform.unprefixed;
            img.style.transform = originalTransform.unprefixed;
            zoomOverlay.append(img);
            setTimeout(function () {
                $(img).css("msTransform", "").css("WebkitTransform", "translatez(0)").css("transform", "translateZ(0)").data("original", originalTransform);
            }, 50);
            // setTimeout(function () {
            //     $(that).addClass("zoom-hidden");
            // }, 70);

            let flag =function(eleImg){
                console.log(!zoomList1.includes(eleImg)&&IsPc())
                return !zoomList1.includes(eleImg)&&IsPc()
            }
            var eleImg = document.querySelector(".zoom-overlay img")
            if(flag(eleImg)){
                var store = {
                    scale : 1
                };
                var position_top, position_left,pageX,pageY;

                //     $(img).on('touchstart', (event)=> {
                //         // event.preventDefault();//阻止默认事件，防止底部内容滚动
                //     //在触屏设备下，要判断是单指还是多指操作，可以通过event.touches数组对象的长度判断。
                //         var touches = event.touches;
                //         var events = touches[0];//单指
                //         var events2 = touches[1];//双指
                //         if (touches.length == 1) {   //单指操作
                //             pageX = Number(events.pageX);
                //             pageY = Number(events.pageY);


                //             //  .css获取的值是字符串

                //             position_left = parseFloat(_obj.style.left
                //                     .split('px'));
                //             position_top = parseFloat(_obj.style.top
                //                     .split('px'));
                //             console.log('即将调用resetPosition')
                //             resetPosition.call(_this,position_top,position_left)
                //             if(store.pageX==pageX&&store.pageY==pageY){
                //                 img.style.transform = 'scale(1)';
                //                 console.log('top',store.position_top)
                //                 img.style.top=store.position_top+ 'px'
                //                 img.style.left=store.position_left  + 'px'
                //             }
                //             store.pageX = pageX
                //             store.pageY = pageY
                //             store.moveable = true;

                //         } else {
                //             // 第一个触摸点的坐标
                //             store.pageX = events.pageX;
                //             store.pageY = events.pageY;
                //             store.moveable = true;
                //             if (events2) {
                //                 store.pageX2 = events2.pageX;
                //                 store.pageY2 = events2.pageY;
                //             }
                //             store.originScale = store.scale || 1;

                //         }
                //     },{ passive: false })
                //     $(img).on('touchmove', function(event) {
                //         event.preventDefault();//阻止默认事件，防止底部滚动
                //         // if (!store.moveable) {
                //         //     return;
                //         // }
                //         var touches = event.touches;
                //         var events = touches[0];
                //         var events2 = touches[1];
                //         if (touches.length == 1) {
                //             var pageX2 = Number(events.pageX);
                //             var pageY2 = Number(events.pageY);
                //             //控制图片移动
                //             // eleImg.css({
                //             //     'top': position_top + pageY2 - pageY + 'px',
                //             //     "left": position_left + pageX2 - pageX + 'px'
                //             // })
                //             img.style.top=position_top + pageY2 - pageY + 'px'
                //             img.style.left=position_left + pageX2 - pageX + 'px'

                //         } else {
                //             // 双指移动
                //             if (events2) {
                //                 // 第2个指头坐标在touchmove时候获取
                //                 if (!store.pageX2) {
                //                     store.pageX2 = events2.pageX;
                //                 }
                //                 if (!store.pageY2) {
                //                     store.pageY2 = events2.pageY;
                //                 }

                //                 // 获取坐标之间的距离
                //                 var getDistance = function(start, stop) {
                //                 //用到三角函数
                //                     return Math.hypot(stop.x - start.x,
                //                             stop.y - start.y);
                //                 };
                //                 // 双指缩放比例计算
                //                 var zoom = getDistance({
                //                     x : events.pageX,
                //                     y : events.pageY
                //                 }, {
                //                     x : events2.pageX,
                //                     y : events2.pageY
                //                 }) / getDistance({
                //                     x : store.pageX,
                //                     y : store.pageY
                //                 }, {
                //                     x : store.pageX2,
                //                     y : store.pageY2
                //                 });
                //                 // 应用在元素上的缩放比例
                //                 var newScale = store.originScale * zoom;
                //                 // 最大缩放比例限制
                //                 if (newScale > 2.5) {
                //                     newScale = 2.5;
                //                 }
                //                 // 记住使用的缩放值
                //                 store.scale = newScale;
                //                 // 图像应用缩放效果
                //                 img.style.transform = 'scale('
                //                         + newScale + ')';
                //             }
                //         }

                //     },{ passive: false })
                //     $(img).on('touchend', function(e) {
                //         // eleImg.style.transform = 'scale(1)';
                //         // eleImg.style.top=position_top+ 'px'
                //         // eleImg.style.left=position_left  + 'px'
                //             store.moveable = false;
                //             delete store.pageX2;
                //             delete store.pageY2;

                //     })
                //     $(img).on('touchcancel', function() {
                //         store.moveable = false;
                //         delete store.pageX2;
                //         delete store.pageY2;
                //     })
                //     $(img).on('click',function(event){

                //         img.style.transform = 'scale(1)';
                //         img.style.top=store.position_top+ 'px'
                //         img.style.left=store.position_left  + 'px'
                //         console.log('12312312',store.position_left,store.position_top)
                //         event.stopPropagation()

                //     })
                store.i =1
                eleImg.addEventListener('touchstart', (event)=> {

                    // event.preventDefault();//阻止默认事件，防止底部内容滚动
                    //在触屏设备下，要判断是单指还是多指操作，可以通过event.touches数组对象的长度判断。
                    var touches = event.touches;
                    var events = touches[0];//单指
                    var events2 = touches[1];//双指
                    if (touches.length == 1) {   //单指操作
                        pageX = Number(events.pageX);
                        pageY = Number(events.pageY)
                        var _obj = eleImg;
                        position_left = parseFloat(_obj.style.left.split('px'));
                        position_top = parseFloat(_obj.style.top.split('px'));
                        //  .css获取的值是字符串
                        // if(store.position_left==undefined){
                        //     position_left = parseFloat(_obj.style.left.split('px'));
                        //     position_top = parseFloat(_obj.style.top.split('px'));
                        //     store.position_left=position_left
                        //     store.position_top=position_top
                        //     console.log('top',store.position_top)
                        // }
                        store.pageX = pageX
                        store.pageY = pageY
                        store.moveable = true;

                    } else {
                        // 第一个触摸点的坐标
                        store.pageX = events.pageX;
                        store.pageY = events.pageY;
                        store.moveable = true;
                        if (events2) {
                            store.pageX2 = events2.pageX;
                            store.pageY2 = events2.pageY;
                        }
                        store.originScale = store.scale || 1;

                    }
                },{ passive: false }); //passive: false必须加上,否则控制台报错
                //开始移动
                eleImg.addEventListener('touchmove', function(event) {
                    event.preventDefault();//阻止默认事件，防止底部滚动
                    // if (!store.moveable) {
                    //     return;
                    // }
                    var touches = event.touches;
                    var events = touches[0];
                    var events2 = touches[1];
                    if (touches.length == 1) {
                        var pageX2 = Number(events.pageX);
                        var pageY2 = Number(events.pageY);
                        //控制图片移动
                        // eleImg.css({
                        //     'top': position_top + pageY2 - pageY + 'px',
                        //     "left": position_left + pageX2 - pageX + 'px'
                        // })
                        eleImg.style.top=position_top + pageY2 - pageY + 'px'
                        eleImg.style.left=position_left + pageX2 - pageX + 'px'

                    } else {
                        // 双指移动
                        if (events2) {
                            // 第2个指头坐标在touchmove时候获取
                            if (!store.pageX2) {
                                store.pageX2 = events2.pageX;
                            }
                            if (!store.pageY2) {
                                store.pageY2 = events2.pageY;
                            }

                            // 获取坐标之间的距离
                            var getDistance = function(start, stop) {
                                //用到三角函数
                                return Math.hypot(stop.x - start.x,
                                    stop.y - start.y);
                            };
                            // 双指缩放比例计算
                            var zoom = getDistance({
                                x : events.pageX,
                                y : events.pageY
                            }, {
                                x : events2.pageX,
                                y : events2.pageY
                            }) / getDistance({
                                x : store.pageX,
                                y : store.pageY
                            }, {
                                x : store.pageX2,
                                y : store.pageY2
                            });
                            // 应用在元素上的缩放比例
                            var newScale = store.originScale * zoom;
                            // 最大缩放比例限制
                            if (newScale > 2.5) {
                                newScale = 2.5;
                            }
                            // 记住使用的缩放值
                            store.scale = newScale;
                            // 图像应用缩放效果
                            eleImg.style.transform = 'scale('
                                + newScale + ')';
                        }
                        store.sizeChange = true
                    }

                },{ passive: false });

                eleImg.addEventListener('touchend', function(e) {
                    // eleImg.style.transform = 'scale(1)';
                    // eleImg.style.top=position_top+ 'px'
                    // eleImg.style.left=position_left  + 'px'
                    store.moveable = false;
                    delete store.pageX2;
                    delete store.pageY2;

                });
                eleImg.addEventListener('touchcancel', function() {
                    store.moveable = false;
                    delete store.pageX2;
                    delete store.pageY2;
                });
                eleImg.addEventListener('click',function(event){

                    if(!store.sizeChange){
                        zoomOut(zoomOverlay);
                    }else{
                        eleImg.style.transform = 'scale(1)';
                        // eleImg.style.top=store.position_top+ 'px'
                        // eleImg.style.left=store.position_left  + 'px'
                        img.style.cssText = "top:" + zoomedTop + "px;left:" + zoomedLeft + "px;height:" +
                            zoomedHeight + "px;width:" + zoomedWidth + "px";
                        console.log('12312312',store.position_left,store.position_top)
                        store.sizeChange=false
                    }
                    event.stopPropagation()

                })
                zoomList1.push(eleImg)
            }

        }

        if (imgLookup[src]) {
            img = imgLookup[src];
            imgLoad();
        } else {
            img = new Image();
            img.style.display = 'none';
            imgLookup[src] = img;
            $(img).on('load', imgLoad);
            img.src = src;
        }


        return this;
    }
    $(body).on('click', '[data-zoomable]', function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).zoomable(function() {
            return $(this).attr('video-img') || this.src;
        });
    });
    zoomOverlay.on("click", function (e) {
        zoomOut(this);
    });
    $(window).on("resize", function () {
        maxZoomWidth = innerWidth;
        maxZoomHeight = innerHeight;
    }).on("scroll", function () {
        setTimeout(function () {
            zoomOut(zoomOverlay);
        }, 20);
    }).on("keyup", function (e) {
        if (e.keyCode === 27) {
            setTimeout(function () {
                zoomOut(zoomOverlay);
            }, 20);
        }
    }).trigger("resize");

});


// test
// $(function() {
//     function IsPc(){
//         var userAgentInfo = navigator.userAgent;
//         var Agents = ["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"]
//         for(let v=0;v<Agents.length;v++){
//             if(userAgentInfo.indexOf(Agents[v])>0){
//                 return true
//             }
//         }
//         return false
//     }
//     var zoomList =[]
//     let flag =function(eleImg){
//         console.log(!zoomList.includes(eleImg)&&IsPc())
//         return !zoomList.includes(eleImg)&&IsPc()
//     }

//     var i =1
//     $(".show_imgss").on("click",
//             function() {
//                 var _this = $(this);//将当前的pimg元素作为_this传入函数
//                 // imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
// //移动端手指移动事件,如果不需要移动端手指事件,这一部分内容可以不加,只要上面两行代码以及imgShow()事件
//                 // var eleImg = document.querySelector('#innerdiv');
//                 i = 1
//                 let resetPosition =function(position_top,position_left){
//                     for(;i>0;i--){
//                         store.position_left=position_left
//                         store.position_top=position_top
//                         console.log('top',store.position_top)
//                         console.log('i2的数值为',i)
//                     }
//                 }
//                 console.log('i的数值为',i)
//                 var store = {
//                     scale : 1
//                 };

//                 console.log($('.zoom-overlay img'))
//                 //定义移动端的初始位置
//                 var position_top, position_left,pageX,pageY;
//                 // 缩放事件的处理
//                 //事件开始
//                 // console.log(eleImg)
//                 setTimeout(() => {
//                     console.log('settimeout start')
//                     var eleImg = document.querySelector(".zoom-overlay img")
//                     console.log(eleImg)
//                     if(flag(eleImg)){
//                         eleImg.addEventListener('touchstart', (event)=> {
//                             // event.preventDefault();//阻止默认事件，防止底部内容滚动
//                 //在触屏设备下，要判断是单指还是多指操作，可以通过event.touches数组对象的长度判断。
//                             var touches = event.touches;
//                             var events = touches[0];//单指
//                             var events2 = touches[1];//双指
//                             if (touches.length == 1) {   //单指操作
//                                 pageX = Number(events.pageX);
//                                 pageY = Number(events.pageY);


//                                 var _obj = eleImg;
//                                 //  .css获取的值是字符串

//                                 position_left = parseFloat(_obj.style.left
//                                         .split('px'));
//                                 position_top = parseFloat(_obj.style.top
//                                         .split('px'));
//                                 console.log('即将调用resetPosition')
//                                 resetPosition.call(_this,position_top,position_left)
//                                 if(store.pageX==pageX&&store.pageY==pageY){
//                                     eleImg.style.transform = 'scale(1)';
//                                     console.log('top',store.position_top)
//                                     eleImg.style.top=store.position_top+ 'px'
//                                     eleImg.style.left=store.position_left  + 'px'
//                                 }
//                                 store.pageX = pageX
//                                 store.pageY = pageY
//                                 store.moveable = true;

//                             } else {
//                                 // 第一个触摸点的坐标
//                                 store.pageX = events.pageX;
//                                 store.pageY = events.pageY;
//                                 store.moveable = true;
//                                 if (events2) {
//                                     store.pageX2 = events2.pageX;
//                                     store.pageY2 = events2.pageY;
//                                 }
//                                 store.originScale = store.scale || 1;

//                             }
//                         },{ passive: false }); //passive: false必须加上,否则控制台报错
//                         //开始移动
//                         eleImg.addEventListener('touchmove', function(event) {
//                             event.preventDefault();//阻止默认事件，防止底部滚动
//                             // if (!store.moveable) {
//                             //     return;
//                             // }
//                             var touches = event.touches;
//                             var events = touches[0];
//                             var events2 = touches[1];
//                             if (touches.length == 1) {
//                                 var pageX2 = Number(events.pageX);
//                                 var pageY2 = Number(events.pageY);
//                                 //控制图片移动
//                                 // eleImg.css({
//                                 //     'top': position_top + pageY2 - pageY + 'px',
//                                 //     "left": position_left + pageX2 - pageX + 'px'
//                                 // })
//                                 eleImg.style.top=position_top + pageY2 - pageY + 'px'
//                                 eleImg.style.left=position_left + pageX2 - pageX + 'px'

//                             } else {
//                                 // 双指移动
//                                 if (events2) {
//                                     // 第2个指头坐标在touchmove时候获取
//                                     if (!store.pageX2) {
//                                         store.pageX2 = events2.pageX;
//                                     }
//                                     if (!store.pageY2) {
//                                         store.pageY2 = events2.pageY;
//                                     }

//                                     // 获取坐标之间的距离
//                                     var getDistance = function(start, stop) {
//                                     //用到三角函数
//                                         return Math.hypot(stop.x - start.x,
//                                                 stop.y - start.y);
//                                     };
//                                     // 双指缩放比例计算
//                                     var zoom = getDistance({
//                                         x : events.pageX,
//                                         y : events.pageY
//                                     }, {
//                                         x : events2.pageX,
//                                         y : events2.pageY
//                                     }) / getDistance({
//                                         x : store.pageX,
//                                         y : store.pageY
//                                     }, {
//                                         x : store.pageX2,
//                                         y : store.pageY2
//                                     });
//                                     // 应用在元素上的缩放比例
//                                     var newScale = store.originScale * zoom;
//                                     // 最大缩放比例限制
//                                     if (newScale > 2.5) {
//                                         newScale = 2.5;
//                                     }
//                                     // 记住使用的缩放值
//                                     store.scale = newScale;
//                                     // 图像应用缩放效果
//                                     eleImg.style.transform = 'scale('
//                                             + newScale + ')';
//                                 }
//                             }

//                         },{ passive: false });

//                         eleImg.addEventListener('touchend', function(e) {
//                             // eleImg.style.transform = 'scale(1)';
//                             // eleImg.style.top=position_top+ 'px'
//                             // eleImg.style.left=position_left  + 'px'
//                                 store.moveable = false;
//                                 delete store.pageX2;
//                                 delete store.pageY2;

//                         });
//                         eleImg.addEventListener('touchcancel', function() {
//                             store.moveable = false;
//                             delete store.pageX2;
//                             delete store.pageY2;
//                         });
//                         eleImg.addEventListener('click',function(event){

//                             eleImg.style.transform = 'scale(1)';
//                             eleImg.style.top=store.position_top+ 'px'
//                             eleImg.style.left=store.position_left  + 'px'
//                             console.log('12312312',store.position_left,store.position_top)
//                             event.stopPropagation()

//                         })
//                         zoomList.push(eleImg)
//                     }
//                 }, 300);
//             });
//     //移动端手指页面结束
// });


function imgLazyLoad_bg(){
    $('.img_par.show_img').not('.par_img_bg').each(function(){
        var that = $(this),
            img = that.find('[video-img]');
        if (img.length&&!that.hasClass('par_img_bg')&&img.css('object-fit')=='contain'&&!that.hasClass('list_module_1')) {
            var src = img.attr('src');
            if (src) {
                that.addClass('par_img_bg');
                that.css('backgroundImage','url('+src+')');
            }
        }
    })
}

/**
 * 图片懒加载
 */
let CheckTimer = null
function imgLazyLoad(){
    var $win = document.documentElement,
        $body = document.body,
        v_w = $win.clientWidth,
        v_h = $win.clientHeight,
        scrollTop = $win.scrollTop || $body.scrollTop,
        img_arr = document.querySelectorAll('.img_par.no_img_src,.no_bg_src[bg_img_url]'),
        compress_webp_onoff = $('#compress_webp_onoff').val(),
        compress_capture_onoff = $('#compress_capture_onoff').val(),
        compress_onoff = $('#compress_onoff').val(),
        img_compress = $('#img_compress').val(),
        bannerCompress = $('#bannerCompress').val(),
        bannerQuality = $('#bannerCompressQuality').val();
    len = img_arr.length;
    for (var i = 0; i < len; i++) {
        var $box = img_arr[i],
            img_boxs = $($box),
            x = scrollTop + v_h - img_boxs.offset().top;
        // console.log(img_boxs);
        if (img_boxs.is(':hidden')) {
            continue;
        }
        if (x<=0) {
            return false;
        }

        var $img = null,
            srcs = [],
            selector = (''+Math.random()).slice(2),
            isBackground = $box.getAttribute('bg_img_url') || $box.getAttribute('bg_img_url') == '';
        if (isBackground) {
            img_boxs.removeClass("no_bg_src").attr('data-unique-selector', selector);
            $img = $box;
            srcs.push($img.getAttribute('bg_img_url'));
            if ($box.hasAttribute('mobile-bg-url')) {
                srcs.push($img.getAttribute('mobile-bg-url'));
            }
        } else {
            img_boxs.addClass('loading_imgs_box show_img').removeClass('no_img_src');
            $img = $box.querySelectorAll('img')[0];
            srcs.push($img.getAttribute('video-img'));
        }

        srcs = srcs.map(function (origSrc) {
            var src = origSrc,
                isCapture = compress_capture_onoff,
                isWebP = compress_webp_onoff,
                isCompress = compress_onoff,
                compressQuality = img_compress;

            if (src.indexOf('http') !== -1 && src.indexOf('.gif') == -1) {
                if (img_boxs.attr('data-banner') && bannerCompress) {
                    isWebP = bannerCompress & 1;
                    isCapture = (bannerCompress & 2) && 1;
                    isCompress = (bannerCompress & 4) && 1;
                    compressQuality = bannerQuality;
                }
                var i_w = parseInt($img.getAttribute('video_w') || 2100)

                if (i_w > v_w) {
                    i_w = v_w + 30
                }
                if (i_w < 768 && (typeof(_is_lighthouse) == "undefined" || _is_lighthouse === false)) {
                    i_w = 768
                } else if (i_w > 1200 && (typeof(_is_lighthouse) != "undefined" && _is_lighthouse === true)) {
                    i_w = 1000
                }
                if (src.indexOf('http') !== -1) {
                    if(src.indexOf('weyesimg')!==-1&&src.indexOf('imgbd')==-1){
                        var resize_w = '';
                        if (isCapture == 1) {
                            resize_w = '/w/' + i_w;
                        }
                        var format_webp = '';
                        if (imgLazyLoad_bol && isWebP == 1) {
                            format_webp = '/format/webp';
                        }
                        var quality_url = '';
                        if (isCompress == 1 &&(src.indexOf('.jpg')>-1||src.indexOf('.png')>-1)) {
                            quality_url = '/q/' + compressQuality
                        } else if (isCompress == 1 && imgLazyLoad_bol && isWebP == 1) {
                            quality_url = '/q/' + compressQuality
                        }

                        var new_p = resize_w  + quality_url + format_webp;
                        if (new_p) {
                            new_p = '?imageView2/2' + new_p;
                        }
                        src = src + new_p;
                    }else{
                        var resize_w = '';
                        if (isCapture == 1) {
                            resize_w = '/resize,m_lfit,w_' + i_w;
                        }
                        var format_webp = '';
                        if (imgLazyLoad_bol && isWebP == 1) {
                            format_webp = '/format,webp';
                        }
                        var quality_url = '';
                        if (isCompress == 1 &&(src.indexOf('.jpg')>-1||src.indexOf('.png')>-1)) {
                            quality_url = '/quality,' + compressQuality
                        } else if (isCompress == 1 && imgLazyLoad_bol && isWebP == 1) {
                            quality_url = '/quality,' + compressQuality
                        }

                        var new_p = resize_w + format_webp + quality_url;
                        if (new_p) {
                            new_p = '?x-oss-process=image' + new_p;
                        }

                        if (src.indexOf('?') !== -1) {
                            if (src.indexOf('?x-oss-process=video') == -1 && src.indexOf('?x-oss-process=image') !== -1) {
                                src = src.slice(0, src.indexOf('?'));
                                src = src + new_p;
                            }
                        } else {
                            src = src + new_p;
                        }
                    }
                }
            }

            return src;
        });
        if (isBackground) {
            var rules = [];
            if (srcs[0]) {
                // $img.style.backgroundImage = 'url(' + srcs[0] + ')';
                rules.push('[data-unique-selector="' + selector + '"]{background-image:url("' + srcs[0] + '")}');
            }
            if (srcs.length > 1) {
                console.log('mobile background detected');
                if (srcs[1]) {
                    rules.push('@media (max-width:768px){[data-unique-selector="' + selector + '"]{background-image:url("' + srcs[1] + '")}}');
                } else {
                    rules.push('@media (max-width:768px){[data-unique-selector="' + selector + '"]{background-image:none}}');
                }
            }
            if (rules.length) {
                var style = document.createElement('style');
                document.querySelector('head').appendChild(style);
                var ss = style.sheet;

                rules.forEach(function (r, i) {
                    ss.insertRule(r, i);
                });
            }
        } else {
            $img.src = srcs[0];
            $img.onload = function () {
                $(this).trigger('lazyload').closest('.loading_imgs_box').removeClass("loading_imgs_box");
                imgLazyLoad_bg()
            }
        }
    }
    let count = 0
    // let timer = null
    function check() {
        count ++
        $('.loading_imgs_box').each(function() {
            $(this).find('img').on('load',function(){
                // console.log('load');
                $(this).closest('.loading_imgs_box').removeClass("loading_imgs_box")
            })
        })
        if(count > 5) {
            $('.loading_imgs_box').each(function() {
                $(this).removeClass("loading_imgs_box")
            })
            clearInterval(CheckTimer)
            CheckTimer = null
        }
    }
    // console.log('timer', timer)
    if(CheckTimer) {
        clearInterval(CheckTimer)
        CheckTimer = null
    }
    CheckTimer = setInterval(check,5000)
}

/*
 * 初始化视频 2.0模块
 */
var playerList = {}
function initVideo (nn) {
    const $video = $('[video-src]').not('.inited,img')
    const $win = $(window)
    const viewportHeight = $win.height()
    const scrollTop = $win.scrollTop()

    if (!$video.length) {
        return false
    }

    var nns = 0;

    if (nn == 55) {
        nns = 100;
    }

    var checkAutoPlay = (that, x) => {
        var vid = that.siblings('.video_js_play_btn').attr('v_id')
        if(that.closest('.swiper-slide').hasClass('swiper-slide-duplicate')){
            return false
        }
        if(x > nns && x < viewportHeight + that.parent().height()){
            if(that.closest('.swiper-slide').hasClass('swiper-slide-active')){
                if(!playerList[vid]){
                    var $siblingVideo = that.closest('.swiper-slide').find('[video-src]').not('.inited,img')
                    $siblingVideo.each(function(){
                        $(this).data('state', 'pause')
                    })
                    that.data('state', 'play')
                    if(!that.data('inited')){
                        that.data('inited', 'true')
                        that.siblings('.video_js_play_btn').trigger('click')
                    }
                }else if(playerList[vid].tag.paused){
                    if(!that.data('inited')){
                        that.data('inited', 'true')
                        playerList[vid].play()
                    }
                }
            }else{
                that.data('state', 'pause')
                if (playerList[vid] && !playerList[vid].tag.paused) {
                    playerList[vid].pause()
                }
            }
        }else{
            that.data('state', 'pause')
            if (playerList[vid]) {
                playerList[vid].pause()
            }else{
                var $iframe = that.siblings('iframe')
                if($iframe.length){
                    $iframe.hide();
                    $iframe[0].contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}','*');
                }
            }
        }
    }

    $video.each(function () {
        var that = $(this)
        var isBanner = that.closest('.tem_banner_2').length > 0

        const x = scrollTop + viewportHeight - that.parent().offset().top

        if(that.attr('playback_mode') === 'auto' && isBanner){
            checkAutoPlay(that, x)
        }

        if (that.siblings('.video_js_play_btn').length) {
            return;
        }
        if (x <= nns) {
            return false

        }
        if (that.closest('[swiper_switch="1"]').length&&that.closest('.swiper-container-horizontal').length==0) {return}

        if(that.attr('playback_mode') === 'auto' && isBanner){
            that.addClass('scoll')
        }else{
            that.addClass('inited')
        }

        var src = that.attr('video-src'),
            m3u8src = that.attr('video-m3u8src');
        if (!src&&!m3u8src) {
            return
        }

        if (m3u8src) {
            src = m3u8src;
        }

        var vid = ['my_video', new Date().getTime(), (function () {
            var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
            arr.sort(function () {
                return (0.5 - Math.random());
            });
            return arr.join('');
        })()].join('_');
        var video_js_play_btn = $('<div v_id="'+vid+'" class="video_js_play_btn" style="position:absolute;top:0;left:0;right:0;bottom:0;cursor:url(/images/video.png),auto;display:block;z-index:20;"></div>');
        var $custom = that.closest('[modular-edit-img="par"]');
        if ($custom.length==0) {
            $custom = that.closest('[modular-edit="custom"]');
        }
        var videos_js_icons = $custom.find('.videos_js_icons');
        if (videos_js_icons.hasClass('there_video_icons')) {
            video_js_play_btn.css('cursor','pointer');
        }
        var swipers_fn;

        if (that.attr('video-type') == "0") {
            var youtubePlayer, youtubePlayerClicked, iframe;
            if (/^https?:\/\/player\.vimeo\.com/.test(src)) {
                // TODO: vimeo link
                iframe = $('<iframe>').attr({
                    allowfullscreen: '',
                    src: src,
                    frameborder: 0,
                    allow: 'picture-in-picture;autoplay',
                    id: 'youtube' + vid
                }).css({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                });
                that.after(video_js_play_btn);
                swipers_fn = video_js_play_btn.closest('.swiper-container');
                videos_js_icons.show();
                video_js_play_btn.on('click', function () {
                    if (swipers_fn.length) {
                        swipers_fn[0].swipers && swipers_fn[0].swipers('play');
                    }
                    if (!document.getElementById('VimeoScript')) {
                        var tag = document.createElement('script');
                        tag.src = "https://player.vimeo.com/api/player.js";
                        tag.id = 'VimeoScript';
                        document.body.appendChild(tag);

                        var t = $.Deferred();
                        window.VimeoPromise = t;

                        tag.onload = function () {
                            t.resolve();
                        }
                    }
                    if (youtubePlayerClicked) {
                        if (!youtubePlayer) { // initiating
                            return;
                        }
                        iframe.show();
                        videos_js_icons.hide();
                        video_js_play_btn.hide().trigger('togglevideo', 0);
                        youtubePlayer.setCurrentTime(0).then(function () {// this is vimeo player so use vimeo api
                            youtubePlayer.play();
                        });
                    } else {
                        that.before(iframe);
                        youtubePlayerClicked = true;
                        window.VimeoPromise.then(function () {
                            youtubePlayer = new Vimeo.Player(iframe[0], {
                                responsive: true
                            });

                            console.log(youtubePlayer);

                            setTimeout(() => {
                                youtubePlayer.play();
                            }, 0);

                            youtubePlayer.on('ended', function () {
                                console.log('vimeo player ended');
                                iframe.hide();
                                videos_js_icons.show();
                                video_js_play_btn.show().trigger('togglevideo', 1);
                                if (swipers_fn.length) {
                                    swipers_fn[0].swipers && swipers_fn[0].swipers('pause');
                                }
                            });

                            videos_js_icons.hide();
                            video_js_play_btn.hide().trigger('togglevideo', 0);
                        });
                    }
                });
                return;
            }
            iframe = $('<iframe>').attr({
                allowfullscreen: '',
                src: src + (/\?/.test(src) ? '&enablejsapi=1' : '?enablejsapi=1'),
                frameborder: 0,
                allow: 'picture-in-picture;autoplay',
                id: 'youtube' + vid
            }).addClass('video-player-inline prism-player');
            that.after(video_js_play_btn);
            swipers_fn = video_js_play_btn.closest('.swiper-container');
            videos_js_icons.show();

            video_js_play_btn.on('click', function () {
                if (swipers_fn.length) {
                    swipers_fn[0].swipers && swipers_fn[0].swipers('play');
                }
                if (!document.getElementById('YouTubeScript')) {
                    var tag = document.createElement('script');
                    tag.src = "https://www.youtube.com/iframe_api";
                    tag.id = 'YouTubeScript';
                    document.body.appendChild(tag);
                    var t = $.Deferred();
                    window.YouTubePromise = t;
                    window.onYouTubeIframeAPIReady = function() {
                        t.resolve();
                    }
                }
                if (youtubePlayerClicked) {
                    if (!youtubePlayer) { // initiating
                        return;
                    }
                    iframe.show();
                    videos_js_icons.hide();
                    video_js_play_btn.hide().trigger('togglevideo', 0);
                    youtubePlayer.seekTo(0);
                    youtubePlayer.playVideo();
                } else {
                    that.before(iframe);
                    youtubePlayerClicked = true;
                    window.YouTubePromise.then(function () {
                        youtubePlayer = new YT.Player('youtube' + vid, {
                            events: {
                                'onReady': function (event) {
                                    console.log('ready');
                                    event.target.playVideo();
                                },
                                onStateChange: function (e) {
                                    if (e.data === 0) {
                                        console.log('stopped');
                                        iframe.hide();
                                        videos_js_icons.show();
                                        video_js_play_btn.show().trigger('togglevideo', 1);
                                        if (swipers_fn.length) {
                                            swipers_fn[0].swipers && swipers_fn[0].swipers('pause');
                                        }
                                    }
                                }
                            }
                        });

                        videos_js_icons.hide();
                        video_js_play_btn.hide().trigger('togglevideo', 0);
                    });
                }
            });
            // var video_dialog_open_btn = document.getElementById('video_dialog_open_btn').value;
            // if(video_dialog_open_btn){
            //     $(window).scroll(function(e){
            //         var bcr=that.parent()[0].getBoundingClientRect();
            //         var isBody = iframe.parent().is('body');
            //         console.log(isBody)
            //         if(bcr.bottom<0){
            //             if(!isBody){
            //                 iframe.appendTo('body').addClass('video-picture-inPicture').removeClass('video-player-inline prism-player');
            //             }
            //         }else if(isBody){
            //             that.after(iframe.removeClass('video-picture-inPicture').addClass('video-player-inline'))
            //         }
            //     })
            // }
            return;
        }

        var video = $('<div id="' + vid + '" class="aliplayer_video video-player-inline" style="display:none;"></div>');
        var videos_js_hides = $custom.find('.videos_js_hides');

        var recommend_swiper_list = $custom.find('.recommend_swiper_list');
        if (that.attr('video_mid') == "1") {
            $custom.addClass('m_video_hides_fun');
        }
        var video_mid_bol = true;
        if (that.attr('video_mid') == "2") {
            video_mid_bol = false;
            video.addClass('no_clicks');
        }
        videos_js_icons.show();
        that.after(video);
        that.after(video_js_play_btn);
        recommend_swiper_list.hide();

        var id_box = that.closest('[bg_img_url]'),
            generate_id = id_box.attr('id'),
            recommend_swiper_list_x = id_box.find('.recommend_swiper_list_x');
        video.append(recommend_swiper_list_x)

        var recommend_swiper_fixed = recommend_swiper_list_x.find('.recommend_swiper_fixed')

        if (!recommend_swiper_list_x.length) {
            video.append($('<button>')
                .addClass('inline-video-close')
                .attr({ type: 'button' })
                .on({
                    mouseenter: function () {
                        video.find('.prism-tooltip').first().html('Stop').show().css('left', video.width() - 145);
                    },
                    mouseleave: function () {
                        video.find('.prism-tooltip').first().hide();
                    },
                    click: function () {
                        if (playerList[vid]) {
                            playerList[vid].pause();
                            playerList[vid].seek(0);
                            setTimeout(function () {
                                video_js_play_btn.show();
                            })
                            videos_js_hides.show();
                            videos_js_icons.show();
                            video.hide().trigger('togglevideo', 0);
                            recommend_swiper_list.show();
                        }
                    }
                }));
        }

        swipers_fn = video_js_play_btn.closest('.swiper-container');


        video_js_play_btn.click(function () {
            if (swipers_fn.length && swipers_fn[0].swipers) {
                swipers_fn[0].swipers('play');
                if (that.attr('playback_mode') === 'auto' && isBanner && swipers_fn[0].swiper) {
                    swipers_fn[0].swiper.params.onSlideChangeEnd = function(){
                        swipers_fn.find('.swiper-slide').each(function(index){


                            var vid = $(this).find('.video_js_play_btn').attr('v_id')
                            if(index === swipers_fn[0].swiper.realIndex){
                                $(this).find('[video-src]').data('state', 'play')

                                setTimeout(() => {
                                    if(!playerList[vid] || (playerList[vid] && playerList[vid].tag.paused)){
                                        $(this).find('.video_js_play_btn').trigger('click')
                                    }
                                }, 2000)
                            }else{
                                $(this).find('[video-src]').data('state', 'pause')
                                if(playerList[vid]){
                                    playerList[vid].seek(0);
                                    playerList[vid].pause();
                                }
                            }
                        })
                    }
                }
            }
            var detail_video_id = $(this).parent().attr('v_id')
            var language_code = $(this).parent().attr('lang')
            if (detail_video_id) {
                detail_video_stat(detail_video_id, 'play_count', language_code)
            }
            if ($('#aliplayer_min_js').length==0) {
                $('body').append('<script id="aliplayer_min_js" src="/libs/aliplayer/aliplayer-min.js"></script>')
            }
            if (!window['Aliplayer']) {
                return false;
            }
            var set_playback_mode = $('#set_playback_mode').val(),
                video_btn = $(this).siblings('[video-src]').not('img');
            if (video_btn.attr('playback_mode')) {
                set_playback_mode = video_btn.attr('playback_mode');
            }
            if (set_playback_mode == 'popup') {
                var btn_src = video_btn.attr('video-m3u8src') || video_btn.attr('video-src');
                // console.log(recommend_swiper_list_x);
                createAliPlayer_2(btn_src,$(this),recommend_swiper_list_x,detail_video_id,language_code)
                return false;
            }
            var vid = $(this).attr('v_id')
            video_js_play_btn.hide();
            videos_js_hides.hide();
            videos_js_icons.hide();
            if (playerList[vid]) {
                playerList[vid].play()
                return false
            }
            recommend_swiper_list.find('.undo_icon').click(function(){
                video_js_play_btn.hide();
                videos_js_hides.hide();
                videos_js_icons.hide();
                video.css({ 'pointer-events': 'none' });
                video.css({ 'pointer-events': 'auto' })
                playerList[vid].play()
            })
            recommend_swiper_list_x.find('.undo_icon').click(function(){
                video_js_play_btn.hide();
                videos_js_hides.hide();
                videos_js_icons.hide();
                video.css({ 'pointer-events': 'none' });
                video.css({ 'pointer-events': 'auto' })
                playerList[vid].play()
            })
            var player = createAliPlayer({
                vid: vid,
                src: src,
                onPlay: function () {
                    video.show().trigger('togglevideo', 1);
                    recommend_swiper_list.hide();
                    recommend_swiper_fixed.hide();
                    for(var key in playerList){
                        if (key != vid) {
                            playerList[key].pause();
                        }
                    }
                    if (swipers_fn.length) {
                        swipers_fn[0].swipers&&swipers_fn[0].swipers('play');
                    }
                    // video.children('video')[0].requestPictureInPicture();
                },
                onClick: function () {
                    var vids = player.tag;
                    if (vids.paused) {
                        player.play();
                    }else{
                        player.pause();
                    }
                },
                onPause: function (){
                    if(!video_mid_bol){
                        video_js_play_btn.hide();
                    }
                    if (swipers_fn.length && swipers_fn[0].swipers) {
                        if(that.attr('playback_mode') === 'auto' && isBanner){
                            swipers_fn[0].swipers('play');
                            player.seek(0);
                            setTimeout(function(){
                                video_js_play_btn.show();
                            })
                            videos_js_hides.show();
                            videos_js_icons.show();
                            video.hide().trigger('togglevideo', 0);
                            recommend_swiper_list.show();
                        }else{
                            swipers_fn[0].swipers('pause');
                        }
                    }
                },
                onEnded: function () {
                    if (!video.hasClass('prism-fullscreen')) {
                        player.seek(0);
                        setTimeout(function(){
                            video_js_play_btn.show();
                        })
                        videos_js_hides.show();
                        videos_js_icons.show();
                        video.hide().trigger('togglevideo', 0);
                        recommend_swiper_list.show();

                    }else{
                        player.seek(0);
                        // recommend_swiper_list.show();
                        recommend_swiper_list.show();
                        recommend_swiper_fixed.show();

                    }

                    if(that.attr('playback_mode') === 'auto' && isBanner && swipers_fn[0].swiper && swipers_fn[0].swiper.params.speed > 0){
                        if(swipers_fn[0].swiper.realIndex === swipers_fn[0].swiper.slides.length - 1){
                            swipers_fn[0].swiper.slideTo(0, 1000, true)
                        }else{
                            swipers_fn[0].swiper.slideNext(true)
                        }
                    }

                    if (recommend_swiper_list.length&&window['swiper'+generate_id]) {
                        window['swiper'+generate_id].onResize();
                    }
                    if (detail_video_id) {
                        detail_video_stat(detail_video_id, 'full_play_count',language_code)
                    }
                }
            })
            playerList[vid] = player;
        });
        var video_dialog_open_btn =$('#video_dialog_open_btn').val();
        if(Number(video_dialog_open_btn)){
            $(window).scroll(function(e){
                var bcr=that.parent()[0].getBoundingClientRect();
                if(bcr.bottom<0){ // scrolled past the window
                    video.appendTo('body').addClass('video-picture-inPicture').removeClass('video-player-inline');
                }else{
                    that.after(video.removeClass('video-picture-inPicture').addClass('video-player-inline'))
                }
            })
        }
    })
}


// 点击弹框播放
function createAliPlayer_2(src,btn,list,detail_video_id,language_code){
    var vid = "my_video_"+new Date().getTime(),
        id = btn.attr('v_id'),
        m_id = 'm_'+id,
        box = $('#'+m_id);
    if (box.length) {
        $('body').append(modal).addClass('body_video_current_overflow');
        box.show();
        box.find('.con').show(300,function(){
            box[0].modals.play();
        })
        return;
    }
    var modal = $(`<div class="video_current_modal" id="${m_id}">
        <div class="con">
            <div class="video_close iconfont iconguanbi"></div>
            <div class="box">
                <div class="video_con" id="${vid}"></div>
            </div>
        </div>
    </div>`);
    $('body').append(modal).addClass('body_video_current_overflow');
    var video = modal.find('.video_con'),
        list_modal = null;
    modal.find('.con').show(300)
    var player = createAliPlayer({
        vid: vid,
        src: src,
        onPlay: function () {
            if (list_modal) {
                list_modal.hide();
            }
            for(var key in playerList){
                if (key != vid) {
                    playerList[key].pause();
                }
            }
        },
        onClick: function () {
            var vids = player.tag;
            if (vids.paused) {
                player.play();
            }else{
                player.pause();
            }
        },
        onPause: function (){

        },
        onEnded: function () {
            player.seek(0);
            if (list_modal) {
                list_modal.show();
            }
            if (detail_video_id) {
                detail_video_stat(detail_video_id, 'full_play_count',language_code)
            }
        }
    })
    modal[0].modals = player;
    if (list.length) {
        video.append(list);
        list_modal = list.find('.recommend_swiper_fixed');
        list_modal.find('.undo_icon').click(function(){
            player.play();
        })
    }
    modal.find('.video_close').click(function(){
        player.pause();
        modal.find('.con').hide(300,function(){
            modal.hide();
        })
        $('body').removeClass('body_video_current_overflow');
    })
    playerList[vid] = player;
}

// 点击原地播放
function createAliPlayer (params) {
    var video_definition = document.getElementById('videoDefinition').value;
    var player = new Aliplayer({
        id: params.vid,
        source: params.src,
        width: "100%",
        height: "100%",
        autoplay: false,
        playsinline: true,
        isLive: false,
        rePlay: false,
        playsinline: false,
        preload: false,
        language: "en-us",
        x5_video_position: "top",  x5_type: "h5",
        skinLayout: [{
            "name": "H5Loading",
            "align": "cc"
        }, {
            "name": "errorDisplay",
            "align": "tlabs",
            "x": 0,
            "y": 0
        }, {
            "name": "infoDisplay"
        }, {
            "name": "tooltip",
            "align": "blabs",
            "x": 0,
            "y": 56
        }, {
            "name": "controlBar",
            "align": "blabs",
            "x": 0,
            "y": 0,
            "children": [{
                "name": "progress",
                "align": "blabs",
                "x": 0,
                "y": 44
            }, {
                "name": "playButton",
                "align": "tl",
                "x": 15,
                "y": 12
            }, {
                "name": "timeDisplay",
                "align": "tl",
                "x": 10,
                "y": 7
            }, {
                "name": "fullScreenButton",
                "align": "tr",
                "x": 10,
                "y": 12
            }, {
                "name": "setting",
                "align": "tr",
                "x": 15,
                "y": 12
            }, {
                "name": "volume",
                "align": "tr",
                "x": 5,
                "y": 10
            }]
        }]
    }, function (video_box) {
        const $box = $(video_box.tag)
        $box.attr({
            'playsinline': true,
            'webkit-playsinline': true
        });
        if (video_definition == "hd") {
            video_box.player_maxtop = true
        }
        video_box.play(player);
    });

    player.on('play', function () {
        params.onPlay();
    });

    $(player._el).on('click', 'video', function () {
        params.onClick(player)
    });

    player.on('pause', function () {
        params.onPause(player)
    });

    player.on('ended', function () {
        params.onEnded(player)
    });

    return player;
}

// 详情页视频点击次数，完播率统计  play_count：播放视频 full_play_count：完整播放视频 arouse_chatonline_counts：唤起chatonline
function detail_video_stat(video_id, type, language_code) {
    $.ajax({
        type: "get",
        url: '/play-video',
        datatype: 'json',
        data: {
            language_code,
            video_id,
            type,
            counts: 1
        },
        async: false,
        success: function (res) {

        }
    })
}


// 提交提示
var prompt_box_arr = [];
function prompt_box_fun(objs) {
    var ent = window.event || {},
        btn = ent.submitter;
    if (ent&&btn) {
        // if ($(btn).hasClass('disabled')) {
        //     return false;
        // }
        if ($(btn).hasClass('prompt_btn_no')) {
            return false;
        }else{
            $(btn).addClass('prompt_btn_no');
            setTimeout(function(){
                $(btn).removeClass('prompt_btn_no');
            },600)
        }
    }
    var obj = {
        text: msgSuccess_text
    }
    obj = $.extend(true, obj, objs);
    var box = $('<div class="prompt_box_s">' + obj.text + '</div>');
    if (obj.color) {
        box.css("color", obj.color);
    }
    if (obj.bg_color) {
        box.css("background", obj.bg_color);
    }
    if (obj.type) {
        box.addClass(obj.type)
    }
    var new_h = h(prompt_box_arr);

    $('body').append(box);
    prompt_box_arr.push(box);
    box.css('marginTop',new_h);

    setTimeout(function(){
        box.addClass('active');
    },100)
    setTimeout(function(){
        box.removeClass('active');
        auto_h();
        setTimeout(function(){
            box.remove();
        },600)
    },3000)
    function auto_h(){
        var h = 0;
        for (var i = 0; i < prompt_box_arr.length; i++) {
            var l_box = prompt_box_arr[i-1];
            if (i&&l_box&&l_box.hasClass('active')) {
                h += prompt_box_arr[i-1].outerHeight() + 10;
            }
            prompt_box_arr[i].css('marginTop',h);
        }
    }
    function h(arr){
        auto_h();
        var h = 0;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].hasClass('active')) {
                h += arr[i].outerHeight() + 10;
            }
        }
        return h;
    }
}


// 询盘
// var localLang_url = $('#inquire_success_herf').val();
var msgSuccess_text = _langs_json['Successful operation'];
var msgFail_text = _langs_json['Failure to submit'];
var msgError_text = _langs_json['network error'];
function appid_fun(email) {
    var  appid = "";
    $.ajax({
        type: "post",
        url: "/inquiry-verify",
        datatype: "json",
        async: false,
        data: { email: email },
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(res) {
            if (res) {
                if (res.verification_type == 2){
                    appid = res.site_key;
                }else{
                    appid = res.appid;
                }
            }
        }
    });
    return appid;
}
var _getData = null;
var _form = null;
var _globalCallback = null;
function form_submit_ajax(form,serialize,fun){
    var method = form.attr('method') || 'GET';
    var ajaxParams = {
        type: method,
        url: form.attr('action'),
        data: serialize,
        datatype: 'json',
        // async: false,
        success: function (res) {
            if (res.status == 200) {
                if (_globalCallback) {
                    _globalCallback();
                } else {
                    form.find('input[type="text"],textarea').val('');
                    form.find('.form_inp').removeClass("active");
                    var uls = $('.inquiry_attachment .attachment_ul');
                    uls[0] && uls.html('') && uls.siblings('[name="attach"]').val('');
                    window.location.href = $('#inquire_success_herf').val();
                }
            } else if (res.status == 203) {
                _getData = serialize;
                _globalCallback = null; // unset callback when submitting inquiry
                $('.google_dialog_box').css('visibility', 'visible');
                // form_submit_ajax(form,getData,function(){})
            } else {
                var text = msgFail_text;
                if (res.msg) {
                    text = res.msg;
                }
                prompt_box_fun({
                    type: 'error',
                    text: text
                })
            }
            if (fun) {
                fun();
            }
        },
        error: function (res) {
            prompt_box_fun({
                type: 'error',
                text: msgError_text
            })
            if (fun) {
                fun();
            }
        }
    };
    if (method.toLowerCase() === 'post') {
        ajaxParams.headers = {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        };
        if (serialize && typeof serialize === 'object') {
            ajaxParams.headers['Content-Type'] = 'application/json';
            ajaxParams.data = JSON.stringify(serialize);
        }
    }
    $.ajax(ajaxParams);
}
function gooble_callback(e) {
    if (typeof _getData === 'object') {
        _getData['g-recaptcha-response'] = e;
        _getData.google_ver = 'v2';
    } else {
        _getData = _getData.slice(0, _getData.lastIndexOf('=') + 1);
        _getData += e + '&google_ver=v2';
    }
    console.log(_form, _getData)
    form_submit_ajax(_form, _getData, function () { });
}
function form_submit(that) {
    function done() {
        form_submit_ajax(form, serialize, function () {
            btn.removeClass("disabled");
        });
    }
    var form = $(that),
        ched = form.find('.errors'),
        arr = form.serializeArray(),
        serialize = {},
        btn = form.find('button');

    form.attr('method', 'POST');

    arr.forEach(function (item) {
        if (item.name in serialize) {
            serialize[item.name] = [].concat(serialize[item.name], item.value);
        } else {
            serialize[item.name] = item.value;
        }
    });
    _form = $(that);
    if (btn.hasClass("disabled")) {
        return false;
    }
    btn.addClass("disabled");
    if (ched.length) {
        prompt_box_fun({
            type: 'error',
            text: form.find('.enquiry_label.errors .required_tips').text()
        })
        btn.removeClass("disabled");
        return false;
    }
    if (document.referrer === '') {
        var previous = window.location.href;
    } else {
        var previous = document.referrer;
    }
    var page_tk = {
        page_title: document.title || '',
        page_word: $('meta[name="keywords"]').attr('content')
    };

    if ($('meta[name="imgCover"]').attr('content')) {
        page_tk.page_cover = $('meta[name="imgCover"]').attr('content');
    }

    if ($('#page_promote_id').length) {
        serialize.promote_id = $('#page_promote_id').val();
    }

    serialize.previous_page = previous;
    $.extend(serialize, page_tk);
    var verify_token = false;
    var is_verify = false;console.log('verification_open_inp',$('#verification_open_inp').val());
    console.log('_verification_type', _verification_type);
    if ($('#verification_open_inp').val()!="0") {
        console.log($('#verification_open_inp').val(),'verification_open_inp')
        if (_verification_type == 2) {
            verify_token = appid_fun(form.find('[name=email]').val());
            console.log('谷歌token',verify_token);
            if(verify_token){
                is_verify = true;
                grecaptcha.ready(function () {
                    grecaptcha.execute(verify_token, { action: 'validate_captcha' })
                        .then(function (token) {
                            console.log(token)
                            serialize.action = 'validate_captcha';
                            serialize['g-recaptcha-response'] = token;
                            done();
                        });
                });
            }
        } else if (_verification_type == 1) {
            verify_token = appid_fun(form.find('[name=email]').val()) + '';
            if (verify_token) {
                is_verify = true;
                function loadTCaptchaNow() {
                    return new Promise (resolve => {
                        if (typeof TencentCaptcha !== 'function') {
                            console.log('Load TC now')
                            const script = document.createElement('script')
                            script.src = 'https://turing.captcha.qcloud.com/TCaptcha.js'
                            script.type = 'text/javascript'
                            script.onload = () =>{
                                console.log('TC loaded')
                                resolve()
                            }
                            script.onreadystatechange =  ()=> {
                                console.log('onreadystatechange', script.readyState)
                                if (!script.readyState || script.readyState === "loaded" || script.readyState === "complete") {
                                    script.onreadystatechange = null
                                    resolve()
                                }
                            }
                            document.getElementsByTagName('head')[0].appendChild(script);
                            return
                        }
                        console.log('TC have been loaded')
                        resolve()
                    })
                }
                loadTCaptchaNow().then(() => {
                    var captcha1 = new TencentCaptcha(verify_token, function (res) {
                        console.log(res)
                        if (res.ret != 0) {
                            btn.removeClass("disabled");
                            return;
                        }
                        $.extend(serialize, res);
                        done();
                    });
                    captcha1.show(); // 显示验证码
                })
                return false
            }
        }
        if (_verification_type == 3) {
            verify_token = appid_fun(form.find('[name=email]').val()) + '';
            if (verify_token) {
                is_verify = true
                CustomizedCaptcha.show().then(res=>{
                    $.extend(serialize, res);
                    done();
                }).catch(err=>{
                    btn.removeClass("disabled");
                })
                return false
            }
        }

    }
    if(is_verify ==false) {
        done();
    }

    return false;
}



// 上传附件
function oss_upload_move_all(inp, obj, type) {
    var times = + new Date();
    var result = null;
    var file = inp[0].files;
    var box = obj.box;

    var before_bol = obj.before({inp: inp ,file:file})

    if (before_bol===false) {
        inp.val('');
        return false;
    }

    for (let i = 0; i < file.length; i++) {
        let files = file[i];
        let gettype = getType_fun(files.name);
        let file_name = 'file_' + i + times + gettype;
        let hls = function(gettype){
            let text = '';
            if(gettype.indexOf('mp4')>-1||gettype.indexOf('mov')>-1){
                text = 'hls/';
            }
            return text;
        }(gettype);

        let progress = $(`<div class="progress" style="position: absolute; right: 0px; left: 0px; bottom: ${i*10}px; height: 6px; margin: 0px;z-index: 99;">
                <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
                    style="width: 0%; transition: all 0s ease 0s;"></div>
            </div>`);
        let accept = inp.attr("accept_type");
        if (accept) {
            accept = accept.split(',');
            let accept_i = 0;
            for (let i = 0; i < accept.length; i++) {
                if (files.type.indexOf(accept[i]) > -1) {
                    accept_i++;
                }
            }
            if (!accept_i) {
                obj.error({
                    inp: inp,
                    err: '文件格式错误'
                })
                continue;
            }
        }

        if (obj.maxsize) {
            if (parseInt(files.size) > parseInt(obj.maxsize)) {
                obj.error({
                    inp: inp,
                    err: (function (maxsize) {
                        var text = '';
                        var gb = (maxsize / 1024 / 1024 / 1024).toFixed(2),
                            mb = (maxsize / 1024 / 1024).toFixed(2),
                            kb = (maxsize / 1024).toFixed(2);
                        if (gb >= 1) {
                            text = (gb) + "GB"
                        } else if (mb >= 1) {
                            text = (mb) + "MB"
                        } else {
                            if (kb > 10) {
                                text = (kb) + "KB"
                            } else {
                                text = (kb) + "KB"
                            }
                        }
                        return "文件不能大于" + text;
                    })(parseInt(obj.maxsize))
                });
                // inp.val('');
                // return;
                continue;
            }
        }

        if (box) {
            if (inp.closest(box).length > 0) {
                inp.closest(box).append(progress);
            }
        }
        let params_obj;
        let start_bol = obj.start({ inp: inp ,file:file ,files:files ,adds: function (params) {
                params_obj = params;
            }});
        if (start_bol===false) {
            return false;
        }
        // inp.prop("disabled", true);

        // OSS.urlib是sdk内部封装的发送请求的逻辑，开发者可以使用任何发送请求的库向`sts-server`发送请求
        OSS.urllib.request(window.location.protocol + '//' + window.location.host + "/token", { method: 'get' }, (err, response) => {
            if (err) {
                obj.error({
                    inp: inp,
                    err: err,
                    params_obj: params_obj,
                    code:101
                });
                // return alert(err);
                // console.log(err);
                progress.remove();
                // inp.prop("disabled", false).val('');
                return;
            }
            try {
                result = JSON.parse(response).data;
                // console.log(result);

            } catch (e) {
                let errmsg = 'parse sts response info error: ' + e.message;
                obj.error({
                    inp: inp,
                    err: errmsg,
                    params_obj: params_obj,
                    code:101
                });
                // console.log(errmsg);
                // inp.prop("disabled", false).val('');
                progress.remove();
                return;
            }
            if(!result||!result.AccessKeyId){
                obj.error({
                    inp: inp,
                    err: _langs_json['Upload failed'],
                    params_obj: params_obj,
                    code:101
                });
                // inp.prop("disabled", false).val('');
                progress.remove();
                return;
            }
            let client = new OSS({
                region: 'oss-us-west-1',
                accessKeyId: result.AccessKeyId,
                accessKeySecret: result.AccessKeySecret,
                stsToken: result.SecurityToken,
                endpoint: result.endpoint,
                bucket: result.bucket,
                secure: true,
                timeout: '120s',
                retryMax: 3,
            });
            if(type == 'ueditor'){
                file_name = result.site_id + '/ueditor/files/' + file_name;
            }else{
                file_name = hls + result.site_id + '/' + file_name;
            }
            //storeAs表示上传的object name , file表示上传的文件
            client.multipartUpload(file_name, files, {
                progress: function (p, checkpoint) {
                    var w = parseInt(p * 100) + "%"
                    progress.find('.progress-bar').width(w);
                    obj.progress({
                        inp: inp,
                        p: p,
                        files: files,
                        w: parseInt(p * 100),
                        params_obj: params_obj
                    });
                }
            }).then(function (res) {
                // 'http://video2b.oss-us-west-1.aliyuncs.com/'
                // https://img001.video2b.com/+site_id+/filename.png
                // var img_src = 'https://' + result.bucket + '.' + result.endpoint + '/' + file_name;
                var img_src = result.domain + '/' + file_name;
                res.files_ = files
                obj.success({
                    inp: inp,
                    src: img_src,
                    res: res,
                    files: files,
                    params_obj: params_obj
                });

                // inp.prop("disabled", false).val('');
                progress.remove();

                // 上传到素材库
                if(obj.file_params){
                    var file_params = {
                        // file_type: type, //2是视频
                        // site_id: '', //传空
                        path: img_src, //路径
                        // source: '2', //1视频管理 2装修
                        filename: files.name, //文件名
                        // _token: $('meta[name="csrf-token"]').attr('content'),
                        // table_page: $('#form_config [name="template_page"]').val(), // 装修页面
                        // table_type: '3', //2视频管理 3装修
                        // table_id: $('#form_config [name="table_id"]').val(), // 视频id 编辑的时候才要
                        // table_field: btn.attr('edit-name'),
                    }
                    // file_params = $.extend(file_params,obj.file_params);
                    // save_upload_data_fun(file_params);
                }

            }).catch(function (err) {
                // console.log(err)
                obj.error({
                    inp: inp,
                    err: _langs_json['Re_upload'],
                    params_obj: params_obj,
                    code:101
                });
                // return alert(err);
                // console.log(err);
                // inp.prop("disabled", false).val('');
                progress.remove();
            });
        })
    }
    inp.val('');
}
//获取文件后缀
function getType_fun(file) {
    var filename = file;
    var index1 = filename.lastIndexOf(".");
    var index2 = filename.length;
    var type = filename.substring(index1, index2);
    return type;
}


function inquiry_attachment_inp(inp){
    var attachment_box = inp.closest('.attachment_box'),
        attach = attachment_box.find('[name="attach"]'),
        li = attachment_box.find('.attachment_ul>li'),
        arr = [];
    li.each(function(){
        var that = $(this),
            data = {
                file_url: that.attr('file_url'),
                file_name: that.attr('file_name'),
                file_size: that.attr('file_size'),
                mime_type: that.attr('mime_type'),
            };
        if (data.file_url) {
            arr.push(data);
        }
    })
    var str = arr.length > 0 ? JSON.stringify(arr) : '';
    attach.val(str);
}

function inquiry_attachment_change_fun(inp_that){
    oss_upload_move_all(inp_that, {
        box:null,
        // maxsize: 1024*1024*20,
        before: function(obj){
            var inp = obj.inp,
                files = obj.file,
                box = inp.closest('.attachment_box'),
                li = box.find('.attachment_ul li');
            var file_obj = $.extend( true,{},files[0] );
            var name_hou = getType_fun(file_obj.name);
            if(!/pdf|xlsx|xls|doc|docx|txt|jpg|png|bmp|gif|rar|zip/i.test(name_hou)){
                prompt_box_fun({
                    type: 'error',
                    text: _langs_json.not_supported
                })
                return false;
            }

            if (file_obj.size>(1024*1024*20)) {
                prompt_box_fun({
                    type: 'error',
                    text: _langs_json.max_20m
                })
                return false;
            }
            if(li.length>=5){
                prompt_box_fun({
                    type: 'error',
                    text: _langs_json.max_to5
                })
                return false;
            }
        },
        // 开始
        start: function (obj) {
            // console.log(obj)
            // { inp: inp ,file:file ,files:files ,adds:function}
            var inp = obj.inp,
                files = obj.files,
                ul = inp.closest('.attachment_box').find('.attachment_ul');
            var li = $('<li>'+
                '<div class="file_txt">'+
                files.name+
                '<div class="operations">'+
                '<span class="font-color">0%</span>'+
                '<span class="iconfont iconshanchu1"></span>'+
                '</div>'+
                '</div>'+
                '</li>');
            ul.append(li);
            obj.adds(li);
            li.find('.operations .iconfont').click(function(){
                li.remove();
                inquiry_attachment_inp(inp);
            })
        },
        // 进度
        progress: function (obj) {
            obj.params_obj.find('.font-color').text(obj.w+'%');
        },
        // 成功
        success: function (obj) {
            var type = getType_fun(obj.files.name);
            type = 'application/' + type.substring(1,type.length);
            obj.params_obj.attr('file_url',obj.src);
            obj.params_obj.attr('file_name',obj.files.name);
            obj.params_obj.attr('file_size',obj.files.size);
            obj.params_obj.attr('mime_type',(obj.files.type||type));
            inquiry_attachment_inp(obj.inp);
        },
        // 失败
        error: function (obj) {
            // console.log(obj)
            obj.params_obj.find('.font-color').text('Upload failed');
        },
    });
}


// ----------------组件js-----聊天/分享

// 前台客服聊天
var chat_online_fun_obj = {};
var chat_online_sessionStorage = sessionStorage.getItem("chat_online_sessionStorage");//获取本地存储fang的内容

$(function() {
    if ($('#chat_is_open').val()=='1') {
        // 前台客服聊天
        chat_online_fun();
    }

    if ($('#is_share_bol').val()!='0') {
        // 分享
        share_fun_box2();
    }


    // 首页分享
    share_home_funs(document.body);
});
// 前台客服聊天框 2.0模板
function chat_online_fun(){
    var one_bol = true;
    var source_inp = '0';
    var placeholderFields={
        name: 'name_field_hint',
        phone: 'phone_field_hint',
        email: 'email_field_hint',
        msg: 'content_field_hint'
    };
    if($('[type="hidden"][name="source"]').length){
        if($('[type="hidden"][name="source"]').val()){
            source_inp = $('[type="hidden"][name="source"]').val();
        }
    }
    var obj = {
        ajax_detail: function(fun){
            $.ajax({
                url: "/chat-online/detail",
                type: 'post',
                dataType: 'json',
                // async:false,
                // cache:false,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                // data: {},
                success: function (result) {
                    fun(result);
                },
                error: function (textStatus) {
                    fun(null);
                }
            });
        },
        bol: chat_online_sessionStorage=="1"?false:true,
        is_form: $('#chat_is_form').val(),
        btn_box: $('#chat_online_box'),
        chat_box: $('<div class="chat_online_box2"><div class="iframe_conceal" style=""><img src="/images_2/5.png"></div><div>'),
        form_box: $('<div class="chat_online_box_form"><div class="mqChat-head"><i class="iframe_conceal iconfont iconguanbi4"></i><span class="span">Leave Your Message</span></div><div class="form">'+
            '<div class="prompt_language" style="display:none"></div>'+
            '<form class="inquiryform" onsubmit="return form_submit_form_submit(this);"><input type="hidden" name="is_from_chatonline" id="chatonline_iq_is_from_chatonline" value="1"><input type="hidden" name="enquiry_type" id="chatonline_iq_enquiry_type" value="3"><input type="hidden" name="visitlength" id="chatonline_iq_visitlength" value="'+(function(){
                var text = new Date().getTime();
                text = parseInt(text/1000);
                return text;
            })()+'"><input type="hidden" name="source" id="chatonline_iq_source" value="'+source_inp+'"><div class="form-group"><label><i class="red">*</i>Name:</label><input type="text" name="name" id="chatonline_iq_name" class="form-control name_ chat_inp" required="" oninvalid="setCustomValidity(\'Please fill in this field\')" oninput="setCustomValidity(\'\')"></div><div class="form-group"><label>'+(function(){
                var chat_prompt_phone = $('#chat_prompt_phone').val(),
                    i_red = '';
                if (chat_prompt_phone) {
                    i_red = '<i class="red">*</i>';
                }
                return i_red;
            })()+'Phone/WhatsApp:</label><input type="text" name="phone" id="chatonline_iq_phone" class="form-control phone_ chat_inp" '+(function(){
                var chat_prompt_phone = $('#chat_prompt_phone').val();
                return chat_prompt_phone;
            })()+' oninput="this.value=this.value.replace(/[^\\d]/g,\'\');setCustomValidity(\'\')" oninvalid="setCustomValidity(\'Please fill in this field\')"></div><div class="form-group"><label><i class="red">*</i>E-mail:</label><input type="text" name="email" id="chatonline_iq_email" class="form-control email_ chat_inp" required="" oninvalid="setCustomValidity(\'Please fill in this field\')" oninput="setCustomValidity(\'\')"><p class="required_tips">Format error</p></div><div class="form-group"><label><i class="red">*</i>Content:</label><textarea name="msg" id="chatonline_iq_msg" rows="2" class="form-control contents_ chat_inp" required="" oninvalid="setCustomValidity(\'Please fill in this field\')" oninput="setCustomValidity(\'\')"></textarea></div><div class="form-group form-group--submit"><button type="submit" id="submit_pulbic" class="btn chat_online_box_form__btn btn-block">Send Inquiry Now</button></div>	 </form></div></div>'),
        btn_click: function(){
            if (obj.btn_box.hasClass('chat_online_box--loading')) {
                return false;
            }
            if (one_bol) {
                $('body').append(obj.chat_box);
                obj.form_box.find('[name]').each(function () {
                    var fieldName = $(this).attr('name');
                    if (placeholderFields[fieldName]) {
                        $(this).attr('placeholder', inquiryFormTexts[placeholderFields[fieldName]]);
                    }
                });
                $('body').append(obj.form_box.addClass('chat-online-form' + ChatOnlineConfig.styleId));
                if ($('#chat_prompt').val()) {
                    var chat_prompt_txt = $('#chat_prompt').val();
                    chat_prompt_txt = chat_prompt_txt.replace(/\n/g, '<br/>');
                    obj.form_box.find('.prompt_language').html(chat_prompt_txt).show();
                }
                one_bol = false;
                $('body').on('click','.iframe_conceal',function(){
                    obj.form_box.removeClass('chat_online_box_form--reveal');
                    obj.chat_box.hide();
                    obj.chat_box.find('iframe').remove();
                    obj.btn_box.removeClass('chat_online_box--hidden');
                })
            }

            if(obj.is_form==1&&chat_online_fun_obj.bol){
                obj.form_box.addClass('chat_online_box_form--reveal');
                obj.btn_box.addClass('chat_online_box--hidden');
            }else{
                obj.btn_box.addClass('chat_online_box--loading');
                obj.chat_box.find('.none_imgs_chat_box').remove();

                obj.ajax_detail(function(result){
                    if(result && result.status==200 && result.data){
                        obj.data = result.data;
                        chat_online_fun_obj.data = result.data;
                        obj.chat_box.show();
                        obj.chat_box.append('<img class="none_imgs_chat_box" src="/images/small_load2.gif" alt="" style="position:absolute;width:20px;top:50%;left:50%;transform:translate(-50%,-50%);">')
                        obj.chat_box.append($('<iframe src="'+obj.data.url + '&page=' + escape(window.location.href)+'" frameborder="0" style="width: 100%;height: 100%;display:none;position: relative;z-index:2;"></iframe>'));
                        setTimeout(function(){
                            obj.chat_box.find('iframe').show();
                        },600)
                        obj.btn_box.addClass('chat_online_box--hidden');
                    }
                    obj.btn_box.removeClass('chat_online_box--loading');
                })
            }
        }
    }
    chat_online_fun_obj = {
        form_box: obj.form_box,
        chat_box: obj.chat_box,
        btn_box: obj.btn_box,
        bol: obj.bol
    }
    obj.btn_box.click(function(){
        obj.btn_click();
        var that = $(this)
        if (that.attr('v_id')) {
            detail_video_stat(that.attr('v_id'), 'arouse_chatonline_counts', that.attr('lang'))
        }
    })
    $('.chat_online_clicks').click(function(){
        obj.btn_box.trigger('click');
    })
}
function form_submit_iframe_fun(){
    var type = '';
    if($('body.body_color_bgs').hasClass('body_pages_promote')){
        type = '?types=1'
    }
    $('body').append($('<iframe src="' +  $('#inquire_success_herf').val() + type + '" frameborder="0" style="width:100px;height:100px;display:block;position:absolute;z-index:-10;opacity:0;pointer-events:none;"></iframe>'));
}

 function form_submit_form_submit(that) {
    console.log('that', that)
    function done(challenge) {
        function successCallback() {
            function revealChatFrame(url) {
                chat_online_fun_obj.chat_box.append($('<iframe src="' + url + '&page=' + escape(window.location.href) + '" frameborder="0" style="width: 100%;height: 100%;display:none;position: relative;z-index:2;"></iframe>'));
                setTimeout(function () {
                    chat_online_fun_obj.chat_box.find('iframe').show();
                }, 600);
            }

            form.find(".chat_inp").val('');
            chat_online_fun_obj.form_box.hide();
            chat_online_fun_obj.chat_box.show();
            chat_online_fun_obj.chat_box.append('<img src="/images/small_load2.gif" alt="" style="position:absolute;width:20px;top:50%;left:50%;transform:translate(-50%,-50%);">');

            $.ajax({
                url: "/chat-online/detail",
                type: 'post',
                dataType: 'json',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function (result) {
                    if (result && result.status == 200 && result.data && result.data.url) {
                        revealChatFrame(result.data.url);
                    } else {
                        revealChatFrame(chat_online_fun_obj.data.url);
                    }
                    form_submit_iframe_fun();
                },
                error: function (textStatus) {
                    revealChatFrame(chat_online_fun_obj.data.url);
                    form_submit_iframe_fun();
                }
            });

            // chat_online_fun_obj.btn_box.hide();
            chat_online_fun_obj.bol = false;
            sessionStorage.setItem("chat_online_sessionStorage", '1');
            if (window['foot_enquiry_fun']) {
                window['foot_enquiry_fun']();
            }

            chat_prompt_box_fun();
        }
        return $.ajax({
            type: 'POST',
            url: '/add-enquiry',
            data: JSON.stringify(serialize),
            datatype: 'json',
            headers:  {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'Content-Type': 'application/json'
            },
            // async: false,
            success: function (res) {
                if (res.status == 200) {
                    successCallback();
                } else {
                    if (challenge && res.status == 203) {
                        _getData = serialize;
                        _form = $('<form>').attr({ 'action': '/add-enquiry', method: 'POST' });
                        _globalCallback = function() {
                            $('.google_dialog_box').css('visibility', 'hidden');
                            successCallback();
                        };
                        $('.google_dialog_box').css('visibility', 'visible');
                        return;
                    }
                    var text = "Failure to submit";
                    if (res.msg) {
                        text = res.msg;
                    }
                    chat_prompt_box_fun({
                        type: 'error',
                        text: text
                    });
                }
                btn.removeClass("disabled");
            },
            error: function (res) {
                chat_prompt_box_fun({
                    type: 'error',
                    text: "network error"
                })
                btn.removeClass("disabled");
                // alert("网络错误");
            }
        });
    }

    var form = $(that),
        ched = form.find('.form-group.errors'),
        arr = form.serializeArray(),
        serialize = {},
        btn = form.find('.enquiry_btn_box .read_more_a');

    form.attr('method', 'POST');

    arr.forEach(function (item) {
        if (item.name in serialize) {
            serialize[item.name] = [].concat(serialize[item.name], item.value);
        } else {
            serialize[item.name] = item.value;
        }
    });

    if (btn.hasClass("disabled")) {
        return false;
    }
    btn.addClass("disabled");
    if (ched.length) {
        btn.removeClass("disabled");
        return false;
    }
    if (document.referrer === '') {
        // 没有来源页面信息的时候，改成首页URL地址
        var previous = window.location.href;
    } else {
        var previous = document.referrer;
    }

    var page_tk = {
        page_title: document.title || '',
        page_word: $('meta[name="keywords"]').attr('content')
    };

    if ($('meta[name="imgCover"]').attr('content')) {
        page_tk.page_cover = $('meta[name="imgCover"]').attr('content');
    }

    serialize.previous_page = previous;
    $.extend(serialize, page_tk);
    if ($('#page_promote_id').length) {
        serialize.promote_id = $('#page_promote_id').val();
    }

    if ($('#chat_online_box').attr('v_id')) {
        serialize.id =$('#chat_online_box').attr('v_id');
    }

    var verify_token = false;
    var is_verify = false;
    if ($('#verification_open_inp').val() != "0") {
        if (_verification_type == 2) {
            verify_token = appid_fun(form.find('[name=email]').val()) + '';
            if (verify_token) {
                is_verify = true;
                grecaptcha.ready(function () {
                    grecaptcha.execute(verify_token, { action: 'validate_captcha' })
                        .then(function (token) {
                            serialize.action = 'validate_captcha';
                            serialize['g-recaptcha-response'] = token;
                            done(true);
                        });
                });
            }
        } else if (_verification_type == 1) {
            verify_token = appid_fun(form.find('[name=email]').val()) + '';
            if (verify_token) {
                is_verify = true;
                function loadTCaptchaNow() {
                    return new Promise (resolve => {
                        if (typeof TencentCaptcha !== 'function') {
                            console.log('Load TC now')
                            const script = document.createElement('script')
                            script.src = 'https://turing.captcha.qcloud.com/TCaptcha.js'
                            script.type = 'text/javascript'
                            script.onload = () =>{
                                console.log('TC loaded')
                                resolve()
                            }
                            script.onreadystatechange =  ()=> {
                                console.log('onreadystatechange', script.readyState)
                                if (!script.readyState || script.readyState === "loaded" || script.readyState === "complete") {
                                    script.onreadystatechange = null
                                    resolve()
                                }
                            }
                            document.getElementsByTagName('head')[0].appendChild(script);
                            return
                        }
                        console.log('TC have been loaded')
                        resolve()
                    })
                }
                loadTCaptchaNow().then(()=>{
                    var captcha1 = new TencentCaptcha(verify_token, function (res) {
                        if (res.ret != 0) {
                            btn.removeClass("disabled");
                            return;
                        }
                        $.extend(serialize, res);
                        done();
                    });
                    captcha1.show(); // 显示验证码
                })
                return false
            }
        }
        if (_verification_type == 3) {
            verify_token = appid_fun(form.find('[name=email]').val()) + '';
            if (verify_token) {
                is_verify = true;
                CustomizedCaptcha.show().then(res=>{
                    $.extend(serialize, res);
                    done();
                }).catch(err=>{
                    btn.removeClass("disabled");
                })
            }
        }
    }
    if (is_verify == false) {
        done();
    }
    return false;
}
function chat_prompt_box_fun(objs) {
    var obj = {
        text: "Successful operation"
    }
    obj = $.extend(true, obj, objs);
    var box = $('<div class="chat_prompt_box_s">' + obj.text + '</div>');
    if (obj.color) {
        box.css("color", obj.color);
    }
    if (obj.bg_color) {
        box.css("background", obj.bg_color);
    }
    if (obj.type) {
        box.addClass(obj.type)
    }
    $('body').append(box);
    setTimeout(function () {
        box.remove();
    }, 5000);
}

// 分享
function share_fun_box2(){
    var obj = {
        title:encodeURIComponent(document.title),
        url: encodeURIComponent(window.location.href),
        url_con: encodeURIComponent(window.location.pathname),
        src_name: '/images/share_to/',
        logo: (function(){
            var img = $('.logo img'),
                src = '';
            if (img.length) {
                src = $('.logo img')[0].src;
            }
            return src;
        })()
    }
    var title = obj.title,
        url = obj.url,
        url_con = obj.url_con,
        logo = obj.logo,
        share_obj = {
            weibo:{
                color: '#ff9933',
                url: `http://service.weibo.com/share/share.php?title=${title}&url=${url}&pic=${logo}`
            },
            skype:{
                color: '#00aff0',
                url: `https://web.skype.com/share?url=${url}&text=${title}`
            },
            linkedin:{
                color: '#0077b5',
                url: `https://www.linkedin.com/shareArticle/?title=${title}&url=${url}`
            },
            pinterest:{
                color: '#CB2027',
                url: `https://pinterest.com/pin/create/button/?description=${title}&media=${logo}&url=${url}`
            },
            facebook:{
                color: '#4267B2',
                url: `https://www.facebook.com/sharer.php?t=${title}&u=${url}`
            },
            twitter:{
                color: '#55acee',
                url: `https://twitter.com/intent/tweet?text=${title}&url=${url}`
            },
            whatsapp:{
                color: '#25d366',
                m_url: `whatsapp://send?text=${url}`,
                pc_url: `https://web.whatsapp.com/send?text=${url}`
            },
            email:{
                color: '#7d7d7d',
                url: `mailto:youemail@mail.com?subject=${title}&body=${url}`
            },
            blogger:{
                color: '#ff8000',
                url: `https://www.blogger.com/blog-this.g?n=${title}&t=&u=${url}`
            },
            buffer:{
                color: '#323B43',
                url: `https://buffer.com/add?text=${title}&url=${url}`
            },
            diaspora:{
                color: '#000000',
                url: `https://share.diasporafoundation.org/?title=${title}&url=${url}`
            },
            digg:{
                color: '#262626',
                url: `https://digg.com/submit?url=${url}`
            },
            douban:{
                color: '#2E963D',
                pc_url: `https://www.douban.com/share/service?name=${title}&href=${url}&image=${logo}&updated=&bm=&title=${title}&url=${url}`
            },
            evernote:{
                color: '#5BA525',
                url: `http://www.evernote.com/clip.action?title=${title}&url=${url}`
            },
            flipboard:{
                color: '#e12828',
                url: `https://share.flipboard.com/bookmarklet/popout?ext=sharethis&title=${title}&url=${url}&utm_campaign=widgets&utm_content=${url_con}&utm_source=sharethis&v=2`
            },
            getpocket:{
                color: '#ef4056',
                url: `https://getpocket.com/login?e=2&route=${url}`
            },
            gmail:{
                color: '#D44638',
                pc_url: `https://mail.google.com/mail/?view=cm&to=&su=${title}&body=${url}&bcc=&cc=`
            },
            googlebookmarks:{
                color: '#4285F4',
                url: `https://www.google.com/bookmarks/mark?op=edit&bkmk=${url}&title=${title}&annotation=`
            },
            hackernews:{
                color: '#ff4000',
                url: `https://news.ycombinator.com/submitlink?u=${url}&t=${title}`
            },
            instapaper:{
                color: '#000000',
                url: `http://www.instapaper.com/edit?url=${url}&title=${title}&description=`
            },
            line:{
                color: '#00c300',
                url: `https://lineit.line.me/share/ui?url=${url}&text=${title}`
            },
            livejournal:{
                color: '#00b0ea',
                url: `https://www.livejournal.com/update.bml?event=${url}&subject=${title}`
            },
            mailru:{
                color: '#168de2',
                url: `https://connect.mail.ru/share?share_url=${url}`
            },
            meneame:{
                color: '#ff6400',
                url: `https://meneame.net/submit.php?url=${url}`
            },
            messenger:{
                color: '#448AFF',
                url: `https://www.facebook.com/dialog/send?link=${url}&app_id=&redirect_uri=`
            },
            odnoklassniki:{
                color: '#d7772d',
                url: `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${url}`
            },
            qzone:{
                color: '#F1C40F',
                pc_url: `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${url}`
            },
            reddit:{
                color: '#ff4500',
                pc_url: `https://reddit.com/submit?title=${title}&url=${url}`
            },
            refind:{
                color: '#4286f4',
                url: `https://refind.com/?url=${url}`
            },
            renren:{
                color: '#005baa',
                url: `http://widget.renren.com/dialog/share?resourceUrl=${url}&srcUrl=${url}&title=${title}&description=${title}`
            },
            surfingbird:{
                color: '#6dd3ff',
                url: `https://surfingbird.ru/share?url=${url}&description=${title}&title=${title}`
            },
            telegram:{
                color: '#0088cc',
                url: `https://t.me/share/url?url=${url}&text=${title}&to=`
            },
            tumblr:{
                color: '#32506d',
                url: `https://www.tumblr.com/share?t=${title}&u=${url}&v=3`
            },
            vk:{
                color: '#4c6c91',
                url: `https://vk.com/share.php?url=${url}`
            },
            wechat:{
                color: '#4EC034',
                url: `https://chart.apis.google.com/chart?cht=qr&chs=154x154&chld=Q%7C0&chl=${url}`
            },
            wordpress:{
                color: '#21759b',
                url: `http://wordpress.com/wp-admin/press-this.php?u=${url}&t=${title}&s=${title}&i=`
            },
            xing:{
                color: '#1a7576',
                pc_url: `https://www.xing.com/app/user?op=share&title=${title}&url=${url}`
            },
            yahoomail:{
                color: '#720e9e',
                url: `http://compose.mail.yahoo.com/?to=&subject=${title}&body=${url}`
            },
        },
        arr_all = ['linkedin','facebook','whatsapp','blogger','twitter','instapaper','line','email','wechat','weibo','yahoomail','gmail','reddit','xing','tumblr','telegram','buffer','flipboard','getpocket','googlebookmarks','livejournal','meneame','odnoklassniki','pinterest','refind','skype','vk','wordpress'];
    var modal_show = function(){
        modal = $(`<div class="share_fun_modal">
		    <div class="modal_bgs"></div>
		    <div class="modal_click"><img src="${obj.src_name}colse.png"></div>
		    <ul class="modal_cons">${(function(){
            var li = ''
            for (var i = 0; i < arr_all.length; i++) {
                if (share_obj[arr_all[i]]) {
                    var n_obj = share_obj[arr_all[i]];
                    if (n_obj.url) {
                        li += `<li class="">
                                <div class="text network_bg" data-network="${arr_all[i]}">
                                    <a href="${n_obj.url}" target="_blank" rel="nofollow">
                                        <div class="share_img_box">
                                        <div class="img icon_bgs ${arr_all[i]}"></div>
                                        </div><div class="tit">${arr_all[i]}</div>
                                    </a>
                                </div>
                            </li>`
                    }else{
                        if (n_obj.pc_url) {
                            li += `<li class="share_m_hide">
                                    <div class="text network_bg" data-network="${arr_all[i]}">
                                        <a href="${n_obj.pc_url}" target="_blank" rel="nofollow">
                                            <div class="share_img_box">

                                            <div class="img icon_bgs ${arr_all[i]}"></div>
                                            </div><div class="tit">${arr_all[i]}</div>
                                        </a>
                                    </div>
                                </li>`
                        }
                        if (n_obj.m_url) {
                            li += `<li class="share_pc_hide">
                                    <div class="text network_bg" data-network="${arr_all[i]}">
                                        <a href="${n_obj.m_url}" target="_blank" rel="nofollow">
                                            <div class="share_img_box">

                                            <div class="img icon_bgs ${arr_all[i]}"></div>
                                            </div><div class="tit">${arr_all[i]}</div>
                                        </a>
                                    </div>
                                </li>`
                        }
                    }
                }
            }
            return li;
        })()}
		    </ul>
		</div>`);

        $('body').addClass('share_fun_modal_hidden');
        $('body').append(modal);
        modal.addClass('show_fun')
        modal.find('.modal_bgs,.modal_click').click(function(event) {
            modal.addClass('hide_fun');
            setTimeout(function(){
                modal.remove();
                $('body').removeClass('share_fun_modal_hidden');
            },400);
        });
    }
    window.customFunc = {}
    window.customFunc.modal_show = modal_show

    $('body').on('click','.network_click_li',function(){
        var box = $(this).closest('.share_fun_box')
        box.toggleClass('active_hide');
    })

    $('[data-network="share"]').click(function(){
        modal_show();
    })
}

// 分享主页
function share_home_funs(root){
    var buttoms = $(root).find('.iconfenxiang_boxs');
    var buttoms_m = $(root).find('.iconfenxiang_boxs_m');
    if (buttoms.length==0) {
        return false;
    }

    var obj = {
        arr_all:[],
        src_name:'/images/media_img/'
    };
    var time = new Date().getTime();

    obj.show_ajax = function(fun){
        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            type: 'post',
            url: '/social-media',
            datatype: 'json',
            // data: {},
            success: function (res) {
                if (res.status == 200) {
                    var data = res.data,
                        arr = [],
                        arr_ll = ["facebook","youtube","instagram","vimeo","twitter","linkedin","pinterest"];
                    if(data){
                        for (var i = 0; i < data.length; i++) {
                            var data2 = {
                                name: data[i].social_media,
                                val: data[i].url
                            }
                            arr.push(data2);
                        }
                        // for (var i = 0; i < arr_ll.length; i++) {
                        //     var key = arr_ll[i],
                        //         val = data[key];
                        //     if(val){
                        //         var data2 = {
                        //             name: key,
                        //             val: val
                        //         }
                        //         arr.push(data2);
                        //     }
                        // }
                    }
                    if(arr.length){buttoms.show();buttoms_m.show();}
                    obj.arr_all = arr;
                    fun(arr);
                } else {
                    // prompt_box_fun({
                    //     text: '保存失败',
                    //     type: 'error'
                    // })
                }
            },
            error:function(){}
        });
    }

    obj.iconfenxiang = function(arr){
        buttoms.each(function () {
            var limit = 4;
            var footerLimit = $(this).attr('footer-social-media');
            if (footerLimit) {
                if (footerLimit === 'true') {
                    limit = Infinity;
                } else {
                    limit = +footerLimit;
                }
            }
            var usedArr = arr, kk = false;
            if (arr.length > limit) {
                usedArr = arr.slice(0, limit - 1);
                kk = true;
            }
            var ul = '<ul>' + (function () {
                var li = usedArr.map(function (item) {
                    var iconUrl = [obj.src_name, item.name, '.svg?t=', time].join('');
                    return '<li title="' + item.name + '"><a target="_blank" href="' + item.val + '" rel="nofollow">' +
                        // '<img src="'+srcs+'.png">'+
                        '<div class="icon_bgs" style="background-image:url(' + iconUrl + ')"></div>' +
                        '</a></li>';
                }).join('');
                if (kk) {
                    li += '<li class="iconfenxiang_boxs_click"><a>' +
                        // '<img src="'+(obj.src_name)+'shares.png">'
                        '<div class="icon_bgs shares"></div>'
                        + '</a></li>';
                }
                return li;
            })() + '</ul>';

            $(this).html(ul);
        });

        var ul_m = '<ul>'+(function(arr){
            var li = '';
            for (var i = 0; i < arr.length; i++) {
                const iconUrl = `${obj.src_name}${arr[i].name}.svg?t=${time}`;

                li += '<li title="'+arr[i].name+'"><a target="_blank" href="'+arr[i].val+'" rel="nofollow">'+
                    '<div class="icon_bgs" style="background-image:url('+iconUrl+')"></div>'
                    +'</a></li>';
            }
            return li;
        })(arr)+'</ul>';
        if (buttoms_m.length) {
            buttoms_m.find('.iconfenxiang_wauto').append(ul_m);
        }
    }

    obj.show_ajax(function(arr){
        obj.iconfenxiang(arr);
        buttoms.find('.iconfenxiang_boxs_click').click(function(){
            obj.show();
        })
    });

    obj.show = function(){
        var arr = obj.arr_all,
            modal = $('<div class="iconfenxiang_modal">'+
                '<div class="modal_mask mod_x"></div>'+
                '<div class="modal_box">'+
                '<div class="modal_box_x mod_x iconfont iconguanbi4"></div>'+
                '<ul>'+
                (function(){
                    var li = ''
                    for (var i = 0; i < arr.length; i++) {
                        const iconUrl = `${obj.src_name}${arr[i].name}.svg?t=${time}`;

                        li += '<li>'+
                            '<a href="'+arr[i].val+'" target="_blank">'+
                            '<div class="img">'+
                            // '<img src="'+obj.src_name+arr[i].name+'_x.png">'+
                            '<div class="icon_bgs" style="background-image:url('+iconUrl+')"></div>'+
                            '</div>'+
                            '<div class="text">'+arr[i].name+'</div>'+
                            '</a>'+
                            '</li>';
                    }
                    return li;
                })()+
                '</ul>'+
                '</div>'+
                '</div>');

        $('body').addClass('iconfenxiang_overflow');
        $('body').append(modal);
        modal.addClass('show_fun')
        modal.find('.mod_x').click(function(event) {
            obj.hide(modal);
        });
    }

    obj.hide = function(modal){
        modal.addClass('hide_fun');
        modal.remove();
        $('body').removeClass('iconfenxiang_overflow');
    }
}

// 判断浏览器
function isMobile() {
    if (
        window.navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        )
    ) {
        return true // 移动端
    } else {
        return false // PC端
    }
}

// 点预览3D文件
function preview3d(btn){
    var preview_3d_box = $('#preview_3d_box')
    var modal = ''
    if (preview_3d_box.length) {
        modal = preview_3d_box
        modal.show()
        $('body').addClass('body_video_current_overflow');
    } else {
        let vr_glb = btn.attr('vr_glb')
        let vr_usdz = btn.attr('vr_usdz')
        modal = $(`<div class="video_current_modal" id="preview_3d_box">
            <div class="con" style="display: block;">
                <div class="video_close iconfont iconguanbi"></div>
                <div class="box">
                    <div class="video_con">
                        <model-viewer style="width: 100%;height:100%;" id="preview_3d_model_viewer" camera-controls src="${vr_glb}" ios-src="${vr_usdz}" ar>
                    </div>
                </div>
            </div>
        </div>`);
        $('body').append(modal).addClass('body_video_current_overflow');
    }
    modal.find('.video_close').click(function(){
        modal.hide()
        $('body').removeClass('body_video_current_overflow');
    })
}

$.fn.inputSelectable = function () {
    this.each(function () {
        var overlayOpen = false;
        var input = $(this), that = input.parent();
        var btn = $('<button>').addClass('js-input-selectable-btn').attr('type', 'button').appendTo(that);
        var overlay = $('<div>').addClass('js-input-selectable-overlay js-input-selectable-overlay--hidden').appendTo('body');
        var dropdown = $('<div>').addClass('js-input-selectable-dropdown js-input-selectable-dropdown--hidden').appendTo('body');
        var config = JSON.parse(input.attr('data-input-select') || '{}');
        var multiple = config.type === 'multi_select';
        var value = multiple ? [] : '';

        input.css('paddingRight', 60).on('keydown', function() {
            return false;
        }).on('focus', function() {
            btn.get(0).focus();
        });

        function setValue(val) {
            var lookup = {};
            value = val;
            var valStr = multiple ? value.join(', ') : value;
            input.val(valStr).trigger('input');
            [].concat(value).forEach(function(v) {
                lookup[v] = 1;
            });
            config.options.forEach(function(op, i) {
                optionDivs[i].toggleClass('js-input-selectable-dropdown__option--selected', !!lookup[op]);
            });
            clearBtn.toggleClass('js-input-selectable-clear--hidden', !valStr);
            overlayClearBtn.toggleClass('js-input-selectable-clear--hidden', !valStr);
        }

        function clearValue() {
            setValue(multiple ? [] : '');
        }

        var optionDivs = config.options.map(function (op) {
            return $('<div>').text(op).addClass('js-input-selectable-dropdown__option').on('click', function () {
                if (multiple) {
                    var lookup = {};
                    value.forEach(function (t) {
                        lookup[t] = 1;
                    });
                    if (lookup[op]) {
                        delete lookup[op];
                    } else {
                        lookup[op] = 1;
                    }

                    setValue(Object.keys(lookup));
                } else {
                    setValue(op);
                    closeOverlay();
                }
            }).appendTo(dropdown);
        });

        var clearBtn = $('<button>').attr({
            type: 'button',
            tabindex: -1
        }).addClass('js-input-selectable-clear js-input-selectable-clear--inset js-input-selectable-clear--hidden')
            .on('click', clearValue).append($('<span>').addClass('iconfont iconguanbi')).appendTo(that);

        var overlayClearBtn = clearBtn.clone(true).removeClass('js-input-selectable-clear--inset').appendTo(dropdown);

        $('<span>').addClass('iconfont iconxiala1 js-input-selectable-btn__icon').appendTo(btn);
        input.prop('tabIndex', -1);

        function closeOverlay() {
            overlayOpen = false;
            console.log('closing overlay');
            that.removeClass('js-select-open');
            overlay.addClass('js-input-selectable-overlay--hidden');
            dropdown.addClass('js-input-selectable-dropdown--hidden');
        }

        overlay.on('click', closeOverlay);

        btn.on('click', function () {
            if (overlayOpen) {
                closeOverlay();
            } else {
                overlayOpen = true;
                var off = btn.offset();
                console.log('button clicked');
                that.addClass('js-select-open');
                overlay.removeClass('js-input-selectable-overlay--hidden');

                var clearBtnOff = clearBtn.offset();
                var menuHeight = dropdown[0].offsetHeight;

                var nextCoords = {
                    left: off.left,
                    top: off.top + btn.outerHeight(),
                    minWidth: btn.outerWidth()
                };
                if (menuHeight + nextCoords.top > window.innerHeight + window.pageYOffset) {
                    nextCoords.top = Math.max(pageYOffset, off.top - menuHeight);
                }

                dropdown.removeClass('js-input-selectable-dropdown--hidden').css(nextCoords);

                overlayClearBtn.css({
                    top: clearBtnOff.top - nextCoords.top,
                    left: clearBtnOff.left - nextCoords.left,
                    color: clearBtn.css('color')
                });
            }
            return false;
        });
    });
    return this;
};

$(window).on('resize', function() {
    $('.js-input-selectable-dropdown--hidden').css('top', 0);
});
