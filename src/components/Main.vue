<template>
    <div class="main" scrollbar>
        <Photo v-for='(item,k) in images' :key='k' :item='item' :width='width' :height='height' :distance='distance' 
            :direction='direction'></Photo>
    </div>
</template>

<script>
    import Photo from './Photo'
    import Scrollbar from 'smooth-scrollbar'
    let showIndex = 0,
        imgLoadArr = [],
        photoList = [];

    let images = [],
        bodyH = 0;

    //播放范围
    let top = 200,//距离顶部
        bottom = 200;//距离底部

    let distance = 120,//视差大小
        frame = 60;//帧数

    let options = {
        damping:0.024,
        speed:2,
        overscrollEffect:'bounce'
    }

    let scrollbar = null;

    export default{
        data(){
            let width = 560,//所有图片中宽度最小的
                height=760;//所有图片中高度最小的

            let sentence = ["","I'd be a soul","A heart with no beat","驷介陶陶","百花疑吐夜，四照似含春","","","","还予授子之粲","逢此百罹"];
            
            for(let i=1;i<9;i++){
                let img = [];
                for(let j=0;j<frame;j++){
                    img.push(`http://resource.dev.tusoapp.com/livephoto/12/${i}/0${j}.jpg`);
                    imgLoadArr.push(`http://resource.dev.tusoapp.com/livephoto/12/${i}/0${j}.jpg`);
                }
                images.push({
                    img,
                    text:sentence[Math.round(Math.random()*9+1)],
                    showIndex:0
                })
            }
            return {
                images,
                width,
                height,
                distance,
                direction:'down'
            }
        },
        methods:{
            handleScroll(vaule,key){
                images.map((v,k)=>{
                    if(k==key){
                        v.showIndex = vaule>0?(vaule<frame?vaule:frame-1):0
                    }
                })
                this.images = images;
            },
            getDis(height,scrollTop,enterPosition){//获取视差位移距离
                let resentDis = scrollTop - enterPosition;//已经移动的距离
                let dis = parseInt(distance/(bodyH + height - top - bottom)*resentDis);
                return -dis
            },
            getShowIndex(height,scrollTop,enterPosition){//获取livephoto播放帧
                let resentDis = scrollTop - enterPosition;
                return parseInt(frame/(bodyH + height - top - bottom)*resentDis)
            }
        },
        components:{
            Photo,
            Scrollbar
        },
        created(){
            let that = this;
        },
        mounted(){
            let that = this;
            scrollbar = Scrollbar.init(document.body,options);
            bodyH = document.body.clientHeight;
            scrollbar.addListener((status)=>{
                let scrollTop = status.offset.y;
                photoList.map((v,k)=>{
                    if((v.offsetTop - scrollTop)<(bodyH - bottom)&&(v.offsetTop + v.height - scrollTop)>top){
                        if(v.enterPosition<0){
                            v.enterPosition = scrollTop;
                        }
                        let dis = this.getDis(v.height,scrollTop,v.enterPosition),
                            showIndex = this.getShowIndex(v.height,scrollTop,v.enterPosition);
                        dis = dis>0?0:dis;
                        v.dis = dis;
                        v.showIndex = showIndex;
                        v.photoBox.style.transform = `translate3d(0,${dis}px,0)`;
                        that.handleScroll(showIndex,k);
                    }
                })
            })

            let photoDomList = document.getElementsByClassName('photo');
            Array.prototype.map.call(photoDomList,(v,k)=>{
                let hasTextH = images[k].text==""&&!images[k].text?0:46;
                photoList.push({
                    dom:v,
                    offsetTop:v.offsetTop,
                    height:v.clientHeight+8-hasTextH,
                    dis:0,
                    showIndex:0,
                    photoBox:v.getElementsByClassName('photo-box')[0],
                    photoList:v.getElementsByTagName('img'),
                    enterPosition:-1
                })
            })
        }
    }
</script>

<style scoped>
    .main{
        width:100%;
        overflow:hidden;
        background: #000;
        padding:0 12px 12px 12px;
    }
</style>
