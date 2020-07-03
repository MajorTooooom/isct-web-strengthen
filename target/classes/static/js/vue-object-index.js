new Vue({el: '#business-divider-bottom'});
var vueObjectNotificationIndexFirst = new Vue({
    el: '#notification-index-first',
    methods: {
        openNotifiction() {
            this.$notify({
                title: '你发现了一些奇怪的东西',
                message: '尝试探索一下',
                offset: 100,
                duration: 0
            });
        }
    }
});