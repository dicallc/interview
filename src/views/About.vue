<template>
  <div class="about">
    <mu-container>
      <div style="display: flex">
        <mu-select label="等级" v-model="option_value" @change="changeSelectValue" style="width: 50%">
          <mu-option v-for="option in options" :key="option.key" :label="option.key" :value="option.value"></mu-option>
        </mu-select>
        <mu-select label="类别" v-model="tag_value" @change="changeSelectValue" style="width: 50%">
          <mu-option v-for="option in tag_list" :key="option.key" :label="option.key" :value="option.value"></mu-option>
        </mu-select>
      </div>
      <mu-expansion-panel  @change="toggle('panel1')" v-for="item in list" v-bind:key="item.objectId" style="margin-bottom: 15px">
        <div slot="header">
         <p> {{item.title}}</p>
         <p style="font-size: 10px">Tips:{{item.tips}}</p>
        </div>
        <div>
          <mavon-editor v-html=changeMarkDown(item.content) :subfield="false" :defaultOpen="defaultData" :toolbarsFlag="false" :boxShadow="false" @change="changeData" />
        </div>
      </mu-expansion-panel>
    </mu-container>
    <mu-container class="button-wrapper" style="margin-top: 30px">
      <mu-button color="primary">再来一个</mu-button>
      <mu-button color="secondary" style="margin-left: 15px">再来三个</mu-button>
      <mu-button color="success" style="margin-left: 15px">再来五个</mu-button>
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
      options: [
        { key: '安卓初级', value: 'android_low' }, { key: '安卓中级', value: 'android_mid' }, { key: '安卓高级', value: 'android_high' }
      ],
      tag_list: [
        { key: '线程', value: 'thread' }, { key: '安卓中级', value: 'android_mid' }, { key: '安卓高级', value: 'android_high' }
      ],
      value: '',
      list: [],
      panel: '',
      defaultData: 'preview'
    }
  },
  methods: {
    loadData () {
      const query = this.$Bmob.Query(this.option_value)
      query.find().then(res => {
        this.list = res
      })
    },
    changeSelectValue (value) {
      this.loadData()
    },
    changeMarkDown (value) {
      return marked(value)
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
