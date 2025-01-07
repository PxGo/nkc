/*
 * 目前，访问任何一个路由都对应一个操作
 * 一个路由对应一个操作，一个操作可对应多个路由
 * 除了路由操作以外，还存在非路由操作
 * 后台证书设置页可配置动态操作给证书，起到控制权限的作用
 * */

// 固定的、无需在后台证书权限处配置的操作，不会经过全局权限判断
const FixedOperations = {
  modifyPasswordByMobile: 'modifyPasswordByMobile',
  visitFindPasswordByMobile: 'visitFindPasswordByMobile',
  modifyPasswordByEmail: 'modifyPasswordByEmail',
  findPasswordSendVerifyEmail: 'findPasswordSendVerifyEmail',
  visitFindPasswordByEmail: 'visitFindPasswordByEmail',
  visitExamPaperList: 'visitExamPaperList',
  visitEditor: 'visitEditor',
  getUserNavData: 'getUserNavData',
  getUserDrawData: 'getUserDrawData',
  getLeftDrawData: 'getLeftDrawData',
  historyEditDraft: 'historyEditDraft',
  viewHistoryDraft: 'viewHistoryDraft',
  editorAutoUploadImage: 'editorAutoUploadImage',
  historyEditDocument: 'historyEditDocument',
  viewHistoryDocument: 'viewHistoryDocument',
  previewDocument: 'previewDocument',
  publishArticle: 'publishArticle',
  creationCenter: 'creationCenter',
  complaintPost: 'complaintPost',
  visitCommunity: 'visitCommunity',
  getCommentPermission: 'getCommentPermission',
  publishComment: 'publishComment',
  getComments: 'getComments',
  column_single_settings_fans: 'column_single_settings_fans',
  column_single_settings_close: 'column_single_settings_close',
  column_single_settings_transfer: 'column_single_settings_transfer',
  column_single_settings_contribute: 'column_single_settings_contribute',
  column_article_get: 'column_article_get',
  column_single_page: 'column_single_page',
  column_single_settings_page: 'column_single_settings_page',
  column_single_contact: 'column_single_contact',
  column_single_status: 'column_single_status',
  column_single_subscribe: 'column_single_subscribe',
  column_single_settings_post: 'column_single_settings_post',
  column_single_settings: 'column_single_settings',
  column_get: 'column_get',
  columnEditor: 'columnEditor',
  getColumnInfo: 'getColumnInfo',
  column_apply: 'column_apply',
  bookInvitation: 'bookInvitation',
  getBook: 'getBook',
  removeUserFromBlacklist: 'removeUserFromBlacklist',
  addUserToBlacklist: 'addUserToBlacklist',
  checkBlacklist: 'checkBlacklist',
  getAttachment: 'getAttachment',
  post_vote_down: 'post_vote_down',
  post_vote_up: 'post_vote_up',
  collectionArticle: 'collectionArticle',
  getArticleOptions: 'getArticleOptions',
  deleteArticleDraft: 'deleteArticleDraft',
  appVisitProfile: 'appVisitProfile',
  APPGetAccountInfo: 'APPGetAccountInfo',
  APPUpgrade: 'APPUpgrade',
  appGetDownload: 'appGetDownload',
  APPGetMy: 'APPGetMy',
  APPcheckout: 'APPcheckout',
  APPGetNav: 'APPGetNav',
  selectLocation: 'selectLocation',
  downloadApp: 'downloadApp',
  visitAppDownload: 'visitAppDownload',
  columnManage: 'columnManage',
  column_single_get: 'column_single_get',
  column_single_contribute: 'column_single_contribute',
  getUserArticles: 'getUserArticles',
  sendActivityMessage: 'sendActivityMessage',
  delActivityModify: 'delActivityModify',
  postActivityModify: 'postActivityModify',
  getActivityModify: 'getActivityModify',
  myActivityReleaseIndex: 'myActivityReleaseIndex',
  postToActivity: 'postToActivity',
  myActivityApplyIndex: 'myActivityApplyIndex',
  cancelActivityApply: 'cancelActivityApply',
  activityEditPost: 'activityEditPost',
  activityApplyPost: 'activityApplyPost',
  visitActivitySingle: 'visitActivitySingle',
  activityListIndex: 'activityListIndex',
  activityReleasePost: 'activityReleasePost',
  activityReleaseIndex: 'activityReleaseIndex',
  visitActivityIndex: 'visitActivityIndex',
  accountWithdraw: 'accountWithdraw',
  accountExchange: 'accountExchange',
  rechargePost: 'rechargePost',
  accountRecharge: 'accountRecharge',
  visitUserContribute: 'visitUserContribute',
  account_subscribe: 'account_subscribe',
  visitHome: 'visitHome',
  modifyLibraryFolder: 'modifyLibraryFolder',
  libraryUpload: 'libraryUpload',
  createLibraryFolder: 'createLibraryFolder',
  moveLibraryFolder: 'moveLibraryFolder',
  deleteLibraryFolder: 'deleteLibraryFolder',
  getLibraryInfo: 'getLibraryInfo',
  linkToTarget: 'linkToTarget',
  reportLinkToTarget: 'reportLinkToTarget',
  visitLogin: 'visitLogin',
  submitLogin: 'submitLogin',
  getSiteSpecific: 'getSiteSpecific',
  visitLottery: 'visitLottery',
  getRedEnvelope: 'getRedEnvelope',
  closeRedEnvelope: 'closeRedEnvelope',
  mathJax: 'mathJax',
  getPersonalResources: 'getPersonalResources',
  getPersonalMedia: 'getPersonalMedia',
  getPersonalLifePhotos: 'getPersonalLifePhotos',
  sendAnApplicationToAddAFriend: 'sendAnApplicationToAddAFriend',
  messageCategory: 'messageCategory',
  messagePostData: 'messagePostData',
  messageDataGet: 'messageDataGet',
  getFriendsApplication: 'getFriendsApplication',
  modifyMessageStatus: 'modifyMessageStatus',
  getMessageFile: 'getMessageFile',
  messageSearchUser: 'messageSearchUser',
  modifyMessageSettings: 'modifyMessageSettings',
  messageGetData: 'messageGetData',
  visitMessagePage: 'visitMessagePage',
  userWithdrawnMessage: 'userWithdrawnMessage',
  getMomentOption: 'getMomentOption',
  setMomentVisible: 'setMomentVisible',
  deleteMoment: 'deleteMoment',
  addNote: 'addNote',
  deleteNote: 'deleteNote',
  modifyNote: 'modifyNote',
  viewNote: 'viewNote',
  OAuthAuthentication: 'OAuthAuthentication',
  discuz: 'discuz',
  getAttachmentIcon: 'getAttachmentIcon',
  logout: 'logout',
  faq: 'faq',
  deletePhoto: 'deletePhoto',
  uploadPhoto: 'uploadPhoto',
  getSmallPhoto: 'getSmallPhoto',
  getActivityPoster: 'getActivityPoster',
  uploadActivityPoster: 'uploadActivityPoster',
  getMediums: 'getMediums',
  getOrigins: 'getOrigins',
  sendDestroyMessage: 'sendDestroyMessage',
  sendUnbindMobileMessage: 'sendUnbindMobileMessage',
  sendWithdrawMessage: 'sendWithdrawMessage',
  sendChangeMobileMessage: 'sendChangeMobileMessage',
  sendBindMobileMessage: 'sendBindMobileMessage',
  sendRegisterMessage: 'sendRegisterMessage',
  sendGetBackPasswordMessage: 'sendGetBackPasswordMessage',
  sendLoginMessage: 'sendLoginMessage',
  getShopLogo: 'getShopLogo',
  uploadShopLogo: 'uploadShopLogo',
  receiveAliPayPaymentInfo: 'receiveAliPayPaymentInfo',
  postWeChatPayInfo: 'postWeChatPayInfo',
  receiveWeChatPaymentInfo: 'receiveWeChatPaymentInfo',
  collectionPost: 'collectionPost',
  getPostComments: 'getPostComments',
  creditKcb: 'creditKcb',
  hidePost: 'hidePost',
  modifyPostNoticeContent: 'modifyPostNoticeContent',
  getPostNotices: 'getPostNotices',
  getPostOption: 'getPostOption',
  quotePost: 'quotePost',
  getPostResources: 'getPostResources',
  topPost: 'topPost',
  postVoteUp: 'postVoteUp',
  postVoteDown: 'postVoteDown',
  visitPost: 'visitPost',
  modifyPost: 'modifyPost',
  visitAddProblem: 'visitAddProblem',
  submitProblem: 'submitProblem',
  visitProtocol: 'visitProtocol',
  pdfReader: 'pdfReader',
  getRegisterExamCode: 'getRegisterExamCode',
  visitPublicExam: 'visitPublicExam',
  registerSubscribe: 'registerSubscribe',
  getRegisterCode: 'getRegisterCode',
  submitRegister: 'submitRegister',
  visitMobileRegister: 'visitMobileRegister',
  getResourceCover: 'getResourceCover',
  resourceDetail: 'resourceDetail',
  getResourceInfo: 'getResourceInfo',
  buyResource: 'buyResource',
  modifyResources: 'modifyResources',
  resourceCategory: 'resourceCategory',
  uploadResources: 'uploadResources',
  getResources: 'getResources',
  search: 'search',
  getCreditSettings: 'getCreditSettings',
  getDigestSettings: 'getDigestSettings',
  getShareToken: 'getShareToken',
  visitShareLink: 'visitShareLink',
  billParamPlusOne: 'billParamPlusOne',
  billParamAddOne: 'billParamAddOne',
  submitShopBill: 'submitShopBill',
  visitShopBill: 'visitShopBill',
  modifyCartData: 'modifyCartData',
  visitShopCart: 'visitShopCart',
  addProductToCart: 'addProductToCart',
  shopUploadCert: 'shopUploadCert',
  saveShopCerts: 'saveShopCerts',
  shopDeleteCert: 'shopDeleteCert',
  shopGetCert: 'shopGetCert',
  addStoreClassify: 'addStoreClassify',
  delStoreClassify: 'delStoreClassify',
  visitShopClassifyIndex: 'visitShopClassifyIndex',
  delStoreClassFeatured: 'delStoreClassFeatured',
  addStoreSingleClassify: 'addStoreSingleClassify',
  getStoreSingleClassify: 'getStoreSingleClassify',
  addStoreClassFeatured: 'addStoreClassFeatured',
  visitFeaturedProductList: 'visitFeaturedProductList',
  modifyStoreDecorationFeatured: 'modifyStoreDecorationFeatured',
  modifyStoreDecorationSearch: 'modifyStoreDecorationSearch',
  modifyStoreDecorationService: 'modifyStoreDecorationService',
  modifyStoreDecorationSign: 'modifyStoreDecorationSign',
  visitStoreDecorationIndex: 'visitStoreDecorationIndex',
  modifyStoreDecoration: 'modifyStoreDecoration',
  productGoonSale: 'productGoonSale',
  productStopSale: 'productStopSale',
  productShelfRightNow: 'productShelfRightNow',
  visitStoreGoodsProductEdit: 'visitStoreGoodsProductEdit',
  submitEditToProduct: 'submitEditToProduct',
  visitStoreGoodsParamEdit: 'visitStoreGoodsParamEdit',
  submitEditToParam: 'submitEditToParam',
  visitStoreGoodsList: 'visitStoreGoodsList',
  visitManageHome: 'visitManageHome',
  visitStoreInfoIndex: 'visitStoreInfoIndex',
  visitShopOrderIndex: 'visitShopOrderIndex',
  storeCancelOrder: 'storeCancelOrder',
  orderListToExcel: 'orderListToExcel',
  editOrderPrice: 'editOrderPrice',
  editCostRecord: 'editCostRecord',
  editSellMessage: 'editSellMessage',
  visitStoreOrderLogositics: 'visitStoreOrderLogositics',
  visitStoreOrderDetail: 'visitStoreOrderDetail',
  editOrderTrackNumber: 'editOrderTrackNumber',
  editOrder: 'editOrder',
  sendGoodsNoLog: 'sendGoodsNoLog',
  editGoodsLogositics: 'editGoodsLogositics',
  sendGoods: 'sendGoods',
  visitStoreOrderRefund: 'visitStoreOrderRefund',
  submitStoreOrderRefund: 'submitStoreOrderRefund',
  modifyStoreInfo: 'modifyStoreInfo',
  visitShelfIndex: 'visitShelfIndex',
  productToShelf: 'productToShelf',
  visitFreightTemplate: 'visitFreightTemplate',
  saveFreightTemplate: 'saveFreightTemplate',
  modifyShopOrderDeliveryInfo: 'modifyShopOrderDeliveryInfo',
  confirmOrderReceipt: 'confirmOrderReceipt',
  visitOrderLogistics: 'visitOrderLogistics',
  visitUserOrderRefund: 'visitUserOrderRefund',
  visitSingleOrderDetail: 'visitSingleOrderDetail',
  submitToPay: 'submitToPay',
  visitUserOrder: 'visitUserOrder',
  kcbPay: 'kcbPay',
  visitShopPay: 'visitShopPay',
  userApplyRefund: 'userApplyRefund',
  visitOpenStoreIndex: 'visitOpenStoreIndex',
  openStoreApply: 'openStoreApply',
  changeProductParams: 'changeProductParams',
  visitProductSingle: 'visitProductSingle',
  visitShopIndex: 'visitShopIndex',
  stickerCenter: 'stickerCenter',
  modifySticker: 'modifySticker',
  getSticker: 'getSticker',
  getSharedStickers: 'getSharedStickers',
  survey_get: 'survey_get',
  survey_post: 'survey_post',
  survey_single_get: 'survey_single_get',
  survey_single_post: 'survey_single_post',
  getThreadCategories: 'getThreadCategories',
  collectThread: 'collectThread',
  editThreadPostOrder: 'editThreadPostOrder',
  postToThread: 'postToThread',
  visitThread: 'visitThread',
  getThreadByQuery: 'getThreadByQuery',
  visitToolsList: 'visitToolsList',
  visitTool: 'visitTool',
  userProfile: 'userProfile',
  applyToChangeUnusedPhoneNumber: 'applyToChangeUnusedPhoneNumber',
  visitMobileSettings: 'visitMobileSettings',
  modifyMobile: 'modifyMobile',
  unbindMobile: 'unbindMobile',
  bindMobile: 'bindMobile',
  visitUserInfoSettings: 'visitUserInfoSettings',
  modifyUserInfo: 'modifyUserInfo',
  userBindBankAccounts: 'userBindBankAccounts',
  visitUserCertPhotoSettings: 'visitUserCertPhotoSettings',
  modifyUserCertPhotoSettings: 'modifyUserCertPhotoSettings',
  userDisplaySettings: 'userDisplaySettings',
  visitEmailSettings: 'visitEmailSettings',
  sendEmail: 'sendEmail',
  bindEmail: 'bindEmail',
  changeEmail: 'changeEmail',
  unbindEmail: 'unbindEmail',
  visitPasswordSettings: 'visitPasswordSettings',
  modifyPassword: 'modifyPassword',
  visitUserPhotoSettings: 'visitUserPhotoSettings',
  modifyUserPhotoSettings: 'modifyUserPhotoSettings',
  userBindAlipayAccounts: 'userBindAlipayAccounts',
  getZoneMomentComments: 'getZoneMomentComments',
  deleteZoneMomentComment: 'deleteZoneMomentComment',
  zoneMomentCommentVote: 'zoneMomentCommentVote',
  getZoneMomentCommentOptions: 'getZoneMomentCommentOptions',
  getWatermark: 'getWatermark',
  getAppsWatermark: 'getAppsWatermark',
  getVerifications: 'getVerifications',
  modifyUserBanner: 'modifyUserBanner',
  getUserAvatar: 'getUserAvatar',
  uploadUserAvatar: 'uploadUserAvatar',
  auditorVisitVerifiedUpload: 'auditorVisitVerifiedUpload',
  visitUserCard: 'visitUserCard',
  getUserHomeInfo: 'getUserHomeInfo',
  getUserHomeCard: 'getUserHomeCard',
  visitUserTransactionSettings: 'visitUserTransactionSettings',
  modifyUserTransaction: 'modifyUserTransaction',
  subscribeUser: 'subscribeUser',
  unSubscribeUser: 'unSubscribeUser',
  phoneVerify: 'phoneVerify',
  sendPhoneVerifyCode: 'sendPhoneVerifyCode',
  transferKcbToUser: 'transferKcbToUser',
  visitSelfProblems: 'visitSelfProblems',
  visitSelfProblemDetails: 'visitSelfProblemDetails',
  applyForum: 'applyForum',
  applyForumInvitation: 'applyForumInvitation',
  visitDraftList: 'visitDraftList',
  addDraft: 'addDraft',
  deleteDraft: 'deleteDraft',
  destroyAccount: 'destroyAccount',
  visitUserWaterSettings: 'visitUserWaterSettings',
  modifyUserWaterSettings: 'modifyUserWaterSettings',
  visitVerifySettings: 'visitVerifySettings',
  verify3VideoUpload: 'verify3VideoUpload',
  verify2ImageUpload: 'verify2ImageUpload',
  modifyUsername: 'modifyUsername',
  visitUserSocialSettings: 'visitUserSocialSettings',
  modifyUserSocial: 'modifyUserSocial',
  visitUserResumeSettings: 'visitUserResumeSettings',
  modifyUserResume: 'modifyUserResume',
  visitUserRedEnvelopeSettings: 'visitUserRedEnvelopeSettings',
  modifyUserRedEnvelopeSettings: 'modifyUserRedEnvelopeSettings',

  zoneMomentVote: 'zoneMomentVote',
  visitZoneSingleMoment: 'visitZoneSingleMoment',
  visitZoneArticle: 'visitZoneArticle',
  getServerInfo: 'getServerInfo',
  getAccountInfo: 'getAccountInfo',
  getAccountCard: 'getAccountCard',
  getAccountDrawer: 'getAccountDrawer',
  getReviewData: 'getReviewData',
  getUserPublicInfo: 'getUserPublicInfo',
  modifyUserMemo: 'modifyUserMemo',
  getUserMemo: 'getUserMemo',
  getQuestionTag: 'getQuestionTag',
  putQuestionTag: 'putQuestionTag',
  deleteQuestionTag: 'deleteQuestionTag',
  getQuestionTags: 'getQuestionTags',
  createQuestionTag: 'createQuestionTag',
  openPublicExam: 'openPublicExam',
  takePublicExam: 'takePublicExam',
  submitPublicExam: 'submitPublicExam',
  createExamQuestion: 'createExamQuestion',
  modifyExamQuestion: 'modifyExamQuestion',
  visitExamQuestionEditor: 'visitExamQuestionEditor',
  getExamsPaper: 'getExamsPaper',
  postExamsPaper: 'postExamsPaper',
  registerExamCheck: 'registerExamCheck',
  getQuestionImage: 'getQuestionImage',
  editorMoment: 'editorMoment',
  visitZone: 'visitZone',
  browserDetection: 'browserDetection',
  visitCommunityNew: 'visitCommunityNew',
  visitCommunitySub: 'visitCommunitySub',
  getForumsTree: 'getForumsTree',
  visitAppsPage: 'visitAppsPage',
  checkAccountPermission: 'checkAccountPermission',
  getThreadOrder: 'getThreadOrder',
  visitDocument: 'visitDocument',
  visitArticle: 'visitArticle',
  visitMomentRichEditor: 'visitMomentRichEditor',
  visitMomentRichEditorHistory: 'visitMomentRichEditorHistory',
  momentRichEditorGetDraft: 'momentRichEditorGetDraft',
  momentRichEditorSaveDraft: 'momentRichEditorSaveDraft',
  momentRichEditorPublish: 'momentRichEditorPublish',
  momentRichEditorGetHistory: 'momentRichEditorGetHistory',
  momentPlainEditorGetDraft: 'momentPlainEditorGetDraft',
  momentPlainEditorSaveDraft: 'momentPlainEditorSaveDraft',
  momentPlainEditorPublish: 'momentPlainEditorPublish',
  momentRichEditorHistoryRollback: 'momentRichEditorHistoryRollback',
  weChat: 'weChat',
  appVideoPlayer: 'appVideoPlayer',
};

