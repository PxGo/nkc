const { Operations } = require('./operations.js');
module.exports = {
  usersBehavior: [
    Operations.visitUserCard,
    Operations.visitHome,
    Operations.postToForum,
    Operations.visitForumLatest,
    Operations.viewForumFollowers,
    Operations.submitLogin,
    Operations.logout,
    Operations.visitPost,
    Operations.visitThread,
    Operations.collectThread,
    Operations.visitForumHome,
    Operations.viewForumVisitors,
    Operations.unSubscribeForum,
    Operations.subscribeForum,
    Operations.postToThread,
    Operations.subscribeUser,
    Operations.unSubscribeUser,
    Operations['post-vote-up'],
    Operations['post-vote-down'],
  ],
  timeLine: [Operations.postToForum, Operations.postToThread],
  experimental: [
    Operations.modifyWebBase,
    Operations.addRole,
    Operations.deleteOperationType,
    Operations.addForum,
    Operations.modifyForumInfo,
    Operations.addForumCategory,
    Operations.modifyForumPermission,
    Operations.modifyFundBill,
    Operations.deleteFundBill,
    Operations.addFund,
    Operations.deleteFundObject,
    Operations.disableHistories,
    Operations.modifyQuestion,
    Operations.toppedThread,
    Operations.deleteRole,
    Operations.addOperationType,
    Operations.modifyOperation,
    Operations.modifyOperationType,
    Operations.modifyUsersGradeSettings,
    Operations.modifyKcbSettings,
    Operations.logParamsSettingModify,
    Operations.sendSystemInfo,
    Operations.deleteForum,
    Operations.modifyForumCategory,
    Operations.addFundBill,
    Operations.unToppedThread,
  ],
  files: [
    Operations.getAttachment,
    Operations.getUserAvatar,
    Operations.getActivityPoster,
    Operations.getResources,
    Operations.getMediums,
    Operations.getDefaultImage,
    Operations.getOrigins,
    Operations.getSiteSpecific,
    Operations.getAttachmentIcon,
    Operations.getPhoto,
    Operations.getSmallPhoto,
    Operations.getMessageFile,
  ],
  whitelistOfGlobalAccessControl: [
    Operations.getLeftDrawData,
    Operations.getUserDrawData,
    Operations.getUserNavData,
    Operations.logout,
    Operations.visitLogin,
    Operations.submitLogin,
    Operations.getRegisterCode,
    Operations.submitRegister,
    Operations.sendLoginMessage,
    Operations.getVerifications,
    Operations.registerSubscribe,
    Operations.sendRegisterMessage,
    Operations.sendGetBackPasswordMessage,
    Operations.sendPhoneMessage,

    Operations.visitFindPasswordByMobile, // 忘记密码相关
    Operations.visitFindPasswordByEmail,
    Operations.findPasswordVerifyMobile,
    Operations.modifyPasswordByMobile,
    Operations.findPasswordSendVerifyEmail,
    Operations.modifyPasswordByEmail,
    Operations.findPasswordVerifyEmail,

    Operations.visitAppDownload, // app 相关
    Operations.downloadApp,
    Operations.APPcheckout,
    Operations.APPGetAccountInfo,
    Operations.APPGetNav,
    Operations.APPGetMy,
    Operations.appGetDownload,

    Operations.rechargePost, // 支付相关
    Operations.receiveAliPayPaymentInfo,
    Operations.receiveWeChatPaymentInfo,
    Operations.fundDonation,
  ],
  whitelistOfClosedFund: [],
  fileDownload: [
    Operations.getResources,
    Operations.getAttachment,
    Operations.getSiteSpecific,
    Operations.visitVerifiedUpload,
    Operations.auditorVisitVerifiedUpload,
    Operations.getMessageFile,
    Operations.getResourceCover,
    Operations.getSticker,
  ],
};
