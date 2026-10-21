import * as puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { ConfigType } from "./ConfigType";

// ==================== HELPER FUNCTIONS ====================
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class BookingAutomation {
  config: ConfigType;
  browser: puppeteer.Browser | null;
  profileDir: string;
  sessionFile: string;
  logDir: string | undefined;
  bookingUrl: string | undefined;

  constructor(config: ConfigType) {
    this.config = config;
    this.browser = null;
    this.profileDir = config.profileDir;
    this.sessionFile = path.join(this.profileDir, "session.json");
    this.logDir = config.logDir;
    this.bookingUrl = config.bookingUrl;
  }

  async createBrowser(headless = true) {
    if (!fs.existsSync(this.profileDir)) {
      fs.mkdirSync(this.profileDir, { recursive: true });
    }

    if (this.browser) {
      await this.browser.close();
    }

    // is there need. looks like an override
    //callers can decide whether to run headless or not based on debug flag. If debug is true, we want to force headless to false, otherwise use the passed value.
    if (this.config.debug) {
      //headless = false; //no need for now.
    }

    /**
     * TODO: Test and come back here to check the override of headless mode. If debug is true, we want to force headless to false, otherwise use the passed value.
     * This is to ensure that when debug mode is on, we always see the browser for debugging purposes.
     * If debug mode is off, we can use the headless parameter to determine whether to run in headless mode or not.
     */
    const launchConfig = {
      headless: headless, //!this.config.debug, //headless, // test mode first...//headless ? true : false,
      userDataDir: this.profileDir,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        ...(headless
          ? [
              "--disable-gpu",
              "--disable-software-rasterizer",
              "--disable-extensions",
              "--disable-sync",
              "--no-first-run",
            ]
          : []),
      ],
    };

    console.log(
      ` Launching browser in ${headless ? "HEADLESS" : "VISIBLE"} mode...`,
    );
    this.browser = await puppeteer.launch(launchConfig);
    return this.browser;
  }

  async createPage(manual = false) {
    if (!this.browser) {
      throw new Error("Browser not initialized");
    }

    const w = manual ? 640 : 1920;
    const h = manual ? 480 : 1080;

    const page = await this.browser.newPage();
    await page.setViewport({ width: w, height: h }); //({ width: 1920, height: 1080 });
    await page.setUserAgent({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    page.setDefaultTimeout(this.config.timeout);
    page.setDefaultNavigationTimeout(this.config.timeout);

    return page;
  }

  async isSessionValid(page: puppeteer.Page) {
    const url = this.bookingUrl ?? "";
    try {
      console.log(" Checking session...");

      await page.goto(url, {
        waitUntil: "domcontentloaded", // "networkidle2",
        timeout: 30000,
      });

      const loginElement = await page.$(
        '[data-capla-component-boundary="b-checkout-bp-accommodation/Authentication"]',
      );
      // if (!loginElement) return false;
      //return loginElement !== null;
      const isSignedIn = await loginElement?.$("::-p-text(You are signed in)");
      if (isSignedIn) return true;
      return false;
    } catch (error: any) {
      console.error("Session check error:", error.message);
      return false;
    }
  }

  async manualLogin() {
    console.log("\n=== MANUAL LOGIN REQUIRED ===");
    console.log("Switching to visible browser for login...");

    if (this.browser) {
      await this.browser.close();
    }

    await this.createBrowser(false);
    const page = await this.createPage(true);

    console.log("\n Login Instructions:");
    console.log("1. Log in with your Google account");
    console.log("2. Complete 2FA if prompted");
    console.log("3. Wait for Google Cloud Console to load");
    console.log("4. Script will auto-detect successful login\n");

    // Navigate directly to the audience page so we know exactly where to expect
    const targetUrl = this.bookingUrl ?? "";
    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded", // "networkidle2",
      timeout: 60000,
    });

    console.log(" Waiting for login...");

    try {
      while (true) {
        const state = await this.isSessionValid(page);
        if (state === true) {
          // login detected
          console.log(" ✅ Login detected");
          break;
        }

        await delay(1500);
      }
    } catch (error: any) {
      console.error(" Login timeout");
      //await page.screenshot({ path: `${this.logDir}/login-timeout.png`, fullPage: true });
      throw error;
    }

    console.log(" Login successful! Saving session...");

    const cookies = await page.cookies();
    fs.writeFileSync(
      path.join(this.profileDir, "cookies.json"),
      JSON.stringify(cookies, null, 2),
    );

    fs.writeFileSync(
      this.sessionFile,
      JSON.stringify(
        {
          lastLogin: new Date().toISOString(),
          sessionValid: true,
        },
        null,
        2,
      ),
    );

    // Small settle delay before closing
    await delay(1200);

    if (this.browser) {
      await this.browser.close();
    }
    console.log("🔄 Switching to headless mode...");
    await this.createBrowser(true);

    return true;
  }

  async hotelEmail(page:puppeteer.Page) {
    

    //example email ------- 5876905289-gapd.uvje.cyva.pupb@property.booking.com

    //////save results
    // Objects to hold your results in Node.js
    const success = {
      calls: [] as string[],
      emails: [] as string[],
    };

    // 1. Expose a function from Node.js to the Browser context
    await page.exposeFunction(
      "logCapturedAction",
      (type: "email" | "call", value: string) => {
        if (type === "email") {
            if (value.length > 0)
                success.emails.push(value);
        }
        if (type === "call") {
            if (value.length > 0)
                success.calls.push(value);
        }
        console.log(`Captured ${type}:`, value);
      },
    );

    //2. trigger happy
    // Overwrite window.open inside the browser context
    await page.evaluate(() => {
      window.open = (
        url?: string | URL,
        target?: string,
        features?: string,
      ): Window | null => {
        const urlStr = String(url);

        if (urlStr.startsWith("mailto:")) {
          (window as any).logCapturedAction(
            "email",
            urlStr.replace("mailto:", ""),
          );
          return null; // Blocks the window from opening
        }
        if (urlStr.startsWith("tel:")) {
          (window as any).logCapturedAction("call", urlStr.replace("tel:", ""));
          return null; // Blocks the window from opening
        }

        // Fallback if your script opens standard pages too
        console.log("Allowed standard window open to:", urlStr);
        return null;
      };
    });

    //if (success.emails.length === 0) {}

    // 2. Inject JavaScript to intercept window.location assignments -- standard not trigger happy
    await page.evaluateOnNewDocument(() => {
      // We mock a custom property handler for the window object
      let currentHref = window.location.href;

      Object.defineProperty(window, "location", {
        get() {
          return {
            // Return standard properties so the site doesn't break
            get href() {
              return currentHref;
            },
            set href(val: string) {
              if (val.startsWith("mailto:")) {
                (window as any).logCapturedAction(
                  "email",
                  val.replace("mailto:", ""),
                );
                return; // Stops the execution!
              }
              if (val.startsWith("tel:")) {
                (window as any).logCapturedAction(
                  "call",
                  val.replace("tel:", ""),
                );
                return; // Stops the execution!
              }
              currentHref = val;
            },
          };
        },
        configurable: true,
      });
    });

    await page.locator(".js-bp-submit-button--complete-booking").click();

    /******************************************************* */

    return success;
  }

  async testBooking() {
    const url = this.bookingUrl ?? "";
    const page = await this.createPage();
    
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded", // "networkidle2",
        timeout: 30000,
      });
    } catch (e) {}

    return await this.hotelEmail(page);

  }
  async proceedToBooking() {
    const url = this.bookingUrl ?? "";
    const page = await this.createPage();

    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded", // "networkidle2",
        timeout: 30000,
      });
    } catch (e) {}

    const results = { successful: [] as string[], failed: [] as string[] };

    for (let i = 0; i < this.config.emailsToAdd.length; i++) {}

    // current page
    /***
     * https://secure.booking.com/book.html?hotel_id=10004460&occupancy_setup_issue_flags=&aid=304142&label=mkt123sc-c4a034bf-2cc1-4b56-bd4f-336b82372a4b&sid=5b75ab07b2a08790ac84478b20086914&room1=A%2CA&error_url=%2Fhotel%2Fke%2Fniger-house-2-bedroom-house-naivasha.en-gb.html%3Faid%3D304142%26label%3Dmkt123sc-c4a034bf-2cc1-4b56-bd4f-336b82372a4b%26sid%3D5b75ab07b2a08790ac84478b20086914%26srpvid%3Daf303b25f5240917%26%26&hostname=www.booking.com&stage=1&checkin=2026-10-24&interval=7&children_extrabeds=&srpvid=af303b25f5240917&hp_visits_num=1&rt_pos_selected=1&rt_pos_selected_within_room=1&rt_selected_block_position=1&rt_num_blocks=1&rt_num_rooms=1&rt_num_blocks_per_room=%7B%221000446001%22%3A1%7D&rt_selected_blocks_info=&rt_relevance_metric_id=f9fb2830-ed95-4645-a922-77e31f025bae&rt_pageview_id=15c53b3152cb05e6&rt_pos_final=1.1&rt_selected_total_price=195&rt_cheapest_search_price=195&rt_with_no_dimensions=1&from_source=hotel&rt_fetch_room_table_time=1792571104.12609&nr_rooms_1000446001_372861490_4_0_0=1&basket_id=72cf8667-eda0-45f0-9e89-451746f4adc2
     */
    /***
     * final page
     *
     * https://secure.booking.com/book.html?aid=304142&label=mkt123sc-c4a034bf-2cc1-4b56-bd4f-336b82372a4b&selected_currency=KES&lang=en-gb&sid=5b75ab07b2a08790ac84478b20086914&checkin=2026-10-24&checkout=2026-10-31&basket_id=72cf8667-eda0-45f0-9e89-451746f4adc2&
     *
     * completed booking --succcess page
     * https://secure.booking.com/confirmation.en-gb.html?aid=304142&label=mkt123sc-c4a034bf-2cc1-4b56-bd4f-336b82372a4b&sid=5b75ab07b2a08790ac84478b20086914&auth_key=hKOn13eUZwATQEi7&bp_travel_purpose=leisure&hostname=www.booking.com&pfi=10515876905289&pre_price=195.3001&rt_num_blocks=1&source=book&srpvid=af303b25f5240917&ua_created=0&
     */
    // go to next:final details
    const finalDetailsBtn = await page.$(".js-bp-submit-button--next-step"); //page.$('.js-button__text');
    finalDetailsBtn?.click();
    await delay(1200); //small timeout before finalizing

    return await this.hotelEmail(page);
    

  }

  /*=================== end of class=======================*/
  async run() {
    try {
      await this.createBrowser(!this.config.debug);
      const page = await this.createPage();

      const checkIsSessValid = await this.isSessionValid(page);

      if (!checkIsSessValid) {
        console.log("  Session required. Initiating manual login...");
        await this.manualLogin(); // This handles its own visible → headless switch
      } else {
        console.log(" Using existing session");
      }

      const results = await this.testBooking(); // await this.proceedToBooking();
      return results;
    } catch (e) {
      console.log(
        "\n  Error attempting to create browser or page. Please log in again.",
      );
    }
  }
}

export default BookingAutomation;
