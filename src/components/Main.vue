<template>
  <div class="main">
    <mu-container>
      <div style="display: flex">
        <mu-select label="等级" v-model="option_value" @change="changeSelectValue" style="width: 40%">
          <mu-option v-for="option in options" :key="option.createdAt" :label="option.key" :value="option.name"></mu-option>
        </mu-select>
        <mu-select label="类别" v-model="tag_value" @change="changeSelectValue" style="width: 50%">
          <mu-option v-for="option in tag_list" :key="option.key" :label="option.key" :value="option.value"></mu-option>
        </mu-select>
      </div>
      <mu-expansion-panel  @change="toggle('panel1')" v-for="item in list" v-bind:key="item.objectId" style="margin-bottom: 15px">
        <div slot="header">
          <p> {{item.title}}</p>
          <p style="font-size: 10px;color: #999999" v-show="item.tips !==''">Tips:{{item.tips}}</p>
        </div>
        <div>
          <mavon-editor v-html=changeMarkDown(item.content) :subfield="false" :defaultOpen="defaultData" :toolbarsFlag="false" :boxShadow="false" @change="changeData" style="background-color: rgb(204, 232, 207);padding: 5px;margin-top: 10px" />
        </div>
      </mu-expansion-panel>
    </mu-container>
    <mu-container class="button-wrapper" style="margin-top: 30px">
    </mu-container>
  </div>
</template>

<script>
import marked from 'marked'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created: function () {
    this.loadData()
  },
  data () {
    return {
      option_value: 'android_low',
      tag_value: '',
      tag_list: [
        { key: '线程', value: 'thread' }, { key: '安卓中级', value: 'android_mid' }, { key: '安卓高级', value: 'android_high' }
      ],
      value: '',
      list: [],
      panel: '',
      defaultData: 'preview'
    }
  },
  computed: {
    options: function () {
      return this.$store.state.tableName
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.mu-expansion-panel-content{
  padding: 0;
}
h3 {
  margin: 40px 0 0;
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
