<template>
    <div>
        <transition :name="transitionName">
            <router-view class="child-view"></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    data() {
        return {
            transitionName: 'slide-left',
        };
    },
    methods: {

    },
    beforeRouteUpdate(to, from, next) {
        let isBack = this.$router.isBack
        if (isBack) {
            this.transitionName = 'slide-right'
        } else {
            this.transitionName = 'slide-left'
        }
        this.$router.isBack = false
        next()
    },
};
</script>

<style scoped>
.child-view {
    position: absolute;
    height: 100%;
    width: 100%;
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.slide-left-enter {
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
}
.slide-left-leave-active {
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
}
.slide-right-enter {
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
}
.slide-right-leave-active {
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
}
</style>