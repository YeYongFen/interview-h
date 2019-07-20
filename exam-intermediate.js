const crypto = require('crypto');
const axios = require('axios');

const url = 'https://easy-mock.com/mock/5bbefdf6faedce31cd6a5261/example/exam-intermediate';

module.exports = function (config, cb) {
  const errorMsg = [];
  config = config || {};
  let param = null;

  !config.accessKeyID && errorMsg.push('accessKeyID required');
  !config.accessKeySecret && errorMsg.push('accessKeySecret required');
  !config.accountName && errorMsg.push('accountName required');

  config.action == 'single' && !config.toAddress && errorMsg.push('toAddress required');
  config.action == 'batch' && !config.templateName && errorMsg.push('templateName required');
  config.action == 'batch' && !config.receiversName && errorMsg.push('receiversName required');

  if (errorMsg.length > 0) {
    return Promise.reject(errorMsg.join(','));
  }

  if (config.action == 'single') {
    param = {
      ...getParam(config),
      ReplyToAddress: !!config.replyToAddress,
      ToAddress: config.toAddress,
    };
    config.fromAlias && (param.FromAlias = config.fromAlias);
    config.subject && (param.Subject = config.subject);
    config.htmlBody && (param.HtmlBody = config.htmlBody);
    config.textBody && (param.TextBody = config.textBody);
  } else if (config.action == 'batch') {
    param = {
      ...getParam(config),
      TemplateName: config.templateName,
      ReceiversName: config.receiversName,
    };
    config.tagName && (param.TagName = config.tagName);
  }

  if (!param) {
    return Promise.reject('error action');
  };

  let reqBody = cryptoRequestBody(param, config.accessKeySecret);

  return axios.post(url, reqBody, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then((resp) => {
    return resp.data;
  });
};

function cryptoRequestBody (param, accessKeySecret) {
  let signStr = [];
  for (let i in param) {
    signStr.push(encodeURIComponent(i) + '=' + encodeURIComponent(param[i]));
  }
  signStr.sort();
  signStr = signStr.join('&');
  signStr = 'POST&%2F&' + encodeURIComponent(signStr);
  const sign = crypto.createHmac('sha1', accessKeySecret + '&')
    .update(signStr)
    .digest('base64');
  const signature = encodeURIComponent(sign);
  let reqBody = ['Signature=' + signature];
  for (let i in param) {
    reqBody.push(i + '=' + param[i]);
  }

  return reqBody;
}

function getParam (config) {
  const date = new Date();
  const nonce = date.getTime();

  return {
    AccessKeyId: config.accessKeyID,
    Action: config.action,
    Format: 'JSON',
    AccountName: config.accountName,
    AddressType: typeof config.addressType == 'undefined' ? 0 : config.addressType,

    SignatureMethod: 'HMAC-SHA1',
    SignatureNonce: nonce,
    SignatureVersion: '1.0',
    TemplateCode: config.templateCode,
    Timestamp: date.toISOString(),
    Version: '2015-11-23',
  };
}
