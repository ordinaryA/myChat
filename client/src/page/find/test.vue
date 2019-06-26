<template>
    <div>
        <span ref="el_1" @click="func('img')">
            <img v-show="img"/>
        </span>
        <span ref="el_2" @click="func('el_2')"></span>
        <span ref="el_3" @click="func('el_3')"></span>
    </div>
</template>

<script>
    export default {
        methods:{
            func(str){
                this[str] = true
                // 。。。。。。。然后执行代码
            }
        }
    }
</script>

<style scoped>

</style>