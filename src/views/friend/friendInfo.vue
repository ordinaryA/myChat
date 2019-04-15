<template>
    <div>
        <div class="frd_first">
            <div class="frd_exsit">
                <mu-button
                    icon
                    slot="left"
                    @click="goBack"
                >
                    <mu-icon value=":iconfont icon-back" />
                </mu-button>
            </div>
            <div class="ava_b cl">
                <mu-avatar
                    class="ava_this fl"
                    size="60"
                >
                    <img :src="`./static/avatar/${userInfo.avatar}`">
                </mu-avatar>
                <div class="ava_r fl">
                    <div class="ava_nic">{{userInfo.nickname}}</div>
                    <div class="ava_other">MyChat：{{userInfo.username}}</div>
                    <div class="ava_other">注册时间：{{registerTime}}</div>
                    <div class="ava_other">{{beFriendsTime}}</div>
                </div>
            </div>
        </div>
        <mu-button
            flat
            class="border_box frd_o"
        >更多信息</mu-button>
        <mu-button
            v-if="pageType === 'friends'"
            flat
            class="border_box frd_second"
            @click="goToChat"
        >
            <mu-icon
                left
                value=":iconfont icon-message"
                style="margin-right:5px"
            ></mu-icon>
            发消息
        </mu-button>
        <mu-button
            v-if="pageType === 'search'"
            flat
            class="border_box frd_second"
            @click="makeFriend"
        >
            <svg
                class="icon"
                aria-hidden="true"
                style="margin:-5px 5px 0 0"
            >
                <use xlink:href="#icon-huabanfuben4"></use>
            </svg>
            添加到通讯录
        </mu-button>
        <mu-button
            v-if="pageType === 'apply'"
            flat
            class="border_box frd_second"
            @click="()=>this.$toast.message('正在等待对方回应...')"
        >
            <svg
                class="icon"
                aria-hidden="true"
                style="margin:-5px 5px 0 0"
            >
                <use xlink:href="#icon-huabanfuben4"></use>
            </svg>
            等待对方同意
        </mu-button>
    </div>
</template>

<script>
import { COMMIT, DISPATCH, GET_SESSION, PUSH, SET_SESSION } from '../../utils';
import { recentDate, otherDate, completeTime } from '../../utils/date'
import SOCKET from '../../utils/socket';
import _http from '../../http';

export default {
    data() {
        return {
            pageType: '',
            userInfo: {}
        }
    },
    created() {
        this.init();
    },
    methods: {

        /**
         * 初始化页面
         * @param {Null}
         * @return {Null}
         */
        init() {
            COMMIT('setBottom', false);
            const { type, userInfo } = this.$route.params;
            if (type && userInfo) {
                this.pageType = type;
                this.userInfo = userInfo;
            } else {
                PUSH('/')
            }
        },

        /**
        * 发起添加好友
        * @param {Null}
        * @return {Null}
        */
        makeFriend() {
            const friendId = this.userInfo.userId;
            this.$confirm('您要添加他为好友吗', '提示').then(async ({ result }) => {
                if (result) {
                    const applyUser = GET_SESSION('USERID');
                    if (applyUser == friendId) {
                        this.$toast.warning('不能添加自己为好友');
                        return
                    }
                    const { data } = await _http.makeFriend({ applyUser, receiveUser: friendId });
                    const { code, msg } = data;
                    if (code === 1) {
                        this.$toast.success(msg)
                        SOCKET.emit('makeFriend');
                    } else {
                        this.$toast.error(msg);
                    }
                }
            });
        },

        /**
        * 发送消息
        * @param {Null}
        * @return {Null}
        */
        async goToChat() {
            const { userId: anotherId } = this.userInfo;
            const { data } = await _http.createChat({ anotherId });
            if (data.code == 1) {
                if (data.tip == 'has') {
                    const { id: chat_id, user_id } = data.chatInfo[0];
                    // 深拷贝
                    const newObject = JSON.parse(JSON.stringify(this.userInfo))
                    delete newObject.userId
                    newObject.another_id = anotherId;
                    newObject.chat_id = chat_id;
                    SET_SESSION('ANOTHER_USER_INFO', JSON.stringify(newObject))
                } else if (data.tip == 'newCreate') {
                    const { chat_id } = data;
                    // 深拷贝
                    const newObject = JSON.parse(JSON.stringify(this.userInfo))
                    delete newObject.userId
                    newObject.another_id = anotherId;
                    newObject.chat_id = chat_id;
                    SET_SESSION('ANOTHER_USER_INFO', JSON.stringify(newObject))
                }
                PUSH('room2');
            } else {
                this.$toast.error('网络不佳，请刷新后再试');
            }
        },

        /**
         * 返回上一级
         * @param {Null}
         * @return {Null}
         */
        goBack() {
            this.$router.goBack();
            COMMIT('setBottom', true);
        },

    },
    computed: {
        //时间戳处理成用户的注册时间
        registerTime() {
            return recentDate(this.userInfo.registerTime, true)
        },
        //时间戳处理成与用户成为好友的时间
        beFriendsTime() {
            const beTime = this.userInfo.firstDate;
            return beTime ? '你们已成为好友' + otherDate(Number(new Date()) - beTime) : null
        }
    }
}
</script>

<style scoped>
.frd_exsit {
    width: 100vw;
    height: 50px;
}
.frd_first {
    background: #fff;
    border-bottom: 1px solid #d5d5d5;
}
.ava_this {
    border: 1px solid #d5d5d5;
}

.ava_b {
    padding: 0 20px 20px 20px;
}
.ava_r {
    padding-left: 20px;
}
.ava_nic {
    font-size: 16px;
    color: #000;
    font-weight: bold;
    padding-bottom: 5px;
}
.ava_other {
    font-size: 13px;
    color: #666;
    padding: 2px 0;
}
.frd_o,
.frd_second {
    width: 100vw;
    font-size: 13px;
}
.frd_o {
    color: #666;
}
.frd_second {
    color: #5b6a91;
}
</style>