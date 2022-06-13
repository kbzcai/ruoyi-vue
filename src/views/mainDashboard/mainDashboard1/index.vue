<template>
  <div class="app-container" style="background: #2d3a4b">
    <el-row :gutter='12' class="row-margin">
      <el-col :span='6'>
        <el-card shadow='never' class="custom-header">
          <div slot="header">
            <span>生产数据</span>
          </div>
          <div id="chart1" :style="{height:'400px',marginTop:'20px'}"></div>
          <slot name="content"/>
          <div id="chart2" :style="{height:'400px',marginTop:'40px',marginBottom:'27px'}"></div>
        </el-card>
      </el-col>
      <el-col :span='12'>
        <el-card shadow='never' class="custom-header">
          <div slot="header">
            <span>计划数据</span>
          </div>
          <slot name="content"/>
          <div v-for="(item,index) in planArr" class="box">
            <div class="t_line_box">
              <i class="t_l_line"></i>
              <i class="l_t_line"></i>
            </div>
            <div class="t_line_box">
              <i class="t_r_line"></i>
              <i class="r_t_line"></i>
            </div>
            <div class="t_line_box">
              <i class="l_b_line"></i>
              <i class="b_l_line"></i>
            </div>
            <div class="t_line_box">
              <i class="r_b_line"></i>
              <i class="b_r_line"></i>
            </div>
            <div class="data">
              <span class="title">{{ item.name }}</span>
              <span class="result">{{ item.value }}</span>
            </div>
          </div>
          <div id="chart3" :style="{height:'400px',marginTop: '20px'}"></div>
        </el-card>
      </el-col>
      <el-col :span='6'>
        <el-card shadow='never' class="custom-header">
          <div slot="header">
            <span>设备产量</span>
          </div>
          <slot name="content"/>
          <div v-for="(item,index) in viewArr">
            <div class="plcData">
              <span class="plc">工作站{{ index + 1 }}——A工位：{{ item.numA }}
                 <template v-if="item.stateA == '1'">
                   <img :src="require('@/assets/station_pic/green_light.png')" alt="">
                 </template>
                <template v-else-if="item.stateA == '2'">
                  <img :src="require('@/assets/station_pic/yellow_light.gif')" alt="">
                </template>
                <template v-else-if="item.stateA == '3'">
                  <img :src="require('@/assets/station_pic/red_light.gif')" alt="">
                </template>
              </span>
            </div>
            <div class="plcData">
              <span class="plc">工作站{{ index + 1 }}——B工位：{{ item.numB }}
                 <template v-if="item.stateB == '1'">
                   <img :src="require('@/assets/station_pic/green_light.png')" alt="">
                 </template>
                <template v-else-if="item.stateB == '2'">
                  <img :src="require('@/assets/station_pic/yellow_light.gif')" alt="">
                </template>
                <template v-else-if="item.stateB == '3'">
                  <img :src="require('@/assets/station_pic/red_light.gif')" alt="">
                </template>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
var echarts = require('echarts')
import {getNum} from "@/api/mainDashboard/mainDashboard"

