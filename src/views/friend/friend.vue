
<template>
    <div class="com_layout">
        <mu-appbar class="com_header">
            <mu-list-item-action slot="left"></mu-list-item-action>
            {{title}}
            <mu-button
                icon
                slot="right"
                @click="openAddFn"
                v-if="friendApply.length>0"
            >
                <mu-badge
                    :content="String(friendApply.length)"
                    circle
                    color="secondary"
                    class="demo-icon-badge"
                >
                    <mu-icon value=":iconfont icon-friendadd" />
                </mu-badge>
            </mu-button>
            <mu-button
                icon
                slot="right"
                @click="openAddFn"
                v-else
            >
                <mu-icon value=":iconfont icon-friendadd" />
            </mu-button>
        </mu-appbar>
        <mu-list
            class="border_box1"
            v-if="sendApply.length>0"
        >
            <div class="frd_title">已发送的好友申请</div>
            <div
                v-for="(i,idx) in sendApply"
                :key="idx"
            >
                <mu-list-item
                    avatar
                    button
                    @click="checkInfo(i,'apply')"
                >
                    <mu-list-item-action>
                        <mu-avatar>
                            <img :src="`./static/avatar/${i.avatar}`">
                        </mu-avatar>
                    </mu-list-item-action>
                    <mu-list-item-content>
                        <mu-list-item-sub-title>{{i.nickname}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                    <mu-list-item-action>
                        <mu-list-item-after-text>等待对方同意</mu-list-item-after-text>
                    </mu-list-item-action>
                </mu-list-item>
                <mu-divider inset></mu-divider>
            </div>
        </mu-list>
        <mu-list
            class="border_box1 my_frd_list"
            v-if="friendList.length>0"
        >
            <div class="frd_title">好友列表</div>
            <div
                v-for="(i,idx) in friendList"
                :key="idx"
            >
                <mu-list-item
                    avatar
                    button
                    @click="checkInfo(i,'friends')"
                >
                    <mu-list-item-action>
                        <mu-avatar>
                            <img :src="`./static/avatar/${i.avatar}`">
                        </mu-avatar>
                    </mu-list-item-action>
                    <mu-list-item-content>
                        <mu-list-item-sub-title>{{i.nickname}}</mu-list-item-sub-title>
                    </mu-list-item-content>
                </mu-list-item>
                <mu-divider inset></mu-divider>
            </div>
        </mu-list>
        <div
            v-else
            class="frd_tip"
        >暂无好友，点击右上角可添加好友 φ(゜▽゜*)♪</div>
        <mu-dialog
            width="360"
            transition="slide-bottom"
            fullscreen
            :open.sync="openAddFriend"
        >
            <div class="ava_exsit">
                <mu-button
                    slot="left"
                    icon
                    @click="closeAddFn"
                >
                    <mu-icon value="close"></mu-icon>
                </mu-button>
                <div class="add_t">添加好友</div>
            </div>
            <div class="ad_con">
                <div class="ad_search">
                    <input
                        type="text"
                        placeholder="请输入好友帐号或用户名"
                        class="search_inp"
                        v-model="friendFlag"
                    >
                    <svg
                        class="icon"
                        aria-hidden="true"
                        @click="addFriend"
                    >
                        <use xlink:href="#icon-huabanfuben1"></use>
                    </svg>
                </div>
                <div
                    class="border_box1"
                    v-if="showSearchResult"
                >
                    <mu-list v-if="searchUserList.length>0">
                        <div
                            v-for="(i,idx) in searchUserList"
                            :key="idx"
                        >
                            <mu-list-item
                                avatar
                                button
                                @click="checkInfo(i,'search')"
                            >
                                <mu-list-item-action>
                                    <mu-avatar>
                                        <img :src="`./static/avatar/${i.avatar}`">
                                    </mu-avatar>
                                </mu-list-item-action>
                                <mu-list-item-content>
                                    <mu-list-item-sub-title>{{i.nickname}}</mu-list-item-sub-title>
                                </mu-list-item-content>
                            </mu-list-item>
                            <mu-divider inset></mu-divider>
                        </div>
                    </mu-list>
                    <div
                        v-else
                        class="hasnotUser"
                    >该用户不存在</div>
                </div>
                <div class="frd_apply">
                    <div
                        class="apply_title"
                        v-if="friendApply.length > 0"
                    >好友申请</div>
                    <div
                        class="apply_title"
                        v-else
                        style="border-bottom: 1px solid #d5d5d5;"
                    >暂时没有人加你&nbsp;&nbsp;(；′⌒`)'</div>
                    <div class="apply_list">
                        <mu-expansion-panel
                            :zDepth="0"
                            v-for="(i,idx) in friendApply"
                            :key="idx"
                        >
                            <div
                                slot="header"
                                class="apply_header"
                            >
                                <mu-avatar class="apply_avatar">
                                    <img :src="`./static/avatar/${i.avatar}`">
                                </mu-avatar>
                                <span class="apply_nickname">{{i.nickname}}</span>
                            </div>
                            <div class="app_content">MyChat:{{i.username}}</div>
                            <mu-button
                                slot="action"
                                flat
                                @click="disposeApply('refuse',i.userId)"
                            >拒绝</mu-button>
                            <mu-button
                                slot="action"
                                flat
                                color="primary"
                                @click="disposeApply('accept',i.userId)"
                            >同意</mu-button>
                        </mu-expansion-panel>
                    </div>
                </div>
            </div>
        </mu-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { DISPATCH, COMMIT, GET_SESSION, PUSH } from '../../utils'
import SOCKET from '../../utils/socket';
import _http from '../../http';

export default {
    data() {
        return {
            title: '通讯录',
            openAddFriend: false,
            friendFlag: '',
            showSearchResult: false,
        };
    },
    created() {
        this.init();
    },
    mounted() {
        this.friendSocket();
    },
    methods: {
        /**
         * 初始化页面
         * @param {Null}
         * @return {Null}
         */
        async init() {
            const { bool, msg } = await DISPATCH('GETFRIENDLIST')
            if (!bool) {
                this.$toast.error(msg);
            }
        },

        /**
         * 监听好友的添加
         * @param {Null}
         * @return {Null}
         */
        friendSocket() {
            SOCKET.on('makeFriend', async () => {
                await DISPATCH('GETFRIENDLIST')
            });
        },

        /**
         * 打开添加好友弹框
         * @param {Null}
         * @return {Null}
         */
        openAddFn() {
            this.openAddFriend = true;
        },

        /**
         * 关闭添加好友弹框
         * @param {Null}
         * @return {Null}
         */
        closeAddFn() {
            this.openAddFriend = false;
            this.showSearchResult = false;
            COMMIT('setSearchUserList', []);
        },

        /**
         * 添加好友
         * @param {Null}
         * @return {Null}
         */
        async addFriend() {
            if (this.friendFlag === '') {
                this.$toast.error('用户名不能为空')
                this.friendFlag = '';
                return
            }
            const { data } = await _http.searchUser({ str: this.friendFlag })
            const { code, msg, userList } = data;
            if (code === 1) {
                COMMIT('setSearchUserList', userList)
            } else {
                this.$toast.error(msg);
                return
            }
            this.friendFlag = '';
            this.showSearchResult = true;
        },

        /**
         * 添加好友
         * @param {String,Number}
         * @return {Null}
         */
        async disposeApply(type, applyId) {
            const { data } = await _http.disposeApply({ type, selfId: GET_SESSION('USERID'), applyId });
            const { code, msg } = data;
            if (code === 1) {
                this.$toast.success(msg);
            } else {
                this.$toast.error(msg);
            }
            SOCKET.emit('makeFriend');
        },

        /**
         * 添加好友
         * @param {Object,String}
         * @return {Null}
         */
        checkInfo(userInfo, type) {
            PUSH({ name: 'friendInfo', params: { type, userInfo } })
        },
    },
    computed: {
        ...mapState(['searchUserList', 'friendList', 'friendApply', 'sendApply'])
    }
};
</script>

<style scoped>
.frd_tip {
    color: #666;
    font-size: 13px;
    text-align: center;
    padding: 50px 0;
}
.test {
    font-size: 16px;
    padding: 80px;
    color: #333;
}
.ava_exsit {
    width: 100vw;
    height: 50px;
    border-bottom: 1px solid #d5d5d5;
}
.layout {
    width: 100vw;
    height: 100vh;
    background: #ededed;
}
.ad_con {
    padding: 10px 0 50px 0;
    height: 100vh;
    background: #ededed;
    overflow-y: auto;
}
.add_t {
    width: 58%;
    height: 50px;
    line-height: 50px;
    float: right;
}
.icon {
    font-size: 25px;
}
.demo-icon-badge {
    padding: 0px;
    margin-top: 5px;
}
.ad_search {
    padding: 7px 15px;
    background: #fff;
    border-top: 1px solid #d5d5d5;
    border-bottom: 1px solid #d5d5d5;
}
.search_inp {
    width: 83vw;
    padding: 0 10px 0 40px;
    color: #666;
    font-size: 12px;
    text-align: center;
}
.border_box1 {
    border-top: 1px solid #d5d5d5;
    border-bottom: 1px solid #d5d5d5;
    margin-top: 10px;
    background: #fff;
    padding: 20px 0;
}
.hasnotUser {
    font-size: 12px;
    color: #666;
    text-align: center;
}
.frd_apply {
    width: 100vw;
    border-top: 1px solid #d5d5d5;
    margin: 10px 0;
    background: #fff;
}
.apply_title {
    font-size: 13px;
    color: #666;
    padding: 20px;
}
.apply_list {
    background: #ededed;
}
.apply_header {
    padding: 10px 0;
}
.apply_nickname {
    font-size: 13px;
    color: #666;
    padding-left: 13px;
}
.apply_avatar {
    vertical-align: middle;
}
.app_content {
    color: #666;
}
.frd_title {
    padding: 10px 0px 5px 20px;
    color: #666;
    font-size: 13px;
}
.frList {
    margin-top: 10px;
}
.my_frd_list {
    min-height: 100vh;
}
</style>