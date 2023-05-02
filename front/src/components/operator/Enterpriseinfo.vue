<template>
<div class="father">
    <div class="iframe-father" v-if="!isinit">
    </div>
    <iframe src="/chn/sc/about/company" id="iframe" frameborder="0"></iframe>
</div>
</template>
<script>
export default {
  name: "EnterpriseinfoView",
    data() {
        return {
        isinit: false
        };
    },
//   渲染后
    mounted(){
        const that = this;
        var iframe = document.getElementById("iframe");
        iframe.onload = function(){
            // 通过添加全局css实现
            var style = document.createElement("style");
            style.type = "text/css";
            style.innerHTML = ".cookie-policy{display:none!important;}.common-header{display:none!important;}.quick-enter{display:none!important;}.common-footer{display:none!important;}";
            iframe.contentWindow.document.head.appendChild(style);
            that.isinit = true;
        }
    }
};
</script>
<style scoped>
.father{
    position: relative;
    width: 100%;
    height: 80vh;
}
.iframe-father{
    background-color: white;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 80vh;
}
iframe{
    width: 100%;
    height: 80vh;
}
</style>