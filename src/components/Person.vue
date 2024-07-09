<template>
    <!-- html -->
     <div class="person">
        <h2>姓名：{{name}}</h2>
        <h2>年龄：{{age}}</h2>
        <h2>地址：{{address}}</h2>
        <!-- <h2>电话：{{tel}}</h2> -->
        <button @click="changeName">修改名字</button>
        <button @click="changeAge">修改年龄</button>
        <button @click="showTel">查看联系方式</button>
        <h2>一辆{{car.brand}}车，价值{{car.price}}w：</h2>
        <button @click="changePrice">修改价值</button>
        <button @click="submitPostRequest">Send POST Request</button>
     </div>
</template>


<script lang="ts" setup name="Person">
    import {ref, reactive} from 'vue';
    import axios from 'axios';

    // 数据
    let name = ref("张三")
    let age = ref(18)
    let address = "北京昌平"
    let tel = '13232323323'
    let car = reactive({brand:'奔驰',price:100})

    // 方法
    function changeName(){
        name.value = "zhang-san"
    }

    function changeAge(){
        age.value += 1
    }

    function showTel(){
        alert(tel)
    }
    function changePrice(){
        car.price += 10
    }
    function submitPostRequest(){
        const url = 'https://192.168.31.251:8080/api/users';
        const postData = {
            "name": "John",
            "age": 30};

        try 
        {
            // Axios automatically transforms JSON data for you
            const response = axios.post(url, postData);
            console.log('Response:', response.data);
            // Process response data here
        } 
        catch (error)
        {
            // Handle error
            if (error.response)
            {
                // Server responded with a status code that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            }
            else if (error.request) 
            {
                // The request was made but no response was received
                console.log(error.request);
            }
            else
            {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
        }
    }

</script>

<style scoped>
    /* 样式 */
    .person {
        background-color: skyblue;
        box-shadow: 0 0 10px;
        border-radius: 10px;
        padding: 20px;
    }
    .button {
        margin: 0 5px;
    }
</style>