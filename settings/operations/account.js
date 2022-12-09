module.exports = {
  finance: {
    recharge: {
      GET: 'accountRecharge',
      POST: 'rechargePost',
      payment: {
        POST: 'accountRecharge'
      }
    },
    withdraw: {
      GET: 'accountWithdraw',
      POST: "accountWithdraw"
    },
    exchange: {
      GET: 'accountExchange',
      POST: 'accountExchange'
    }
  },
  contribute: {
    GET: "visitUserContribute"
  },
  subscribes: {
    GET: "account_subscribe",
    PUT: "account_subscribe",
  },
  subscribe_settings: {
    GET: 'account_subscribe',
  },
  subscribe_types: {
    GET: "account_subscribe",
    POST: "account_subscribe",
    PARAMETER: {
      DELETE: "account_subscribe",
      PUT: "account_subscribe"
    }
  }
}
