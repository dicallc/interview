<template>
  <div class="random">
    <mu-container>
      <div style="display: flex">
        <mu-select label="等级" v-model="option_value" @change="changeSelectValue" style="width: 40%">
          <mu-option v-for="option in options" :key="option.createdAt" :label="option.key" :value="option.name"></mu-option>
        </mu-select>
        <mu-select label="类别" v-model="tag_value" style="width: 30%;margin-left: 10px">
          <mu-option v-for="option in tag_list" :key="option.key" :label="option.key" :value="option.value"></mu-option>
        </mu-select>
      </div>
      <mu-expansion-panel  @change="toggle('panel1')" v-for="item in list" v-bind:key="item.objectId" style="margin-bottom: 15px">
        <div slot="header">
         <p> {{item.title}}</p>
         <p style="font-size: 10px;color: #999999">Tips:{{item.tips}}</p>
        </div>
        <div>
          <mavon-editor v-html=changeMarkDown(item.content) :subfield="false" :defaultOpen="defaultData" :toolbarsFlag="false" :boxShadow="false" @change="changeData" style="background-color: rgb(204, 232, 207);padding: 5px;margin-top: 10px" />
        </div>
      </mu-expansion-panel>
    </mu-container>
    <mu-container class="button-wrapper" style="margin-top: 30px">
      <mu-button color="primary" @click="loadRandomOne()">再来一个</mu-button>
      <mu-button color="secondary" style="margin-left: 15px" @click="loadRandomThree()">再来三个</mu-button>
      <mu-button color="success" style="margin-left: 15px" @click="loadRandomFive()">再来五个</mu-button>
      </mu-container>
  </div>
</template>
<script>
import marked from 'marked'
export default {
  created: function () {
    this.loadData()
  },
  data () {
    return {
      option_value: 'android_low',
      tag_value: '',
      options: this.$store.state.tableName,
      tag_list: [
        { key: '线程', value: 'thread' }, { key: '安卓中级', value: 'android_mid' }, { key: '安卓高级', value: 'android_high' }
      ],
      listSize: 1,
      value: '',
      list: [],
      panel: '',
      defaultData: 'preview'
    }
  },
  methods: {
    loadRandomOne () {
      let query = this.$Bmob.Query(this.option_value)
      let arr = this.randomNum(1, this.listSize, 1)
      let query1 = query.equalTo('index', '==', arr[0] + '')
      query.or(query1)
      query.find().then(res => {
        this.list = res
      })
    },
    loadRandomThree () {
      let query = this.$Bmob.Query(this.option_value)
      let arr = this.randomNum(1, this.listSize, 3)
      console.log(arr)
      let query1 = query.equalTo('index', '==', arr[0] + '')
      let query2 = query.equalTo('index', '==', arr[1] + '')
      let query3 = query.equalTo('index', '==', arr[2] + '')
      query.or(query1, query2, query3)
      query.find().then(res => {
        this.list = res
      })
    },
    loadRandomFive () {
      const query = this.$Bmob.Query(this.option_value)
      let arr = this.randomNum(1, this.listSize, 5)
      let query1 = query.equalTo('index', '==', arr[0] + '')
      let query2 = query.equalTo('index', '==', arr[1] + '')
      let query3 = query.equalTo('index', '==', arr[2] + '')
      let query4 = query.equalTo('index', '==', arr[3] + '')
      let query5 = query.equalTo('index', '==', arr[4] + '')
      query.or(query1, query2, query3, query4, query5)
      query.find().then(res => {
        this.list = res
      })
    },
    loadNum () {
      // const res = await query.count()
      // this.listSize = res
      let that = this
      return new Promise(function (resolve, reject) {
        const query = that.$Bmob.Query(that.option_value)
        query.count().then(res => {
          that.listSize = res
          resolve()
        })
      })
    },
    loadData () {
      const query = this.$Bmob.Query(this.option_value)
      query.limit(1)
      query.find().then(res => {
        this.list = res
      })
    },
    async changeSelectValue (value) {
      await this.loadNum()
      this.loadData()
    },
    changeMarkDown (value) {
      return marked(value)
    },
    // randomNum (min, max, num) {
    //   let arr = []
    //   if (min === max) {
    //     arr.push(min)
    //     return arr
    //   }
    //   let t = 0
    //   function fn (i) {
    //     for (i; i < num; i++) {
    //       t = parseInt(Math.random() * (max - min + 1) + min)
    //       for (let k in arr) {
    //         if (arr[k] === t) {
    //           fn(i)
    //           break
    //         }
    //       }
    //       arr[i] = t
    //     }
    //   }
    //   fn(0)
    //   return arr
    // },
    randomNum (minNum, maxNum, num) {
      let arr = []
      if (minNum === maxNum) {
        arr.push(minNum)
        return arr
      }
      for (let i = minNum; i <= maxNum; i++) {
        arr.push(i)
      }
      let out = []
      while (out.length < num) {
        let index = parseInt(Math.random() * arr.length)
        out = out.concat(arr.splice(index, 1))
      }
      // while (out.length < num - 1) {
      //   let temp = (Math.random() * arr.length) >> 0
      //   out.push(arr.splice(temp, 1))
      // }
      return out
    },
    changeData (value, render) {
      console.log(render)
    },
    toggle (panel) {
      this.panel = panel === this.panel ? '' : panel
    }
  }
}
</script>
<style>
  .mu-expansion-panel-content{
    padding: 0;
  }
</style>
