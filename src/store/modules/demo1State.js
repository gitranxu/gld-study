export default {
    state: {
        currentSite: {}, // 当前选中的站点
        mode: "demo1Statemode", // noedit,personalEdit,portalEdit三种状态
    },
    mutations: {
        updateCurrentSiteState(state, payload) {
            // state.studyCurrentSite = Object.assign({}, state.studyCurrentSite, payload);
            state.studyCurrentSite = { ...state.studyCurrentSite, payload };
        },
        updateModeState(state, payload) {
            state.studyMode = payload;
        },
    },
    actions: {
        // savePageLayout(context, opt = {}) {

        // },
        // getPageLayout(context) {

        // },
    },
    getters: {
        // leftMenu(state) {
        // let result = [];
        // if(state.menu.length && state.headerMenuIndex) {
        //     result = state.menu.find(menu => {
        //         return menu.menuId == state.headerMenuIndex;
        //     });
        // }else {
        //     result = [];
        // }
        // return result;
        // },
    },
};