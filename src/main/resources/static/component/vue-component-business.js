/**
 *  Vue组件开发：定义全局组件
 * 定义后需要将此js文件引入才能使用，为了方便写html代码而不是拼字符串，
 * 这里的template代码比较多的话会写在html的<script type="text/template">里面，然后通过
 * template: $("#id").html()进行引入
 *
 */
// ****************************************************************************
Vue.component('app-business-transfer', {
    template: $("#template-app-business-transfer").html(),
});
// ****************************************************************************
