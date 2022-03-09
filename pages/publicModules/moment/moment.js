import MomentComments from '../../lib/vue/MomentComments';

// 已创建的动态实例，{momentId: momentInstance}
const momentsInstance = {};

// 动态类
class Moment {
  constructor(props) {
    const {momentId} = props;
    // 动态ID
    this.momentId = momentId;
    // 评论列表 vue app
    this.commentApp = null;
  }
  // 获取当前动态的最外层容器
  getContainerElement() {
    const {momentId} = this;
    const momentsContainerElements = getMomentsContainerElements();
    return momentsContainerElements.find(`.single-moment-container[data-moment-id="${momentId}"]`);
  }
  // 获取评论列表最外层容器
  getCommentContainerElement() {
    const containerElement = this.getContainerElement();
    return containerElement.find('.single-moment-comment-container');
  }
  // 实例化评论列表外层 vue
  initCommentApp() {
    if(!this.commentApp) {
      const commentContainerElement = this.getCommentContainerElement();
      this.commentApp = new Vue({
        el: commentContainerElement[0],
        components: {
          'moment-comments': MomentComments
        },
        data: {
          momentId: this.momentId,
          hidden: true
        },
        methods: {
          show() {
            this.hidden = false;
          },
          hide() {
            this.hidden = true;
          },
          toggle() {
            this.hidden = !this.hidden;
          }
        }
      })
    }
  }
  // 打开评论列表
  openCommentContainer() {
    this.initCommentApp();
    this.commentApp.toggle();
  }
}

// 获取所有动态列表父级容器
function getMomentsContainerElements() {
  return $('.moments-container');
}

// 给所有动态列表父级容器添加点击事件，事件委托
function momentsContainerInitEvent() {
  const momentsContainerElements = getMomentsContainerElements();
  for(let i = 0; i < momentsContainerElements.length; i++) {
    momentsContainerElementInitEvent(momentsContainerElements.eq(i));
  }
}

/*
* 给单个动态容器添加点击事件
* @param {Element} momentContainerElement 单个动态容器
* */
function momentsContainerElementInitEvent(momentContainerElement) {
  const element = momentContainerElement[0];
  element.addEventListener('click', (e) => {
    const target = $(e.target);
    // 获取事件名称，对应 momentInstance 中的函数
    const eventName = target.attr('data-event-name');
    // 当前动态ID
    const momentId = target.attr('data-moment-id');
    if(!eventName || !momentId) return;
    const momentInstance = getMomentInstanceByMomentId(momentId);
    momentInstance[eventName]();
  });
}

/*
* 获取指定动态的实例，不存在则创建
* @param {String} momentId 动态ID
* @return {Moment}
* */
function getMomentInstanceByMomentId(momentId) {
  if(!momentsInstance[momentId]) {
    momentsInstance[momentId] = new Moment({momentId})
  }
  return momentsInstance[momentId];
}

$(() => {
  momentsContainerInitEvent();

  // 调试
  $('.moments-container .single-moment-bottom-left').eq(0).click();
});