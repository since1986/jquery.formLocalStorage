/*!
 * jQuery Form Local Storage Plugin v0.1
 * https://github.com/since1986/jquery.formLocalStorage
 * 
 * Copyright since1986
 * Released under the MIT license
 */
 (function($) {
    $.fn.formLocalStorage = function(options) {
    	
    	var form_selector = this.selector;
    	var input_selector = form_selector + " :text, "
    							+ form_selector + " :checkbox, " 
    							+ form_selector + " :radio, " 
    							+ form_selector + " select, " 
    							+ form_selector + " textarea, " 
    							+ form_selector + " [type='date'] " 
    							+ form_selector + " [type='month'] " 
    							+ form_selector + " [type='week'] " 
    							+ form_selector + " [type='time'] " 
    							+ form_selector + " [type='datetime'] " 
    							+ form_selector + " [type='datetime-local'] " 
    							+ form_selector + " [type='url'] "
    							+ form_selector + " [type='number'] "
    							+ form_selector + " [type='range'] "
    							+ form_selector + " [type='search'] "
    							+ form_selector + " [type='color'] "
    							+ form_selector + " [type='email']";
    	
    	
    	if(options.debug){ console.debug(this); }
    	
    	//插件选项
    	var options = $.extend({
    		storage_name_perfix : ( this.context.URL + form_selector + "@" ), //暂存的命名前缀
    		storage_events : ['change'], //触发暂存的事件
    		storage_dom_class : "_jquery_form_local_storage", //暂存内容的class(用于区分原始内容与暂存内容)
    		storage_manual_remove_trigger_selector : "#storage_manual_remove_trigger", //手动清除暂存的触发器
    		storage_remove_on_submit : true, //是否在表单提交时清空暂存
    		storage_automatic_remove_flag_selector : "input[name='storage_automatic_remove_flag']", //用于触发暂存自动清空的flag（storage_remove_on_submit = false 的情况下才生效）
    		storage_automatic_remove_flag_value : 1, //用于触发暂存自动清空的flag的value（storage_remove_on_submit = false 的情况下才生效）
    		load_ready_callback : function(){}, //暂存内容加载完毕回调
    		save_ready_callback : function(){}, //暂存内容保存完毕回调
    		remove_ready_callback : function(){}, //暂存内容删除完毕回调
    		debug : false, //调试模式
        },
        options || {});
    	
    	if(options.debug){
    		$.each(options, function(k, v){
    			console.debug(k + ": " + v);
    		});
    	}
    	
    	this.ready(function(){
    		storage_load(); //表单加载完毕后从localStorage中载入暂存的表单内容
    		storage_save(); //监控表单内容变化并存入localStorage FIXME 动态写入的内容监控不到
    	});
    	
    	this.ready(function(){
    		if( !options.storage_remove_on_submit && options.storage_automatic_remove_flag_selector != undefined ){ //如果指定了用于触发暂存自动清空的flag
    			if( $(options.storage_automatic_remove_flag_selector).val() == options.storage_automatic_remove_flag_value ){ //若flag值满足条件则清空此表单所有暂存内容
    				storage_remove();
    			}
    		}
    	});
    	
    	//表单提交时的行为
    	this.submit(function(){
    		if(options.storage_remove_on_submit){ //若使用默认设置的storage_remove_on_submit，则表单提交时自动清空此表单所有暂存内容
    			storage_remove();
    		}
    	});
    	
    	//手动清空此表单的暂存内容
    	if(options.storage_manual_remove_trigger_selector != undefined && options.storage_manual_remove_trigger_selector != null){
    		$(options.storage_manual_remove_trigger_selector).click(function(){
    			storage_remove();
    			location.reload(); //刷新页面
    		});
    	}
    	
    	function storage_load(){
    		
    		var storage_count = 0;
    		$(input_selector).each(function(){
    			var storage_key = options.storage_name_perfix + this.name;
    			var storage_value = localStorage.getItem(storage_key);
    			if(storage_value != undefined && storage_value != null){
    				$(this).val(storage_value);
    				$(this).addClass(options.storage_dom_class); //为暂存内容加载样式
    				if(options.debug){ console.debug("Load from localStorage [" + storage_key + " : " + storage_value + "]"); };
    				storage_count++;
    			}
    		});
    		if(storage_count > 0) { options.load_ready_callback(); }
    	}
    	
    	function storage_save(){
			
    		var _events = options.storage_events.join(" ");
    		$(input_selector).live(_events, function(){
    			if(this.value != undefined && this.value != null){
    				var storage_key = options.storage_name_perfix + this.name;
    				var storage_value = this.value;
    				localStorage.setItem(storage_key, storage_value);
    				$(this).addClass(options.storage_dom_class);
    				if(options.debug){ console.debug("Save to localStorage [" + storage_key + " : " + storage_value + "]"); };
    			}
    			options.save_ready_callback();
    		});
    	}
    	
    	function storage_remove(){
    		$(input_selector).each(function(){
    			var storage_key = options.storage_name_perfix + this.name;
    			localStorage.removeItem(storage_key);
    			$(this).removeClass(options.storage_dom_class); //去掉暂存的样式
    			if(options.debug){ console.debug("Remove from localStorage [" + storage_key + "]"); };
    		});
    		options.remove_ready_callback();
    	}
    	
    	return this;
    };
})(jQuery);
