<template>
    <div class="hello">
        <Hello1 :mes='message'></Hello1>
        <input v-model='message'>
    </div>
</template>

<script>
    import Hello1 from './Hello1'
    export default{
        data(){
            return {
                message:'asdaasdasdsd123123sdasd'
            }
        },
        created(){
            //console.log(this.message)
        },
        components:{
            Hello1
        }
    }
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
