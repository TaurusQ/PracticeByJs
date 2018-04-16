class Pager{
    constructor(options){
        let defaultOptions = {
            element: null,
            buttonCount: 10,//buttonCount指的是数字页码按钮的个数
            currentPage: 1,
            totalPage: 1,
            pageQuery: '',
            templates: {
                number: '<span>%page%</span>',
                prev:'<button class="prev">上一页</button>',
                next:'<button class="next">下一页</button>',
                first:'<button class="first">首页</button>',
                last:'<button class="last">末页</button>',
            },
        }
        //将传入的options和defaultOptions进行合并，以options为主
        this.options = Object.assign({},defaultOptions,options);
        this.domRefs = {};
        //parseInt的第二个参数表示按照多少进制解析该数
        this.currentPage = parseInt(this.options.currentPage, 10);
        this.checkOptions().initHtml().bindEvents();
    }

    /**
     * 检查是否绑定元素（即Pager组件的根结点）
     * @returns {Pager}
     */
    checkOptions(){
        if(!this.options.element){
            throw new Error('element is required');
        }
        return this;
    }

    bindEvents(){
        //这里的element.dataset.attribute是html5调用自定义属性的方式
        dom.on(this.options.element,'click','ol[data-role="pageNumbers"]>li',(e, el) => {
            this.goToPage(parseInt(el.dataset.page, 10));
        });

        this.domRefs.first.addEventListener('click',() => {
            this.goToPage(1);
        });

        this.domRefs.last.addEventListener('click',() => {
           this.goToPage(this.options.totalPage);
        });

        this.domRefs.prev.addEventListener('click',() =>{
            this.goToPager(this.currentPage - 1);
        });

        this.domRefs.next.addEventListener('click',() => {
            this.goToPage(this.currentPage + 1);
        });
    }

    /**
     * 页面跳转
     * @param page 页码（从1开始编号）
     */
    goToPage(page){
        //防止页码不存在或者超出页码范围
        if(!page || page > this.options.totalPage || page === this.currentPage){
            return;
        }
        if(this.options.pageQuery){
            bom.queryString.set(this.options.pageQuery,page);
        }
        this.currentPage = page;
        /**
         * 触发根结点上绑定的自定义事件(pageChange)
         * 在IE中触发自定义点击事件是fireEvent，在高级浏览器中是dispatchEvent
         */
        this.options.element.dispatchEvent(new CustomEvent('pageChange',{
            detail:{page}
        }));
        this.rerender();
    }

    /**
     * 重新渲染页面
     */
    rerender(){
        this._checkButtons();
        let newNumbers = this._createNumbers();
        let oldNumbers = this.domRefs.numbers;
        oldNumbers.parentNode.replaceChild(newNumbers,oldNumbers);
        //更新domRefs中的值，方便下次调用rerender方法
        this.domRefs.numbers = newNumbers;
    }

    /**
     * 动态生成html元素并插入
     * @returns {Pager}
     */
    initHtml(){
        //这里的pager是指nav节点
        let pager = (this.domRefs.pager = document.createElement('nav'));
        this.domRefs.first = dom.create(this.options.templates.first);
        this.domRefs.prev = dom.create(this.options.templates.prev);
        this.domRefs.next = dom.create(this.options.templates.next);
        this.domRefs.last = dom.create(this.options.templates.last);
        this._checkButtons();
        this.domRefs.numbers = this._createNumbers();
        pager.appendChild(this.domRefs.first);
        pager.appendChild(this.domRefs.prev);
        pager.appendChild(this.domRefs.numbers);
        pager.appendChild(this.domRefs.next);
        pager.appendChild(this.domRefs.last);
        this.options.element.appendChild(pager);
        return this;
    }

    /**
     * 检查设置首页和末页按钮是否可点击
     * @private
     */
    _checkButtons(){
        if(this.currentPage === 1){
            this.domRefs.first.setAttribute('disabled','');
            this.domRefs.prev.setAttribute('disabled','');
        }else {
            this.domRefs.first.removeAttribute('disabled');
            this.domRefs.prev.removeAttribute('disabled');
        }

        if(this.currentPage === this.options.totalPage){
            this.domRefs.next.setAttribute('disabled','');
            this.domRefs.last.setAttribute('disabled','');
        }else {
            this.domRefs.next.removeAttribute('disabled');
            this.domRefs.last.removeAttribute('disabled');
        }
    }

    /**
     * 创建页码的dom元素，ol>li>span
     * @returns {*|Node} 返回ol根结点
     * @private
     */
    _createNumbers(){
        let currentPage = this.currentPage;
        //对象的解构赋值
        let {buttonCount,totalPage } = this.options;
        //避免出现起始值小于1的情况
        let start1 = Math.max(currentPage - Math.round(buttonCount/2),1);
        //避免出现末页大于页面总数的情况
        let end1 = Math.min(start1 + buttonCount -1,totalPage);
        let end2 = Math.min(currentPage + Math.round(buttonCount/2)-1,totalPage);
        let start2 = Math.max(end2-buttonCount+1,1);
        let start = Math.min(start1,start2);
        let end = Math.max(end1,end2);

        let ol = dom.create('<ol data-role="pageNumbers"></ol>');
        //这个numbers好像没有必要声明
        let numbers = [];
        for(var i = start; i<=end;i++){
            let li = dom.create(`<li data-page="${i}">${this.options.templates.number.replace('%page%',i)}</li>`);
            //如果是当前页面，则加上current类
            if(i === currentPage){
                li.classList.add('current');
            }
            ol.appendChild(li);
        }
        return ol;
    }
}