// 需要在后台配置给相应证书的操作，会经过全局的权限判断
const DynamicOperations = {
  sendPhoneMessage: 'sendPhoneMessage',
  modifyOtherPosts: 'modifyOtherPosts',
  modifyOtherArticles: 'modifyOtherArticles',
  displayRecycleMarkThreads: 'displayRecycleMarkThreads',
  displayDisabledPosts: 'displayDisabledPosts',
  displayPostHideHistories: 'displayPostHideHistories',
  displayFundNoVerifyBills: 'displayFundNoVerifyBills',
  displayFundBillsSecretInfo: 'displayFundBillsSecretInfo',
  displayFundApplicationFormSecretInfo: 'displayFundApplicationFormSecretInfo',
  getAnyBodyPhoto: 'getAnyBodyPhoto', // 忽略相册、证书照片的权限
  removeAnyBodyPhoto: 'removeAnyBodyPhoto', // 忽略相册、证书照片的权限
  canSendToEveryOne: 'canSendToEveryOne', // 跳过`仅接收好友信息`限制
  creditXsf: 'creditXsf',
  modifyAllQuestions: 'modifyAllQuestions', // 可修改审核过的试题
  viewAllPaperRecords: 'viewAllPaperRecords', // 可查看所有的考试记录
  removeAllQuestion: 'removeAllQuestion', // 可删除别人出的试题
  superModerator: 'superModerator', // 超级专家，所有专业的专家权限
  getAnyBodyShopCert: 'getAnyBodyShopCert', // 可查看任何人的商城凭证
  viewUserAllFansAndFollowers: 'viewUserAllFansAndFollowers', // 可查看用户的所有关注的人和粉丝
  showSecretSurvey: 'showSecretSurvey', // 查看隐藏的调查结果
  showSurveyCertLimit: 'showSurveyCertLimit', // 发起调查时可更具证书限制参与的用户
  getAllMessagesResources: 'getAllMessagesResources', // 查看所有的短消息资源
  topAllPost: 'topAllPost', // 置顶任何人的回复
  modifyAllResource: 'modifyAllResource', // 可修改任何人的附件
  visitAllUserProfile: 'visitAllUserProfile', // 可查看任何人的个人中心
  managementNote: 'managementNote', // 可屏蔽编辑任何人的笔记
  viewUserScores: 'viewUserScores', // 可在用户名片页查看用户的积分
  viewUserCode: 'viewUserCode', // 可查看任意用户的动态码
  viewUserArticle: 'viewUserArticle', //查看任意用户的文章
  modifyAllPostOrder: 'modifyAllPostOrder', //可以调整任意用户的文章回复顺序
  getDefaultImage: 'getDefaultImage',
  getPersonalForumAvatar: 'getPersonalForumAvatar',
  getPersonalForumBanner: 'getPersonalForumBanner',
  getPhoto: 'getPhoto',
  viewQuestionRecord: 'viewQuestionRecord',
  viewPaperRecord: 'viewPaperRecord',
  addExamsCategory: 'addExamsCategory',
  visitEditCategory: 'visitEditCategory',
  modifyExamsCategory: 'modifyExamsCategory',
  visitExamsQuestionAuth: 'visitExamsQuestionAuth',
  submitExamsQuestionAuth: 'submitExamsQuestionAuth',
  removeQuestion: 'removeQuestion',
  enabledQuestion: 'enabledQuestion',
  disabledQuestion: 'disabledQuestion',
  modifyQuestionAuthStatus: 'modifyQuestionAuthStatus',
  visitExamQuestionManagement: 'visitExamQuestionManagement',
  visitExperimentalStatus: 'visitExperimentalStatus',
  experimentalLogin: 'experimentalLogin',
  experimentalNoteSettings: 'experimentalNoteSettings',
  experimentalThreadCategorySettings: 'experimentalThreadCategorySettings',
  visitToolsManager: 'visitToolsManager',
  experimentalComplaintSettings: 'experimentalComplaintSettings',
  experimentalIPSettings: 'experimentalIPSettings',
  experimentalVisitSettings: 'experimentalVisitSettings',
  experimentalVerificationSettings: 'experimentalVerificationSettings',
  experimentalEditorSettings: 'experimentalEditorSettings',
  experimentalStickerSettings: 'experimentalStickerSettings',
  experimentalThreadSettings: 'experimentalThreadSettings',
  experimentalTransferKCB: 'experimentalTransferKCB',
  experimentalHidePostSettings: 'experimentalHidePostSettings',
  experimentalToppingSettings: 'experimentalToppingSettings',
  experimentalUsernameSettings: 'experimentalUsernameSettings',
  experimentalLoginSettings: 'experimentalLoginSettings',
  experimentalCacheSettings: 'experimentalCacheSettings',
  visitShopSettings: 'visitShopSettings',
  visitShopRefundList: 'visitShopRefundList',
  visitShopRefundDetail: 'visitShopRefundDetail',
  shopAgreeRefundApply: 'shopAgreeRefundApply',
  shopDisagreeRefundApply: 'shopDisagreeRefundApply',
  visitShopRefundSettings: 'visitShopRefundSettings',
  modifyShopRefundSettings: 'modifyShopRefundSettings',
  visitiShopProducts: 'visitiShopProducts',
  shopAdminBanProductSale: 'shopAdminBanProductSale',
  shopAdminClearBanSale: 'shopAdminClearBanSale',
  visitShopAuth: 'visitShopAuth',
  setShopAuth: 'setShopAuth',
  delShelfAuth: 'delShelfAuth',
  visitShopOpenStoreApplys: 'visitShopOpenStoreApplys',
  approveApplyStore: 'approveApplyStore',
  rejectApplyStore: 'rejectApplyStore',
  visitHomeSettingCarousel: 'visitHomeSettingCarousel',
  changeHomeSettingCarousel: 'changeHomeSettingCarousel',
  deleteHomeSettingCarousel: 'deleteHomeSettingCarousel',
  visitHomeSettingFeatured: 'visitHomeSettingFeatured',
  changeHomeSettingFeatured: 'changeHomeSettingFeatured',
  visitHomeSettingRecommendation: 'visitHomeSettingRecommendation',
  changeHomeSettingRecommendation: 'changeHomeSettingRecommendation',
  visitHomeSettingPopular: 'visitHomeSettingPopular',
  changeHomeSettingPopular: 'changeHomeSettingPopular',
  visitProtocolSetting: 'visitProtocolSetting',
  postNewProtocol: 'postNewProtocol',
  visitProtocolType: 'visitProtocolType',
  updateProtocolType: 'updateProtocolType',
  deleteProtocolType: 'deleteProtocolType',
  visitSmsSettings: 'visitSmsSettings',
  modifySmsSettings: 'modifySmsSettings',
  testSendMessage: 'testSendMessage',
  visitExperimentalEmailSettings: 'visitExperimentalEmailSettings',
  modifyEmailSettings: 'modifyEmailSettings',
  testSendEmail: 'testSendEmail',
  visitWebBaseSettings: 'visitWebBaseSettings',
  modifyWebBase: 'modifyWebBase',
  visitHomeTopSettings: 'visitHomeTopSettings',
  modifyHomeTopSettings: 'modifyHomeTopSettings',
  visitHomeNoticeSettings: 'visitHomeNoticeSettings',
  modifyHomeNoticeSettings: 'modifyHomeNoticeSettings',
  deleteHomeNotice: 'deleteHomeNotice',
  visitHomeListSettings: 'visitHomeListSettings',
  modifyHomeListSettings: 'modifyHomeListSettings',
  uploadHomeBigLogo: 'uploadHomeBigLogo',
  experimentalAppSettings: 'experimentalAppSettings',
  visitRoleSettings: 'visitRoleSettings',
  addRole: 'addRole',
  visitRoleUsers: 'visitRoleUsers',
  deleteRole: 'deleteRole',
  modifyRole: 'modifyRole',
  uploadRoleIcon: 'uploadRoleIcon',
  visitOperationSetting: 'visitOperationSetting',
  addOperationType: 'addOperationType',
  modifyOperation: 'modifyOperation',
  visitOperationType: 'visitOperationType',
  modifyOperationType: 'modifyOperationType',
  deleteOperationType: 'deleteOperationType',
  visitEUserSettings: 'visitEUserSettings',
  modifyEUserInfo: 'modifyEUserInfo',
  visitEUserInfo: 'visitEUserInfo',
  getUserAllScores: 'getUserAllScores',
  visitUserSensitiveInfo: 'visitUserSensitiveInfo',
  modifyUserSensitiveInfo: 'modifyUserSensitiveInfo',
  experimentalForumsSettings: 'experimentalForumsSettings',
  visitUsersGradeSettings: 'visitUsersGradeSettings',
  modifyUsersGradeSettings: 'modifyUsersGradeSettings',
  experimentalScoreSettings: 'experimentalScoreSettings',
  visitKcbSettings: 'visitKcbSettings',
  modifyKcbSettings: 'modifyKcbSettings',
  modifyWithdrawRecord: 'modifyWithdrawRecord',
  visitXsfSettings: 'visitXsfSettings',
  modifyXsfSettings: 'modifyXsfSettings',
  logParamsSetting: 'logParamsSetting',
  visitPageSettings: 'visitPageSettings',
  modifyPageSettings: 'modifyPageSettings',
  visitExamSettings: 'visitExamSettings',
  modifyExamSettings: 'modifyExamSettings',
  visitEMessageSettings: 'visitEMessageSettings',
  modifyEMessageSettings: 'modifyEMessageSettings',
  experimentalShareSettings: 'experimentalShareSettings',
  visitEPostSettings: 'visitEPostSettings',
  modifyEPostSettings: 'modifyEPostSettings',
  experimentalDocumentPostSettings: 'experimentalDocumentPostSettings',
  experimentalSubSettings: 'experimentalSubSettings',
  experimentalRegisterSettings: 'experimentalRegisterSettings',
  experimentalSafeSettings: 'experimentalSafeSettings',
  unverifiedPhonePage: 'unverifiedPhonePage',
  modifyBackendPassword: 'modifyBackendPassword',
  weakPasswordCheck: 'weakPasswordCheck',
  weakPasswordCheckResult: 'weakPasswordCheckResult',
  experimentalUserAuth: 'experimentalUserAuth',
  experimentalReviewSettings: 'experimentalReviewSettings',
  experimentalKeywordSettings: 'experimentalKeywordSettings',
  experimentalColumnSettings: 'experimentalColumnSettings',
  experimentalLibrarySettings: 'experimentalLibrarySettings',
  experimentalDownloadSettings: 'experimentalDownloadSettings',
  experimentalUploadSettings: 'experimentalUploadSettings',
  visitERedEnvelope: 'visitERedEnvelope',
  experimentalRechargeSettings: 'experimentalRechargeSettings',
  sensitiveWords: 'sensitiveWords',
  experimentalFundSettings: 'experimentalFundSettings',
  manageOauthApp: 'manageOauthApp',
  visitSystemInfo: 'visitSystemInfo',
  sendSystemInfo: 'sendSystemInfo',
  modifySystemInfo: 'modifySystemInfo',
  deleteSystemInfo: 'deleteSystemInfo',
  fuzzySearchUser: 'fuzzySearchUser',
  visitPublicLogs: 'visitPublicLogs',
  experimentalFilterLogs: 'experimentalFilterLogs',
  experimentalResourceLogs: 'experimentalResourceLogs',
  updateResourceInfo: 'updateResourceInfo',
  visitExperimentalBlacklist: 'visitExperimentalBlacklist',
  visitExperimentalShop: 'visitExperimentalShop',
  visitRecycleMarkThreads: 'visitRecycleMarkThreads',
  deletePublicLogs: 'deletePublicLogs',
  visitSecretLogs: 'visitSecretLogs',
  visitMessageLogs: 'visitMessageLogs',
  visitShareLogs: 'visitShareLogs',
  visitExperimentalLogs: 'visitExperimentalLogs',
  visitBehaviorLogs: 'visitBehaviorLogs',
  visitScoreLogs: 'visitScoreLogs',
  visitExperimentalKcb: 'visitExperimentalKcb',
  visitExperimentalDiffKcb: 'visitExperimentalDiffKcb',
  resetExperimentalDiffKcb: 'resetExperimentalDiffKcb',
  visitExperimentalXsf: 'visitExperimentalXsf',
  visitExperimentalRecharge: 'visitExperimentalRecharge',
  visitExperimentalWithdraw: 'visitExperimentalWithdraw',
  visitExperimentalExam: 'visitExperimentalExam',
  experimentalWarningLog: 'experimentalWarningLog',
  experimentalReviewLog: 'experimentalReviewLog',
  viewSmscodeRecord: 'viewSmscodeRecord',
  viewEmailcodeRecord: 'viewEmailcodeRecord',
  experimentalUserCodeLog: 'experimentalUserCodeLog',
  experimentalPayment: 'experimentalPayment',
  visitExperimentalConsole: 'visitExperimentalConsole',
  visitAuthList: 'visitAuthList',
  visitUserAuth: 'visitUserAuth',
  cancelSubmitVerify: 'cancelSubmitVerify',
  modifyUserVerifyStatus: 'modifyUserVerifyStatus',
  experimentalToolsFilter: 'experimentalToolsFilter',
  nkcManagement: 'nkcManagement',
  nkcManagementHome: 'nkcManagementHome',
  showActivityEnter: 'showActivityEnter',
  nkcManagementSticker: 'nkcManagementSticker',
  nkcManagementNote: 'nkcManagementNote',
  nkcManagementPost: 'nkcManagementPost',
  nkcManagementDocument: 'nkcManagementDocument',
  nkcManagementColumn: 'nkcManagementColumn',
  nkcManagementSection: 'nkcManagementSection',
  nkcManagementApplyForum: 'nkcManagementApplyForum',
  nkcManagementSecurityApplication: 'nkcManagementSecurityApplication',
  nkcManagementOS: 'nkcManagementOS',
  visitForumsCategory: 'visitForumsCategory',
  addForum: 'addForum',
  visitForumHome: 'visitForumHome',
  postToForum: 'postToForum',
  deleteForum: 'deleteForum',
  getForumChildForums: 'getForumChildForums',
  visitForumCard: 'visitForumCard',
  visitForumLatest: 'visitForumLatest',
  viewForumVisitors: 'viewForumVisitors',
  viewForumFollowers: 'viewForumFollowers',
  visitForumInfoSettings: 'visitForumInfoSettings',
  saveForumDeclare: 'saveForumDeclare',
  saveForumLatestBlockNotice: 'saveForumLatestBlockNotice',
  modifyForumInfo: 'modifyForumInfo',
  visitForumMergeSettings: 'visitForumMergeSettings',
  modifyMergeSettings: 'modifyMergeSettings',
  addForumKind: 'addForumKind',
  delForumKind: 'delForumKind',
  visitForumCategorySettings: 'visitForumCategorySettings',
  modifyForumCategory: 'modifyForumCategory',
  addForumCategory: 'addForumCategory',
  removeForumCategory: 'removeForumCategory',
  visitForumPermissionSettings: 'visitForumPermissionSettings',
  modifyForumPermission: 'modifyForumPermission',
  forumScoreSettings: 'forumScoreSettings',
  forumReviewSettings: 'forumReviewSettings',
  unSubscribeForum: 'unSubscribeForum',
  subscribeForum: 'subscribeForum',
  visitForumLibrary: 'visitForumLibrary',
  createForumLibrary: 'createForumLibrary',
  visitFundHome: 'visitFundHome',
  visitAddFund: 'visitAddFund',
  visitFundInfo: 'visitFundInfo',
  visitFundBills: 'visitFundBills',
  addFundBill: 'addFundBill',
  visitFundBill: 'visitFundBill',
  modifyFundBill: 'modifyFundBill',
  deleteFundBill: 'deleteFundBill',
  visitAddFundBill: 'visitAddFundBill',
  visitMyFund: 'visitMyFund',
  visitFundBlacklist: 'visitFundBlacklist',
  fundBlacklistPost: 'fundBlacklistPost',
  visitFundObjectList: 'visitFundObjectList',
  addFund: 'addFund',
  deleteFundObject: 'deleteFundObject',
  visitFundObjectHome: 'visitFundObjectHome',
  singleFundSettings: 'singleFundSettings',
  agreeFundTerms: 'agreeFundTerms',
  submitFundApplicationForm: 'submitFundApplicationForm',
  visitFundObjectBills: 'visitFundObjectBills',
  fundDonation: 'fundDonation',
  visitHistoryFundList: 'visitHistoryFundList',
  visitHistoryFund: 'visitHistoryFund',
  visitDisabledFundList: 'visitDisabledFundList',
  visitUnSubmitFundApplicationList: 'visitUnSubmitFundApplicationList',
  visitGiveUpFundApplicationList: 'visitGiveUpFundApplicationList',
  visitFundApplicationForm: 'visitFundApplicationForm',
  restoreFundApplicationForm: 'restoreFundApplicationForm',
  modifyApplicationForm: 'modifyApplicationForm',
  deleteApplicationForm: 'deleteApplicationForm',
  visitFundApplicationReport: 'visitFundApplicationReport',
  addFundApplicationReport: 'addFundApplicationReport',
  visitFundApplicationReportAudit: 'visitFundApplicationReportAudit',
  submitFundApplicationReportAudit: 'submitFundApplicationReportAudit',
  deleteFundApplicationReport: 'deleteFundApplicationReport',
  visitFundApplicationFormSettings: 'visitFundApplicationFormSettings',
  visitFundApplicationAudit: 'visitFundApplicationAudit',
  submitFundApplicationAudit: 'submitFundApplicationAudit',
  stopFundApplicationForm: 'stopFundApplicationForm',
  timeoutFundApplicationForm: 'timeoutFundApplicationForm',
  withdrawFundApplicationForm: 'withdrawFundApplicationForm',
  refundFundApplicationForm: 'refundFundApplicationForm',
  modifyFundApplicationMember: 'modifyFundApplicationMember',
  submitFundApplicationVote: 'submitFundApplicationVote',
  visitFundApplicationComplete: 'visitFundApplicationComplete',
  submitFundApplicationComplete: 'submitFundApplicationComplete',
  visitFundApplicationCompleteAudit: 'visitFundApplicationCompleteAudit',
  submitFundApplicationCompleteAudit: 'submitFundApplicationCompleteAudit',
  visitFundApplicationRemittance: 'visitFundApplicationRemittance',
  submitFundApplicationRemittance: 'submitFundApplicationRemittance',
  visitFundApplyRemittance: 'visitFundApplyRemittance',
  submitFundApplyRemittance: 'submitFundApplyRemittance',
  confirmationFundRemittance: 'confirmationFundRemittance',
  fundApplicationFormExcellent: 'fundApplicationFormExcellent',
  modifyFundApplicationFormStatus: 'modifyFundApplicationFormStatus',
  fundApplicationFormRefund: 'fundApplicationFormRefund',
  homeHotColumn: 'homeHotColumn',
  homeToppedColumn: 'homeToppedColumn',
  column_single_disabled: 'column_single_disabled',
  cancelXsf: 'cancelXsf',
  modifyKcbRecordReason: 'modifyKcbRecordReason',
  visitPostHistory: 'visitPostHistory',
  disableHistories: 'disableHistories',
  rollbackPost: 'rollbackPost',
  digestPost: 'digestPost',
  unDigestPost: 'unDigestPost',
  postWarningPost: 'postWarningPost',
  postWarningPatch: 'postWarningPatch',
  getPostAuthor: 'getPostAuthor',
  anonymousPost: 'anonymousPost',
  disablePostNotice: 'disablePostNotice',
  postCommentControl: 'postCommentControl',
  visitProblemList: 'visitProblemList',
  visitProblem: 'visitProblem',
  modifyProblem: 'modifyProblem',
  deleteProblem: 'deleteProblem',
  modifyReasonThreadReturn: 'modifyReasonThreadReturn',
  toppedThread: 'toppedThread',
  unToppedThread: 'unToppedThread',
  pushThread: 'pushThread',
  homeTop: 'homeTop',
  homeAd: 'homeAd',
  closeThread: 'closeThread',
  openThread: 'openThread',
  subThread: 'subThread',
  unSubThread: 'unSubThread',
  searchUser: 'searchUser',
  visitVerifiedUpload: 'visitVerifiedUpload',
  clearUserInfo: 'clearUserInfo',
  hideUserHome: 'hideUserHome',
  unBannedUser: 'unBannedUser',
  bannedUser: 'bannedUser',
  visitUserTransaction: 'visitUserTransaction',
  violationRecord: 'violationRecord',
  getUserOtherAccount: 'getUserOtherAccount',
  findPasswordVerifyMobile: 'findPasswordVerifyMobile',
  findPasswordVerifyEmail: 'findPasswordVerifyEmail',
  APPgetScoreChange: 'APPgetScoreChange',
  blockCurrentActivity: 'blockCurrentActivity',
  unBlockCurrentActivity: 'unBlockCurrentActivity',
  messageBlackList: 'messageBlackList',
  sendMessageToUser: 'sendMessageToUser',
  getFriendNotePicture: 'getFriendNotePicture',
  visitHomeSubscription: 'visitHomeSubscription',
  pushGoodsToHome: 'pushGoodsToHome',
  banSaleProductParams: 'banSaleProductParams',
  visitManageRouter: 'visitManageRouter',
  visitManageIndex: 'visitManageIndex',
  visitStoreIndex: 'visitStoreIndex',
  saveNewEditPicture: 'saveNewEditPicture',
  getOriginId: 'getOriginId',
  complaintGet: 'complaintGet',
  complaintResolvePost: 'complaintResolvePost',
  review: 'review',
  moveThreads: 'moveThreads',
  movePostsToDraft: 'movePostsToDraft',
  movePostsToRecycle: 'movePostsToRecycle',
  unblockPosts: 'unblockPosts',
  getLibraryLogs: 'getLibraryLogs',

  uploadTool: 'uploadTool',
  updateTool: 'updateTool',
  deleteTool: 'deleteTool',
  hideTool: 'hideTool',
  enableSiteTools: 'enableSiteTools',
  ipinfo: 'ipinfo',
  postAliPayInfo: 'postAliPayInfo',
  creationCenterDeleteList: 'creationCenterDeleteList',
  creationCenterMoveList: 'creationCenterMoveList',
  creationCenterAddList: 'creationCenterAddList',
  publishMoment: 'publishMoment',
  publishMomentComment: 'publishMomentComment',
  test: 'test',
  modifyComment: 'modifyComment',
  deleteComment: 'deleteComment',
  disabledComment: 'disabledComment',
  getCommentIpInfo: 'getCommentIpInfo',
  digestComment: 'digestComment',
  unDigestComment: 'unDigestComment',
  manageZoneArticleCategory: 'manageZoneArticleCategory',
  deleteArticle: 'deleteArticle',
  unblockArticle: 'unblockArticle',
  digestArticle: 'digestArticle',
  unDigestArticle: 'unDigestArticle',
  managementMoment: 'managementMoment',
  getMomentIpInfo: 'getMomentIpInfo',
  manageQuestionTags: 'manageQuestionTags',
  createQuestionTags: 'createQuestionTags',
  modifyThreadOrder: 'modifyThreadOrder',
  setMomentVisibleOther: 'setMomentVisibleOther',
  viewOtherUserAbnormalMoment: 'viewOtherUserAbnormalMoment',
  editOtherUserMoment: 'editOtherUserMoment',
  visitZoneMomentHistory: 'visitZoneMomentHistory',
  rollbackZoneMomentHistory: 'rollbackZoneMomentHistory',
  visitOtherUserZoneMomentHistory: 'visitOtherUserZoneMomentHistory',
  disableResource: 'disabledResource',
};

const Operations = { ...DynamicOperations, ...FixedOperations };

module.exports = {
  Operations,
  DynamicOperations,
  FixedOperations,
};
