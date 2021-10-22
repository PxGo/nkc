window.ForumSelector = undefined;
window.data = NKC.methods.getDataById("data");
const commonModel = new NKC.modules.CommonModal();
import Sortable from "sortablejs";

$(function() {
  // 轮播图
  var swiper = new Swiper('.swiper-container', {
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  });
  swiper.el.onmouseover = function(){
    swiper.autoplay.stop();
  };
  swiper.el.onmouseleave = function() {
    swiper.autoplay.start();
  };
  // 监听页面滚动 更改header样式
  $(window).scroll(function(event){
    const scrollTop = $(window).scrollTop();
    const header = $(".navbar-default.nkcshade");
    if(scrollTop > 10) {
      header.addClass("home-fixed-header");
    } else {
      header.removeClass("home-fixed-header");
    }
  });
});
function initSortable() {
  const masterContainerL = document.getElementsByClassName('home-categories-left')[0];
  new Sortable(masterContainerL, {
    group: 'master',
    invertSwap: true,
    handle: '.home-category-master-handle',
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    onEnd: changeOrder
  });
  const masterContainerR = document.getElementsByClassName('home-categories-right')[0];
  new Sortable(masterContainerR, {
    group: 'master',
    invertSwap: true,
    handle: '.home-category-master-handle',
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    onEnd: changeOrder
  });
}
function changeOrder(){
  const leftDom = $('.home-categories-left>.home-forums-list');
  const rightDom = $('.home-categories-right>.home-forums-list');
  const left = [];
  const right = [];
  for(let i = 0; i < leftDom.length; i++) {
    const m = leftDom.eq(i);
    let cid = m.attr('id');
    if(cid.indexOf('new_') === 0) continue;
    cid = cid.split('_').pop();
    left.push(cid);
  }
  for(let i = 0; i < rightDom.length; i++) {
    const m = rightDom.eq(i);
    let cid = m.attr('id');
    if(cid.indexOf('new_') === 0) continue;
    cid = cid.split('_').pop();
    right.push(cid);
  }
  nkcAPI(`/nkc/home/block`, 'PUT', {
    homeBlocksId: {
      left,
      right
    }
  })
    .then(() => {
      console.log(`顺序已保存`);
    })
    .catch(sweetError);
}

