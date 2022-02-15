module.exports = {
  POST: "publishComment",
  GET: "getComments",
  PARAMETER: {
    PUT: "modifyComment",
    DELETE: "deleteComment",
    GET: "getComments",
    quote: {
      GET: "getComments"
    },
    commentEditor: {
      GET: "getComments"
    },
    disabled: {
      POST: "disabledComment"
    },
    unblock: {
      POST: "disabledComment"
    }
  }
}
