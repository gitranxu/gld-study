<template>
    <div class="study-vuex">
        <h1>
            vuex功能演示
        </h1>
        <div>
            基础项目中userState的userId值:{{ userState.userInfo.user.id }}
        </div>
        <div>
            portal项目中siteState的mode值:{{ portalSiteState.portalMode }}
        </div>
        <div>
            portal项目中siteState的currentSite的站点名称值:{{ portalSiteState.portalCurrentSite.siteName }}
        </div>
        <div>
            本项目中studyDemo1State的mode值:{{ studyDemo1State.studyMode }}
        </div>
        <el-button @click="test">
            通过mapMutations使用时,方法也要加上前缀哦
        </el-button>
        <el-button @click="()=>{this.$router.push('/study-demo-start')}">
            回到项目规范页
        </el-button>
    </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
    computed: {
        ...mapState(["userState", "portalSiteState", "studyDemo1State"]),
    },
    methods: {
        ...mapMutations(["studyUpdateModeState"]),
        test() {
            this.studyUpdateModeState("haha......");
        },
    },
};
</script>
<style lang="less" scoped>
.study-vuex{
padding: 20px;
background: #f0f0f0;
}
</style>