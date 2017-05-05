;(function($){
  var Dialog = function(config){
    var self = this;
    // 默认参数配置
    self.config = {
      // 对话框的类型
      type:"loading",
      //对话框的提示信息
      message:null,
      //对话框的宽高
      width:"auto",
      height:"auto",
      //对话框遮罩透明度
      maskOpacity:null,
      //按钮组配置
      buttons:null,
      //弹出框延迟多久关闭
      delay:null,
      //延时关闭的回调函数
      // delayCallback:null,
      //点击遮罩层是否会关闭
      maskClose:null,
      //是否启用动画
      animation:null
    }
    //默认参数扩展
    if(config && $.isPlainObject(config)){
      $.extend(this.config,config);
    }else{//没有config传入，isConfig为true也就是默认的mask（判断isConfig为true还是false）
      this.isConfig = true;
    }
    //console.log(this.config)
    //创建基本的DOM结构
    this.body = $("body");
    //创建遮罩层
    this.mask = $('<div class="g-dialog-container"></div>');
    //创建弹出框
    this.win = $('<div class="dialog-window"></div>');
    //创建弹出框头部
    this.winHeader = $('<div class="dialog-header"></div>');
    //创建弹出框中间内容（提示信息）
    this.windowContent = $('<div class="dialog-content"></div>');
    //创建弹出框底部（弹出框按钮组）
    this.windowFooter = $('<div class="dialog-footer"></div>');

    //渲染DOM
    this.creat();
  }
  //记录弹框层级
  Dialog.zIndex = 10000;
  Dialog.prototype = {
    //动画函数
    animate:function(){
      var self = this;
      this.win.css("-webkit-transform","scale(0,0)");
      window.setTimeout(function(){
        self.win.css("-webkit-transform","scale(1,1)");
      },100)

    },
    creat:function(){
      if(!!$('.g-dialog-container')[0]){
        return false;
      }
      var self = this,
          config = this.config,
          mask = this.mask,
          win = this.win,
          header = this.winHeader,
          content = this.windowContent,
          footer = this.windowFooter,
          body = this.body;
      // 增加弹框的层级
      Dialog.zIndex++;
      this.mask.css("zIndex",Dialog.zIndex);
      //如果没有传递任何参数，就弹出一个等待的图表形式的弹框
      if(this.isConfig){
        win.append(header.addClass("loading"));
        mask.append(win);
        body.append(mask);
        //如果animation为true，则弹出一个带有动画的弹框
        if(config.animation){
          this.animate();
        }
      }else{
        //根据配置参数创建相应的弹框
        header.addClass(config.type);
        win.append(header);
        //如果传递了信息文本
        if(config.message){
          win.append(content.html(config.message));
        }
        //按钮组
        if(config.buttons){
          //--------
          this.createButtons(footer,config.buttons);
          win.append(footer);
        }
        //插入到页面
        mask.append(win);
        body.append(mask);
        //设置对话框的宽高
        if(config.width!="auto"){
          win.width(config.width);
        }
        if(config.height!="auto"){
          win.height(config.height);
        }
        //对话框遮罩透明度
        if(config.maskOpacity){
          mask.css("backgroundColor","rgba(0,0,0,"+config.maskOpacity+")");
        }
        //设置弹出框延迟多久关闭
        if(config.delay && config.delay!=0){
          window.setTimeout(function(){
            // config.delayCallback();
            self.close();
          },config.delay)
        }
        //如果animation为true，则弹出一个带有动画的弹框
        if(config.animation){
          this.animate();
        }
        //指定遮罩层点击是否关闭
        if(config.maskClose){
          mask.click(function(){
            self.close();
          })
        }
      }
    },
    //根据配置参数的buttons创建按钮列表
    createButtons:function(footer,buttons){
      // console.log(buttons);
      var self = this;
      $(buttons).each(function(i){
        //获取按钮的样式皮肤以及文本
        var type = this.type?this.type:"";
        var btnTxt = this.text?this.text:"按钮"+(++i);
        var callback = this.callback?this.callback:null;

        var button = $("<button class='"+type+"'>"+btnTxt+"</button>");
        if(callback){
          //tap事件有点穿问题，因为tap事件比click执行的要快，执行完tap之后，还要执行一个click事件，就有点穿问题了，解决方案是把tap事件换成click事件。
          button.click(function(e){
            // callback();
            // self.close();
            // return false;
            var isClose = callback();
            //阻止事件冒泡
            e.stopPropagation();
            if(isClose != false){
              self.close();
            }
          })
        }else{
          button.click(function(e){
            //阻止事件冒泡
            e.stopPropagation();
            self.close();
          })
        }
        footer.append(button);
      })
    },
    close:function(){
      this.mask.remove();
    }
  }


  window.Dialog = Dialog;
  $.dialog = function(config){
    return new Dialog(config);
  }
})(Zepto);
