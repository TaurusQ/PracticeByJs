let bom = {
    queryString:{
        /**
         * 获取url参数的值
         * @param name
         */
        get: function (name) {
            let getAll = searchString => { //这里的searchString是匿名函数的参数名
                //将字符串中的"？"去掉
                let query = searchString.replace(/^\?/,'');
                let queryObject = {};
                //将字符串按照"&"进行分割
                let queryArray = query.split('&').filter(i => i).forEach((string,index) => {
                    let parts = string.split('=');
                    queryObject[parts[0]] = decodeURIComponent(parts[1]);
                });
            return queryObject;
            }
            //如果调用方法时，不传入参数，则直接返回url参数对象
            if(arguments.length === 0){
                return getAll(location.search);
            }
            //如果传入了参数则返回该url参数的值
            else {
                return getAll(location.search)[name];
            }
        },
        /**
         * 设置url参数和值，也可以通过对象的形式进行调用
         * @param name 参数名
         * @param value 参数值
         */
        set: function(name, value) {
            let set = (search, name, value) => {
                let regex = new RegExp(`(${encodeURIComponent(name)})=([^&]*)`, '');
                //判断url中是否包含参数名为name
                if (regex.test(search)) {
                    return search.replace(regex, (match, c1, c2) => `${c1}=${encodeURIComponent(value)}`);
                } else {
                    //如果不包含，则将字符串结尾的&去掉（没有则不去掉），然后加上&name=value
                    return search.replace(/&?$/, `&${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
                }
            };

            //表示可以通过传入对象的方式进行调用
            if (arguments.length === 1 && typeof name === 'object' && name !== null) {
                let search = location.search;
                for (let key in arguments[0]) {
                    search = set(search, key, arguments[0][key]);
                }
                location.search = search;
            } else {
                location.search = set(location.search, name, value);
            }
        },
    }
}
