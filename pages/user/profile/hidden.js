
if(window.location.search){
  const serach = window.location.search.split('=')
  if(serach[0] ==='?type' && serach[1] === 'hidden'){
    document.querySelector('.row').style.display = 'flex';
    document.querySelector('.row').style.justifyContent += 'center'
    // 获取 页头
    document.querySelector('.navbar').style.display = 'none';
    // 获取 页脚
    document.querySelector('.footer').style.display = 'none';
    // 获取 右上 （购物车）
    document.querySelector('.shopping-cart').style.display = 'none';
    // 获取 左侧 （显示用户信息）
    document.querySelector('.user-info-list').style.display = 'none';
  }
}