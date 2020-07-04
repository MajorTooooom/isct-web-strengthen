// 储存全局utils函数,比如操作cookie和localStorage
/**
 * cookie有4K限制，超过的话，就算设置了也不成功，且不提示！
 * 如果想存储json数组等大容量数据需要用到localStorage
 * @param key
 * @param value
 */
function localStorageController(type, key, value) {
    var tempLocalStorage = window.localStorage;
    if (type == 'set') {
        tempLocalStorage.setItem(key, value);
        return 1;
    } else if (type == 'get') {
        return tempLocalStorage.getItem(key);
    } else if (type == 'remove') {
        tempLocalStorage.removeItem(key);
        return 1;
    }
}