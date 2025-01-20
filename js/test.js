const TwoCaptcha = require("2captcha");
const solver = new TwoCaptcha.Solver("cd217f449b7fa57d7951d312bdf00ecb");
const puppeteer = require("puppeteer");
const FB_EMAIL = "0326581043";
const FB_PASSWORD = "Teo17072003@@";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Truy cập Facebook
    await page.goto("https://www.facebook.com/");

    // Điền thông tin đăng nhập
    await page.type("#email", FB_EMAIL, { delay: 100 });
    await page.type("#pass", FB_PASSWORD, { delay: 100 });

    // Nhấn nút đăng nhập
    await Promise.all([
      page.click('button[name="login"]'),
      page.waitForNavigation({ waitUntil: "networkidle2" }),
    ]);

    console.log("Đăng nhập thành công!");

    // Nếu gặp reCAPTCHA, giải CAPTCHA
    const captchaFrame = await page
      .frames()
      .find((f) => f.url().includes("api2/anchor")); // Tìm iframe chứa reCAPTCHA
    if (captchaFrame) {
      console.log("Captcha detected, solving...");

      const siteKey = await captchaFrame.$eval("div.g-recaptcha", (el) =>
        el.getAttribute("data-sitekey")
      ); // Lấy sitekey của reCAPTCHA

      // Gửi yêu cầu giải CAPTCHA đến 2Captcha
      const result = await solver.solveRecaptchaV2({
        sitekey: siteKey,
        url: page.url(),
      });

      console.log("Captcha solution:", result);

      // Nhập mã giải CAPTCHA vào trang
      await page.evaluate((token) => {
        document.getElementById("g-recaptcha-response").innerHTML = token;
      }, result.token);

      // Nhấn nút xác nhận
      await page.click("#recaptcha-verify-button");
      await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10 });

      console.log("Captcha solved and verified!");
    }
  } catch (error) {
    console.error("Có lỗi xảy ra:", error);
  } finally {
  }
})();
