<template>
    <div class="photo" :style="{height:boxH+'px'}">
        <div class='photo-box'>
            <img :src="url" v-for='(url,key) in item.img' :key='key' v-show='key==item.showIndex'/>
        </div>
    </div>
</template>

<script>
    import Hello1 from './Hello1'
    export default{
        data(){
            let boxH = parseInt(46+(document.body.clientWidth-32)*this.height/this.width-this.distance)
            return {
                message:this.item,
                showIndex:0,
                boxH
            }
        },
        methods:{
            play(){
                this.showIndex = this.distance=='up'?this.showIndex-1:this.showIndex+1;
            }
        },
        props:['item','width','height','distance','direction']
    }
</script>

<style scoped>
.photo{
    width: 100%;
    overflow: hidden;
    position: relative;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
    border: 4px solid #fff;
    margin-top: 12px;
}
.photo-box {
    width: 100%;
    overflow: hidden;
    background: #fff;
    position: relative;
    z-index: 1;
}
.photo-box img {
    display: block;
    width: 100%;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    -webkit-backface-visibility: hidden;
    -webkit-perspective: 1000;
}
</style>
