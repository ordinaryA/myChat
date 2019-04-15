
<template>
    <div class="com_layout mine_page">
        <mu-list class="avaBox space">
            <mu-list-item>
                <mu-list-item-action>
                    <mu-avatar
                        size='55'
                        class="ava"
                        @click="openAvatar"
                        style="border:1px solid #aaa"
                    >
                        <img :src="`./static/avatar/${userInfo.avatar}`">
                    </mu-avatar>
                </mu-list-item-action>
                <mu-list-item-content>
                    <mu-list-item-title
                        class="title"
                        @click="editNickname(userInfo.nickname)"
                    >{{userInfo.nickname}}</mu-list-item-title>
                    <mu-list-item-sub-title>Chat : {{userInfo.username}}</mu-list-item-sub-title>
                </mu-list-item-content>
                <mu-list-item-action>
                    <mu-list-item-after-text>15 min</mu-list-item-after-text>
                    <mu-list-item-after-text></mu-list-item-after-text>
                </mu-list-item-action>
            </mu-list-item>
        </mu-list>
        <mu-list
            class="avaBox"
            v-for="(i,idx) in generalList"
            :key="idx"
        >

            <mu-list-item
                button
                v-for="(item,n) in i"
                :key="n"
                :to="item.to"
            >
                <svg
                    class="icon"
                    aria-hidden="true"
                    v-if="item.icon"
                >
                    <use :xlink:href="item.icon"></use>
                </svg>
                <mu-list-item-content
                    class="selectTag"
                    :class="item.center ? 'text_center' : null"
                >{{item.tag}}</mu-list-item-content>
                <mu-list-item-action v-if="item.icon">
                    <mu-icon value=':iconfont icon-right'></mu-icon>
                </mu-list-item-action>
            </mu-list-item>
        </mu-list>
        <mu-dialog
            width="360"
            transition="slide-bottom"
            fullscreen
            :open.sync="openChangeAvatar"
        >
            <div class="ava_exsit">
                <mu-button
                    slot="left"
                    icon
                    @click="closeAvatar"
                >
                    <mu-icon value="close"></mu-icon>
                </mu-button>
            </div>
            <div class="ava_con">
                <div class="ava_first cl">
                    <div class="ava_title1">系统头像</div>
                    <div
                        class="ava_one"
                        v-for="(item,i) in avatarList"
                        :key="i"
                    >
                        <mu-avatar
                            size='50'
                            class="ava"
                            @click="selectAvatar(i)"
                        >
                            <img :src="item">
                        </mu-avatar>
                    </div>
                </div>
                <div class="ava_first cl">
                    <div class="ava_title1">上传头像</div>
                    <div class="wait">
                        开发中... ♪(＾∀＾●)ﾉ
                    </div>
                </div>
            </div>
        </mu-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { COMMIT, DISPATCH } from '../../utils'
import _http from '../../http';
import SOCKET from '../../utils/socket.js'

