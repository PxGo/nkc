module.exports = {
  GET: "nkcManagement",
  POST: "nkcManagement",
  home: {
    GET: "nkcManagementHome",
    POST: "nkcManagementHome",
    PUT: "nkcManagementHome",
    showActivityEnter: {
      PUT: "showActivityEnter"
    },
    block: {
      POST: 'nkcManagementHome',
      PUT: 'nkcManagementHome',
      PARAMETER: {
        GET: 'nkcManagementHome',
        PUT: 'nkcManagementHome',
        DELETE: 'nkcManagementHome',
        disabled: {
          PUT: 'nkcManagementHome',
        },
        refresh: {
          POST: 'nkcManagementHome'
        }
      }
    }
  },
  sticker: {
    GET: "nkcManagementSticker",
    POST: "nkcManagementSticker"
  },
  note: {
    GET: "nkcManagementNote",
    POST: "nkcManagementNote"
  },
  post: {
    GET: "nkcManagementPost",
    POST: "nkcManagementPost"
  },
  document: {
    GET: "nkcManagementDocument",
    POST: "nkcManagementDocument"
  },
  column: {
    GET: "nkcManagementColumn",
    POST: 'nkcManagementColumn',
  },
  section: {
    GET: "nkcManagementSection",
    POST: "nkcManagementSection"
  },
  applyForum: {
    GET: 'nkcManagementApplyForum',
    POST: "nkcManagementApplyForum"
  },
  securityApplication: {
    GET: 'nkcManagementSecurityApplication',
    POST: 'nkcManagementSecurityApplication'
  },
  os: {
    GET: 'nkcManagementOS'
  }
};