export default {
  data() {
    return {
      planArr: [
        {name: '当日工作计划', value: '0'},
        {name: '当周工作计划', value: '0'},
        {name: '当月工作计划', value: '0'},
        {name: '当日完成率', value: '0%'},
        {name: '当周完成率', value: '0%'},
        {name: '当月完成率', value: '0%'}],
      viewArr: [
        {stateA: '', numA: '', stateB: '', numB: ''},
        {stateA: '', numA: '', stateB: '', numB: ''},
        {stateA: '', numA: '', stateB: '', numB: ''},
        {stateA: '', numA: '', stateB: '', numB: ''},
        {stateA: '', numA: '', stateB: '', numB: ''},
        {stateA: '', numA: '', stateB: '', numB: ''}]
    }
  },
  created() {
    this.getPlcData();
  },
  methods: {
    open1() {
      let msg = ""
      for (let i = 0; i < this.viewArr.length; i++) {
        if (this.viewArr[i].stateA == '3') {
          let num = i + 1
          msg += num + "-A "
        }
        if (this.viewArr[i].stateB == '3') {
          let num = i + 1
          msg += num + "-B "
        }
      }
      console.log(msg)
      if (msg != "") {
        this.$notify({
          title: '提示',
          message: msg + '报警',
          type: 'warning'
        });
      }
    },
    getPlcData() {
      let _this = this
      getNum(1, 6).then(response => {
        console.log(response)
        for (let i = 0; i < response.length; i++) {
          if (_this.viewArr[i] != undefined) {
            _this.viewArr[i].numA = response[i].prodNumA
            _this.viewArr[i].numB = response[i].prodNumB
          }
        }
      });
      // this.$axios.get('http://localhost/dev-api/mesPlc/getStates').then(function (response) {
      //   console.log(response.data)
      //   for (let i = 0; i < response.data.length - 9; i++) {
      //     if (_this.viewArr[i] != undefined) {
      //       _this.viewArr[i].stateA = response.data[i].stateA
      //       _this.viewArr[i].stateB = response.data[i].stateB
      //     }
      //   }
      // })
      this.open1()
    },
    initCharts() {
      this.chart1 = echarts.init(document.getElementById('chart1'), 'dark')
      this.chart2 = echarts.init(document.getElementById('chart2'), 'dark')
      this.chart3 = echarts.init(document.getElementById('chart3'), 'dark')
      this.setOptions()
    },
    setOptions() {
      // let _this = this
      // this.$axios.get('http://localhost/dev-api/mesPrimaryProducePlan/query').then(function (response) {
      //   console.log(response.data)
      //   console.log(response.data)
      //   for (let i = 0; i < 3; i++) {
      //     if (_this.planArr[i] != undefined && _this.planArr[i + 3] != undefined) {
      //       let planNum = 0
      //       let actualNum = 0
      //       let failNum = 0
      //       let planWeldingFinishNum = 0
      //       if (response.data.planNumList[i] != null) {
      //         planNum = response.data.planNumList[i]
      //       }
      //       _this.planArr[i].value = planNum
      //       if (response.data.actualNumList[i] != null) {
      //         actualNum = response.data.actualNumList[i]
      //       }
      //       if (response.data.failNumList[i] != null) {
      //         failNum = response.data.failNumList[i]
      //       }
      //       if (response.data.weldingFinishNumList[i] != null) {
      //         planWeldingFinishNum = response.data.weldingFinishNumList[i]
      //       }
      //       if (_this.planArr[i].value != 0 && actualNum != 0) {
      //         _this.planArr[i + 3].value = (Math.round((actualNum + planWeldingFinishNum) / planNum * 10000) / 100.00).toFixed(2) + "%"
      //         console.log(planNum + "," + actualNum + "," + planWeldingFinishNum + "," + failNum)
      //       }
      //     }
      //   }
      //   _this.chart1.setOption({
      //     title: {
      //       text: '本日计划',
      //       left: 'center'
      //     },
      //     tooltip: {
      //       trigger: 'item'
      //     },
      //     legend: {
      //       orient: 'vertical',
      //       left: 'left',
      //     },
      //     series: [
      //       {
      //         type: 'pie',
      //         radius: '50%',
      //         data: [
      //           {value: response.data.actualNumList[0], name: '当日合格'},
      //           {value: response.data.failNumList[0], name: '当日手动焊接'}
      //         ],
      //         emphasis: {
      //           itemStyle: {
      //             shadowBlur: 10,
      //             shadowOffsetX: 0,
      //             shadowColor: 'rgba(0, 0, 0, 0.5)'
      //           }
      //         }
      //       }
      //     ]
      //   })
      //   _this.chart2.setOption({
      //     title: {
      //       text: '本周计划',
      //       left: 'center'
      //     },
      //     tooltip: {
      //       trigger: 'item'
      //     },
      //     legend: {
      //       orient: 'vertical',
      //       left: 'left',
      //     },
      //     series: [
      //       {
      //         type: 'pie',
      //         radius: '50%',
      //         data: [
      //           {value: response.data.actualNumList[1], name: '当周合格'},
      //           {value: response.data.failNumList[1], name: '当周手动焊接'}
      //         ],
      //         emphasis: {
      //           itemStyle: {
      //             shadowBlur: 10,
      //             shadowOffsetX: 0,
      //             shadowColor: 'rgba(0, 0, 0, 0.5)'
      //           }
      //         }
      //       }
      //     ]
      //   })
      //   _this.chart3.setOption({
      //     darkMode: true,
      //     backgroundColor: '#100C2A',
      //     title: {
      //       text: '生产统计',
      //       subtext: '日/周/月合格计划数量',
      //       left: 'center',
      //     },
      //     tooltip: {
      //       trigger: 'axis',
      //       axisPointer: {
      //         type: 'shadow'
      //       }
      //     },
      //     legend: {
      //       orient: 'vertical',
      //       left: 'left'
      //     },
      //     grid: {
      //       left: '3%',
      //       right: '4%',
      //       bottom: '3%',
      //       containLabel: true
      //     },
      //     xAxis: {
      //       type: 'category',
      //       data: ['日统计数量', '周统计数量', '月统计数量',]
      //     },
      //     yAxis: {
      //       type: 'value'
      //     },
      //     series: [
      //       {
      //         name: '合格数量',
      //         data: response.data.actualNumList,
      //         type: 'bar',
      //         showBackground: true,
      //         backgroundStyle: {
      //           color: 'rgba(180, 180, 180, 0.2)'
      //         }
      //       },
      //       {
      //         name: '计划数量',
      //         data: response.data.planNumList,
      //         type: 'bar',
      //         showBackground: true,
      //         backgroundStyle: {
      //           color: 'rgba(180, 180, 180, 0.2)'
      //         }
      //       }
      //     ]
      //   })
      // })
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
  mounted() {
    this.initCharts()
    this.timer = setInterval(this.getPlcData, 5000)
  },
}
</script>

<style lang="scss">
.plcData {
  height: 65px;
  width: 100%;
  border: 2px solid #065278;
  -moz-box-shadow: 0 -2px 7px 1px #065278 inset; /* 老的 Firefox */
  box-shadow: 0 -2px 7px 1px #065278 inset;
  background-color: rgba(255, 255, 255, 0);
  margin-top: 10px;
}

.plc {
  display: inline-block;
  font-size: 25px;
  width: 100%;
  height: 100%;
  line-height: 65px;
  text-align: center;
}

.data {
  position: relative;
  text-align: center;
  overflow: hidden;
  width: 100%;
  height: 200px;
  padding: 0px;
  margin: 0px;
}

.data .title {
  display: block;
  margin-top: 40px;
  font-size: xx-large;
  font-family: '华文仿宋';
}

.data .result {
  display: block;
  margin-top: 30px;
  font-size: 60px;
}

.box {
  width: 30%;
  height: 200px;
  margin-top: 30px;
  display: inline-block;
  margin-left: 2.5%;
}

.l_t_line {
  width: 5px;
  height: 24px;
  left: -3px;
  top: -3px;
  opacity: 0.5;
}

.t_l_line {
  height: 5px;
  width: 26px;
  left: -3px;
  top: -3px;
  opacity: 0.5;
}

.t_line_box {
  position: absolute;
  width: 13.8%;
  height: 200px;
}

.t_line_box i {
  background-color: #4788fb;
  box-shadow: 0px 0px 10px #4788fb;
  position: absolute;
}

.t_r_line {
  height: 5px;
  width: 26px;
  right: -3px;
  top: -3px;
  opacity: 0.5;
}

.r_t_line {
  width: 5px;
  height: 24px;
  right: -3px;
  top: -3px;
  opacity: 0.5;
}

.l_b_line {
  width: 5px;
  height: 24px;
  left: -3px;
  bottom: -3px;
  opacity: 0.5;
}

.b_l_line {
  height: 5px;
  width: 26px;
  left: -3px;
  bottom: -3px;
  opacity: 0.5;
}

.r_b_line {
  width: 5px;
  height: 24px;
  right: -3px;
  bottom: -3px;
  opacity: 0.5;
}

.b_r_line {
  height: 5px;
  width: 26px;
  right: -3px;
  bottom: -3px;
  opacity: 0.5;
}

.row-margin {
  margin: 10px 20px;
}

.custom-header {
  min-height: 900px;
  border: 4px solid #065278;
  -moz-box-shadow: 0 -4px 9px 3px #065278 inset; /* 老的 Firefox */
  box-shadow: 0 -4px 9px 3px #065278 inset;
  background-color: rgba(255, 255, 255, 0);
  color: #eeeeee;

  .el-card__header {
    height: 36px;
    text-align: center;
    line-height: 36px;
    padding: 2px 20px;
    background-image: linear-gradient(90deg,
      rgba(6, 82, 120, 1) 0%,
      rgba(3, 47, 76, 1) 51%,
      rgba(0, 11, 31, 0) 100%);
    // background-image: linear-gradient(to right, rgba(38, 82, 120, 1), rgba(3, 11, 31, 0));
    border-bottom: 0px solid #EBEEF5;

    span {
      color: #eeeeee;
      text-align: left;
      font-size: 21px;
    }
  }
}
</style>