//新建
function create(){
  const date = new Date();
  console.log('创建模块');
  const id = 'new_'+date.getTime();
  const leftModel = $('.home-categories-left');
  const hiddenForm = $('#hiddenForm>form').clone();
  leftModel.prepend(`<div id='${id}' class='home-forums-list m-b-1 home-category-master-handle'>
    <div class="home-title-box">
      <div class="home-title-l">
        <span class="fa fa-bars move-handle m-r-1"></span>
        <span class="panel-header m-b-0 home-title">新建模块<span>
      </div>
      <div class="operate">
          <button class="home-title-r btn-success btn btn-xs" style="visibility: initial" @click=save('${id}')>保存</button>
          <button class="home-title-r btn-danger btn btn-xs" style="visibility: initial" @click=delBlock('${id}')>删除</button>
        </div>
    </div>
    <div class="home-threads"></div>
  </div>`);
  const form = $(`#${id}>.home-threads`)
  form.append(hiddenForm);
  initBlock(id);
};
const apps = {};
function getVueAppId(cid) {
  return `vue_app_${cid}`;
}
import ThreadCategoryList from '../publicModules/threadCategory/list';
//创建vue实例
function initVue(cid){
  const app = new Vue({
    el: `#${cid}`,
    data: {
      show: false,
      //已选择的专业
      selectedForums: [],
      form: {
        name:'',
        forumsId:'',
        tcId:'',
        digest:'',
        origin:'',
        postCountMin:'',
        voteUpMin:'',
        voteUpTotalMin:'',
        voteDownMax:'',
        updateInterval:'',
        timeOfPostMin:'',
        timeOfPostMax:'',
        threadStyle:'',
        blockStyle:'',
        usernameColor:'',
        forumColor:'',
        titleColor:'',
        abstractColor:'',
        infoColor:'',
        coverPosition:'',
        threadCount:'',
        disabled:'',
        fixedThreadCount:'',
        autoThreadsId:'',
        fixedThreadsId:'',
        sort:'',
      },
      threadCategories: data.data.threadCategories,
      selectedHomeCategoriesId: [],
    },
    components: {
      'thread-category-list': ThreadCategoryList
    },
    mounted() {
    },
    methods: {
      //选择文章列表样式
      selectBlockStyle(){
        const self = this;
        commonModel.open(data => {
          const backgroundColor = data[0].value;
          const usernameColor = data[1].value;
          const forumColor = data[2].value;
          const titleColor = data[3].value;
          const abstractColor = data[4].value;
          const infoColor = data[5].value;
        }, {
          title: '文章列表样式',
          data: [
            {
              dom: 'input',
              label: '背景颜色',
              value: this.form.blockStyle.backgroundColor || ''
            },
            {
              dom: 'input',
              label: '用户名颜色',
              value: this.form.blockStyle.usernameColor || ''
            },
            {
              dom: 'input',
              label: '专业颜色',
              value: this.form.blockStyle.forumColor || ''
            },
            {
              dom: 'input',
              label: '标题颜色',
              value: this.form.blockStyle.titleColor || ''
            },
            {
              dom: 'input',
              label: '摘要颜色',
              value: this.form.blockStyle.abstractColor || ''
            },
            {
              dom: 'input',
              label: '信息颜色',
              value: this.form.blockStyle.infoColor || ''
            }
          ]
        })
      },
      getSelectedHomeCategoriesId() {
        return this.$refs.homeCategoryList.getSelectedCategoriesId();
      },
      //保存创建的模块
      save(cid){
        let selectId = [].concat(this.selectedForumsId());
        this.form.forumsId = selectId;
        this.selectedHomeCategoriesId = this.getSelectedHomeCategoriesId();
        this.form.tcId = this.selectedHomeCategoriesId;
        console.log(this.form);
      },
      //删除模块
      delBlock(cid){
        const delDom = $(`#${cid}`);
        delDom.remove();
      },
      //返回专业
      forums(){

      },
      //移除选中的专业
      removeForum(fid){
        this.selectedForums = this.selectedForums.filter((c => c.fid !== fid))
      },
      // 获取已选择专业ID组成的数组
      selectedForumsId() {
        var arr = [];
        var selectedForums = this.selectedForums;
        for(var i = 0; i < selectedForums.length; i++) {
          var forum = selectedForums[i];
          if(forum.fid) arr.push(forum.fid);
        }
        return arr;
      },
      // 获取已选择文章分类ID组成的数组
      selectedCategoriesId() {
        var arr = [];
        var selectedForums = this.selectedForums;
        for(var i = 0; i < selectedForums.length; i++) {
          var forum = selectedForums[i];
          if(forum.cid) arr.push(forum.cid);
        }
        return arr;
      },
      //选择专业
      selectForums(){
        var self = this;
        if(!window.ForumSelector)
          window.ForumSelector = new NKC.modules.ForumSelector();
        var selectedForumsId = [].concat(self.selectedForumsId());
        window.ForumSelector.open(function(r) {
          r.logo = r.forum.logo;
          r.color = r.forum.color;
          r.fName = r.forum.displayName;
          r.cName = r.threadType? r.threadType.name: '';
          self.selectedForums.push(r);
        }, {
          highlightForumId: [],
          selectedForumsId: [],
          disabledForumsId: selectedForumsId
        });
      },
    },
  });
  return app;
}
//编辑
function initBlock(cid){
  console.log(cid);
  const vueAppId = getVueAppId(cid);
  let app = apps[vueAppId];
  if(!app) {
    //创建vue实例
    app = initVue(cid);
    apps[vueAppId] = app;
  }
  app.show = true;
}
//删除
function del(){}
//屏蔽
function disabled(){}
function clickEditor(){

}

const defaultButtonStatus = {
  editor: true,
  finished: false,
  create: false,
  handle: false
};

const editorButtonStatus = {
  editor: false,
  finished: true,
  create: true,
  handle: true
};

function renderButtons(status) {
  const editor = $('.admin-editor');
  const finished = $('.admin-finished');
  const create = $('.admin-create');
  const moveHandle = $('.move-handle');
  status.editor? editor.show(): editor.hide();
  status.finished? finished.show(): finished.hide();
  status.create? create.show(): create.hide();
  status.handle? moveHandle.show(): moveHandle.hide()
}

renderButtons(defaultButtonStatus);

//进入编辑模式
function editor(){
  renderButtons(editorButtonStatus);
  initSortable();
}
function finished(){
  renderButtons(defaultButtonStatus);
}

Object.assign(window, {
  changeOrder,
  finished,
  clickEditor,
  disabled,
  del,
  initBlock,
  create,
  editor,
  initSortable,
});
