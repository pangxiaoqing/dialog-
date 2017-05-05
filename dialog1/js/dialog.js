function Dialog(opt){
    var self = this;
    var laodDefault = {
        contentPadding:"content_load",
        tapMaskClose:"true",
        span_content:"",
        boxInfoPadding:"",
        boxBgImg:"box_bgimg_loading"
    }
    var infoDefault = {
        contentPadding:"content_info",
        boxInfoPadding:"box_info_padding",
        boxBgImg:"box_bgimg_info",
        span_content:"3s后消失哦",
        //isDelayClose:true,
        times:"1500"
    }
    var confirmDefault = {
        boxBgImg:"box_bgimg_right",
        span_content:"提示成功啦提示",
        tapMaskClose : true,
        leftButtonTxt :"确定确定",
        contentPadding:"",
        boxInfoPadding:"",
        rightButtonTxt :"取消"

    }
  //  self.obj = Object.assign({},begin,opt);//console.log(this.obj)
    switch(opt.type){
        case "load" :
        self.obj = Object.assign({},laodDefault,opt);
        break;
        case "info" :  
        self.obj = Object.assign({},infoDefault,opt);
        break;
        case "confirm" :
        self.obj = Object.assign({},confirmDefault,opt);
        break;
        default:self.obj=opt;
        break;
    }
    
    this.handlers = {};
    this.init();   
}
Dialog.prototype = {
    init:function(){
        this.render();
        this.bindEvent();
    },
    on: function(type, handler){
        if (typeof this.handlers[type] == 'undefined') {
            this.handlers[type] = []
        }
        this.handlers[type].push(handler)
    },
    trigger: function(type, data){
        if(this.handlers[type] instanceof Array){
            var handlers = this.handlers[type]
            for(var i = 0; i<handlers.length ; i++){
                handlers[i](data)
            }
        }
    },
    render:function(){
        var self = this;
        var body_box = $("<div class='body_box show'></div>");
        var mask = $("<div class='mask'></div>");
        var content = $("<div class='content "+this.obj.contentPadding+"'></div>"); 
        var box = $("<div class='box "+this.obj.boxBgImg+" "+this.obj.boxInfoPadding+"'></div>");
        //var img = $("<img class='mask_img' src='"+this.obj.iconSrc+"' alt=''>");
        var span = $("<span class='spantxt'>"+this.obj.span_content+"</span>");
        var button_box = $("<div class='button_box'></div>");
        var button = $("<button class='true_btn'>"+this.obj.leftButtonTxt+"</button><button class='false_btn'>"+this.obj.rightButtonTxt+"</button>");


        content.append(box);
        if(this.obj.type != "load"){
            //content.append(box);
            content.append(span);
        }
        if(this.obj.type == "confirm"){
            //content.append(button);
            button_box.append(button);
            button_box.appendTo(content);
        }
        content.appendTo(body_box);
        mask.appendTo(body_box);
        $("body").append(body_box);
        
        //定时器--如果isDelayClose为true，则3s消失。
        if (this.obj.isDelayClose) {
            setTimeout(function(){
                self.close()
            },this.obj.times)
        }
    },
    bindEvent:function(){
        var self = this;
        if(this.obj.tapMaskClose) {
            $(".mask").tap(function(){
                self.close();
            })
        }
        $(".true_btn").bind("tap",function(){
            self.trigger("confirm");
        })
        $(".false_btn").bind("tap",function(){
            self.trigger("cancel");
        })

    },
    close:function(){
        $(".body_box").remove();
    }
}