<!-- <template>
        <h1>你好啊！</h1> 
        <Person/> 
</template> -->

<!-- <script lan="ts">
    // JS/TS
    import Person from './components/Person.vue'
    export default{
        name:'App',  //组件名\
        components:{Person} // 注册组件
    }
</script>  -->

<!-- <style>
    /* 样式 */
    .app {
        background-color: #ddd;
        box-shadow: 0 0 10px;
        border-radius: 10px;
        padding: 20px;
    }
</style>  -->

<template>
  <div class="app">
    <h1>操作界面:</h1>

    <div class="button-group">
      <button @click="ArmConSrv">连接/断开服务器</button>
      <button @click="ArmConBox">连接电箱</button>
      <button @click="ArmConContrl">连接/断开控制器</button>
      <button @click="ArmPower">机械臂上电/下电</button>
      <button @click="ArmShutDown">机械臂关机</button>
      <button @click="ArmAble">机械臂使能/去使能</button>
      <button @click="ArmReset">机械臂复位</button>
      <button @click="ArmStop">机械臂停止运动</button>
      <button @click="ArmInterrupt">机械臂暂停运动</button>
      <button @click="ArmContinue">机械臂继续运动</button>
      <button @click="ReadCurTCP">读取TCP坐标</button>
      <button @click="ReadCurUCS">读取UCS坐标</button>
      <button @click="ReadActPos">读取当前实际位置</button>
      <button @click="ReadActTcpPos">读取TCP实际位置</button>
      <button @click="ReadActJointPos">读取关节实际位置</button>
      <button @click="ConnectWebSocket">连接WebSocket</button>
      <button @click="DisconnectWebSocket">断开WebSocket</button>
    </div>

    <p>响应数据:</p>
    <p v-if="responseData">{{ responseData }}</p>
    <p v-if="websocketData">{{ websocketData }}</p>
  </div>
</template>

<style scoped>
.app {
  background-color: #edf9fdd5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  max-width: 1800px;
  margin: 0 auto;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  flex: 1 1 calc(20% - 10px);
  padding: 10px;
  font-size: 14px;
  font-style: normal;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #8eb8e5;
  color: rgb(5, 5, 5);
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  background-color: #5587bd;
  transform: scale(1.05);
  color: black;
  font-size: 15px;
}

p {
  font-size: 20px;
  margin-top: 20px;
}
</style>

  
<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 组件名称
const componentName = 'MyComponent';

// response data 的 ref
const responseData = ref('');
const websocketData = ref('');
let ws = null;


// 通用的 POST 请求方法
const postRequest = async (action, additionalData = {}) => {
  try {
    const dataToSend = {
      action,
      ...additionalData
    };

    const response = await axios.post('http://192.168.31.74:8080/api/users', dataToSend);
    responseData.value = response.data;
    console.log(`Data posted successfully to /api/users for action ${action}:`, response.data);
    
  } catch (error) {
    console.error(`Error occurred while posting data to /api/users for action ${action}:`, error);
  }
};

// 各种方法调用通用的 POST 请求方法
const ArmConSrv = () => postRequest('ArmConSrv', { status: '1', ip: '127.0.0.1', port: '8080' });
const ArmConBox = () => postRequest('ArmConBox');
const ArmConContrl = () => postRequest('ArmConContrl', { status: '1' });
const ArmPower = () => postRequest('ArmPower', { status: '1' });
const ArmShutDown = () => postRequest('ArmShutDown');
const ArmAble = () => postRequest('ArmAble', { status: '1' });
const ArmReset = () => postRequest('ArmReset');
const ArmStop = () => postRequest('ArmStop');
const ArmInterrupt = () => postRequest('ArmInterrupt');
const ArmContinue = () => postRequest('ArmContinue');
const ReadCurTCP = () => postRequest('ReadCurTCP');
const ReadCurUCS = () => postRequest('ReadCurUCS');
const ReadActPos = () => postRequest('ReadActPos');
const ReadActTcpPos = () => postRequest('ReadActTcpPos');
const ReadActJointPos = () => postRequest('ReadActJointPos');
const ConnectWebSocket = () => {
  ws = new WebSocket('ws://192.168.31.74:9002');
  // ws = new WebSocket('ws://192.168.31.251:9002');
  ws.onopen = function () {
    console.log('ws onopen');
    ws.send('from ZHY Computer client: hello');
  };
  ws.onmessage = function (e) {
    console.log('ws onmessage');
    // let data = JSON.parse(e.data);
    // console.log('from server json: ' + e.data);
    // websocketData.value = e.data;
    try {
      websocketData.value = JSON.parse(e.data);
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      websocketData.value = e.data; // 如果解析失败，直接赋值原始数据
    }
    console.log('from server: ' + e.data);
  };
  ws.onclose = function(event) {
    if (event.wasClean) {
      alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      // 例如服务器进程被杀死或网络中断
      // 在这种情况下，event.code 通常为 1006
      alert('[close] Connection died');
    }
  };
  ws.onerror = function(error) {
    alert(`[error] ${error.message}`);
  }
};
  

const DisconnectWebSocket = () => {
  if (ws) {
    websocketData.value = '连接已断开';
    ws.close(1000, '关闭连接');
  } else {
    websocketData.value = '尚未连接';
  }
};



// 将需要的变量和方法暴露给模板
// return { ArmConSrv, ArmConBox, ArmConContrl, ArmPower, ArmShutDown, ArmAble, ArmReset, ArmStop, ArmInterrupt, ArmContinue, responseData };

</script>


<!-- <style>
    /* 样式 */
    .app {
        background-color: #ddd;
        box-shadow: 0 0 10px;
        border-radius: 10px;
        padding: 20px;
    }
</style>  -->
