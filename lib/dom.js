//操作dom的工具方法
let dom = {
    /**
	 * 使用方法：
	 * dom.on(button,'click','#button',function(){
	    	alert("this is the button");
		})
     * @param element 标签元素
     * @param eventType 事件类型
     * @param selector 选择器
     * @param fn 执行函数
     * @returns {*}
     */
	on: function(element,eventType,selector,fn){
		element.addEventListener(eventType, e=>{
			let el = e.target;
			while(!el.matches(selector)){
				if(element === el){
                    el = null;
                    break;
				}
                el = el.parentNode;

            }
            el && fn.call(el, e, el);
        });
        return element;
    },

    /**
     * 将html代码（字符串）转换为dom对象（为了后续的 dom元素.appendChild）
     * @param html
     * @param children
     * @returns {Node|*}
     */
    create:function (html,children) {
        var template = document.createElement('template');
        template.innerHTML = html.trim();
        let node = template.content.firstChild;
        if(children){
            dom.append(node, children);
        }
        return node;
    },
    /**
     * 将子元素插入到父元素中
     * @param parent 父元素（dom节点）
     * @param children 子元素（dom节点）
     * @returns {*}
     */
    append: function(parent, children){
	    if(children.length === undefined){
	        children = [children];
        }
        for (let i = 0; i < children.length; i++){
	        parent.appendChild(children[i]);
        }
        return parent;
    }
}