export default {
    data() {
        return {
            generalList: [
                [
                    {
                        tag: '个人',
                        icon: '#icon-huabanfuben13',
                        to: { name: 'setPage' },
                    },
                ],
                [
                    {
                        tag: '阅读',
                        icon: '#icon-huabanfuben7'
                    },
                    {
                        tag: '扫一扫',
                        icon: '#icon-huabanfuben10'
                    },
                    {
                        tag: '运动',
                        icon: '#icon-huabanfuben4'
                    },
                    {
                        tag: '搜索',
                        icon: '#icon-huabanfuben1'
                    },
                ],
                [
                    {
                        tag: '设置',
                        icon: '#icon-huabanfuben14',
                        to: { name: 'setPage' },
                    }
                ],
            ], //常用功能配置
            openChangeAvatar: false,
            avatarList: [
                './static/avatar/ava_1.jpg',
                './static/avatar/ava_2.jpg',
                './static/avatar/ava_3.jpg',
                './static/avatar/ava_4.jpg',
                './static/avatar/ava_5.jpg',
                './static/avatar/ava_6.jpg',
                './static/avatar/ava_7.jpg',
                './static/avatar/ava_8.jpg',
                './static/avatar/ava_9.jpg',
                './static/avatar/ava_10.jpg',
                './static/avatar/ava_11.jpg',
                './static/avatar/ava_12.jpg',
                './static/avatar/ava_13.jpg',
                './static/avatar/ava_14.jpg',
                './static/avatar/ava_15.jpg',
                './static/avatar/ava_16.jpg',
                './static/avatar/ava_17.jpg',
                './static/avatar/ava_18.jpg',
                './static/avatar/ava_19.jpg',
                './static/avatar/ava_20.jpg',
            ]
        };
    },
    created() {
        this.init();
    },
    mounted() {
        this.buildSocket();
    },
    updated() {

    },
    methods: {
        /**
         * 初始化获取数据
         * @param {Null}
         * @return {Null}
         */
        async init() {
            COMMIT('setBottom', true);
            if (Object.keys(this.userInfo).length === 0) {
                const { data } = await _http.getUserInfo();
                COMMIT('setUserInfo', data.userInfo);
            }
        },

        /**
         * 监听用户信息的修改
         * @param {Null}
         * @return {Null}
         */
        buildSocket() {
            SOCKET.on('setUserInfo', async bool => {
                if (!bool) {
                    return
                }
                const { data } = await _http.getUserInfo();
                COMMIT('setUserInfo', data.userInfo);
            });
        },

        /**
         * 显示修改头像
         * @param {Null}
         * @return {Null}
         */
        openAvatar() {
            this.openChangeAvatar = true;
        },

        /**
         * 隐藏修改头像
         * @param {Null}
         * @return {Null}
         */
        closeAvatar() {
            this.openChangeAvatar = false;
        },

        /**
         * 选择头像并修改
         * @param {Number}
         * @return {Null}
         */
        async selectAvatar(i) {
            this.$confirm('确定选择这个头像吗？', 'Tip').then(async ({ result }) => {
                if (result) {
                    const avatar = 'ava_' + (i + 1) + '.jpg';
                    const { data } = await _http.changeAvatar({ avatar });
                    const { code, msg } = data;
                    if (code === 1) {
                        SOCKET.emit('setUserInfo', true);
                        this.$toast.success(msg);
                        this.closeAvatar();
                    } else {
                        this.$toast.error(msg);
                    }
                } else {
                    this.$toast.message('取消修改.');
                }
            });

        },

        /**
         * 修改昵称
         * @param {String}
         * @return {Null}
         */
        editNickname(name) {
            this.$prompt('改昵称o(*￣▽￣*)ブ', '修改昵称', {
                validator(value) {
                    return {
                        valid: /^.{2,10}$/.test(value),
                        message: '请输入长度为2到10之间的昵称'
                    }
                }
            }).then(async ({ result, value }) => {
                if (!result) {
                    return
                }
                value.replace(/(^\s*)|(\s*$)/g, "");//去除首尾空格              
                const { data } = await _http.changeNickname({ nickname: value });
                const { code, msg } = data;
                if (code === 1) {
                    SOCKET.emit('setUserInfo', true);
                    this.$toast.success(msg)
                } else {
                    this.$toast.error(msg)
                }
            })

        },
    },
    computed: {
        ...mapState(['userInfo'])
    }
};
</script>

<style scoped>
.cl::after {
    content: "";
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
}
.cl {
    zoom: 1;
}
.mine_page {
    padding-top: 0;
    margin-top: -1px;
}
.mine_bar {
    text-align: center;
}

.avaBox {
    padding: 0;
    background: #fff;
    border-bottom: 1px solid #d5d5d5;
    border-top: 1px solid #d5d5d5;
    margin-bottom: 8px;
}
.space {
    padding: 50px 5px 30px 5px;
}
.ava {
    margin-right: 15px;
}
.title {
    font-size: 17px;
    font-weight: bold;
    letter-spacing: 1.5px;
    color: #333;
}
.selectTag {
    padding-left: 10px;
}
.avaBox .icon {
    font-size: 25px;
}
.generalItem {
    border-bottom: 1px solid #eee;
}
.generalItem:nth-last-child(1) {
    border-bottom: none;
}
.text_center {
    text-align: center;
}
.ava_exsit {
    width: 100vw;
    height: 50px;
    border-bottom: 1px solid #d5d5d5;
}
.ava_con {
    padding: 10px 0;
    background: #ededed;
    height: 100vh;
}
.ava_first {
    background: #fff;
    padding: 0 20px 40px 20px;
    border-top: 1px solid #d5d5d5;
    border-bottom: 1px solid #d5d5d5;
    margin-bottom: 10px;
}
.ava_one {
    float: left;
    margin: 5px 0;
}
.ava_title1 {
    font-size: 13px;
    color: #666;
    padding: 20px 0;
}
.wait {
    font-size: 14px;
    color: #666;
    padding-left: 20px;
}
</style>