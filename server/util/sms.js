const Core = require('@alicloud/pop-core');
const { smsConfig } = require('../util/variable.js')

module.exports = async (to, code) => {
  let client = new Core(smsConfig);
  let params = {
    "PhoneNumbers": to,
    "SignName": "历程网",
    "TemplateCode": "SMS_215995369",
    "TemplateParam": `{"code":"${code}"}`
  };
  return await client.request('SendSms', params, { method: 'POST' }).then(
    (result) => {
      if (result.Code === 'OK') {
        return 1
      } else {
        return -1;
      }
    }).catch(() => {
      return -1;
    })
}

