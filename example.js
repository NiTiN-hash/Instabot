const puppeteer = require('puppeteer');
const credentials = require('./credentials');

let sessionCookies

async function autoFollow () {
  
    browser = await puppeteer.launch({
    headless: false,
    args: [
      '--window-size=900,1600'
    ]
  })

  const page = await browser.newPage()
  page.setViewport({height: 900, width: 1500})
  
  if (sessionCookies) {
    await page.setCookie(...sessionCookies)
    await page.goto('https://www.instagram.com/')
    
  } else {
    await page.goto('https://www.instagram.com/accounts/login')
    
   
    await page.waitForFunction(() => document.querySelectorAll('input').length)

    await page.type('[name=username]', credentials.username)
    await page.type('[name=password]', credentials.password)
    
    const linkHandler = await page.$x('//*[@id="loginForm"]/div[1]/div[3]/button/div')
    await linkHandler[0].click()
    await page.waitForFunction(() => document.querySelector('[placeholder=Search]'))
    const loginfo = await page.$x('//*[@id="react-root"]/section/main/div/div/div/div/button')
    await loginfo[0].click()
    
  }
    
      //await page.waitForTimeout(2000)
      await page.waitForXPath("//div//button[@class='_a9-- _a9_1' and contains(text(),'Not Now')]")
      const notify = await page.$x("//div//button[@class='_a9-- _a9_1' and contains(text(),'Not Now')]")
      await notify[0].click()
      // await page.evaluate(() => {
      //   if (document.queryselector("_a9-- _a9_1")){
      //     document.queryselector("_a9-- _a9_1").click

      // }
      // })

  //await page.waitForFunction(() => document.querySelector('[placeholder=Search]'))
  await page.evaluate(() => document.querySelector('[href="/accounts/activity/"]').click())
  
  sessionCookies = await page.cookies()

  // await page.waitForFunction(() => document.querySelector('[href="/accounts/activity/"]')
  // .parentnode
  // .querySelector('[role=dialog]'))
  // .parentnode
  // .querySelectorAll('[role=button]').length

  //await page.waitForFunction(() => document.querySelector('[placeholder=Search]'))

   await page.waitForFunction(() => document.querySelectorAll('._acan._acap').length)

   await page.evaluate(() => {
     const elements = document.querySelectorAll('._acan._acap')

     elements.forEach(element => {
       if (element.innerText === 'Follow') {
         element.click()
       }
     })
   })

  await page.waitForTimeout(40000)

  await browser.close()

  autoFollow()
 

}

autoFollow()