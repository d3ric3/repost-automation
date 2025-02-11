const puppeteer = require("puppeteer");
const readlineSync = require("readline-sync");

async function main() {
  // Prompt user for username and password
  const username = readlineSync.question("Enter your username: ");
  const password = readlineSync.question("Enter your password: ", {
    hideEchoBack: true,
  });

  // Set up Puppeteer
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--window-size=1920,1080"],
  });
  const page = await browser.newPage();

  try {
    // Set screen size.
    const desiredWidth = 1920; //1080; //1920;
    const desiredHeight = 1080; //1024; //1080;
    const sf = 1.4;

    await page.setViewport({
      width: parseInt(desiredWidth / sf),
      height: parseInt(desiredHeight / sf),
      deviceScaleFactor: sf,
    });

    // Navigate to edgeprop.my
    await page.goto("https://edgeprop.my");

    // Wait for the adv banner page to load
    await delay(4000);

    // // Click on the x button to close the adv banner
    // await page.click("div.sto_full_btn-close");

    // Wait for login menu
    await page.waitForSelector('a[data-target="#loginModal"]');

    // Click on login menu
    await page.click('a[data-target="#loginModal"]');

    // Wait for login form popup model
    await page.waitForSelector("div.login-form-container");

    // Enter credentials and submit
    await page.type('input[name="emailOrPhone"]', username);
    await page.type('input[name="password"]', password);
    await page.click("button.login-button");

    // Wait for the login to complete
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // Navigate to dashboard
    await page.goto("https://list.edgeprop.my/#/dashboard");

    // Wait for the page to finish loading
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // Navigate to listings page
    await page.goto("https://list.edgeprop.my/#/listings/view/Active#tab");

    // Wait for the page to finish loading
    await delay(4000);

    // scroll down 200 pixels
    await page.mouse.wheel({
      deltaY: 200,
    });

    // Wait for the page to finish loading
    await delay(2000);

    // Select display 300 listings on page
    await page.select("#pagination", "600");

    // Wait for the page to finish loading
    await delay(4000);

    // Repost Rent and Sale every 30 mins
    while (true) {
      await repostRentListing(page);

      // Wait for the page to finish loading
      await delay(4000);

      await repostSaleListing(page);

      // Wait for 30 mins
      await delay(30 * 60000);
    }
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  } finally {
    // Close the browser
    //await browser.close();
  }
}

function delay(millisecond) {
  return new Promise(function (resolve) {
    setTimeout(resolve, millisecond);
  });
}

async function repostRentListing(page) {
  // Click Rent listing
  await page.click("div.total_design:nth-child(2) > div");

  // Wait for the page to finish loading
  await delay(2000);

  // Click select all checkbox
  await page.click("label.d-block.checkbox-pad");

  // Wait for the page to finish loading
  await delay(2000);

  // Click Repost button
  await page.click("div.btn_width > button");

  // Wait for the page to finish loading
  await delay(4000);

  // Click ok button "successfully repost"
  await page.click("button.swal-button--confirm");
}

async function repostSaleListing(page) {
  // Click Sale listing
  await page.click("div.total_design:nth-child(1) > div");

  // Wait for the page to finish loading
  await delay(2000);

  // Click select all checkbox
  await page.click("label.d-block.checkbox-pad");

  // Wait for the page to finish loading
  await delay(2000);

  // Click Repost button
  await page.click("div.btn_width > button");

  // Wait for the page to finish loading
  await delay(4000);

  // Click ok button "successfully repost"
  await page.click("button.swal-button--confirm");
}

main();
