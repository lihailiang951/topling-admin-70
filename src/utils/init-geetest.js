import '@/vendor/gt'

export default function () {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    window.initGeetest(options, captchaObj => {
      resolve(captchaObj)
    })
  })
}
