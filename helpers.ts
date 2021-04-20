import { Browser, Page } from 'puppeteer';

require('dotenv').config();

const puppeteer = require('puppeteer');

let browser: Browser;
let page: Page;

const getAllFreeCourseURLs = async () => {
    try {
        // Wait for page to load course cards
        await page.waitForSelector('.browse-course-card--link--3KIkQ');

        // Get all course anchor elements with selector
        const courses = await page.$$('.browse-course-card--link--3KIkQ');

        let urls = [];

        for (let course of courses) {
            // Get course URL from course anchor element
            const url = await (await course.getProperty('href')).jsonValue();

            // Add URL to array of URLs
            urls.push(url);
        }

        return urls;
    } catch (err) {
        console.error(err);
    }
};

const claimFreeCourse = async (courseURL: string) => {
    try {
        // Navigate to provided course url
        await page.goto(courseURL);

        // Wait for page to load enroll button element
        await page.waitForXPath('/html/body/div[2]/div[3]/div[4]/div/div/div/div/div[3]/div/button');

        // Get enroll button element with xPath
        const [enrollButtonEl] = await page.$x('/html/body/div[2]/div[3]/div[4]/div/div/div/div/div[3]/div/button');

        // Return if enroll button does not exist
        if (!enrollButtonEl) return;

        // Click on enroll button and wait for page navigation to complete
        await Promise.all([page.waitForNavigation(), enrollButtonEl.click()]);
    } catch (err) {
        console.error(err);
    }
};

export const loginWithCredentials = async () => {
    try {
        // Get email input element with xPath
        const [emailInputEl] = await page.$x('/html/body/div[1]/div[2]/div[1]/div[3]/form/div[1]/div[1]/div/input');

        // Enter udemy account email
        await emailInputEl.type(process.env.UDEMY_ACCOUNT_EMAIL);

        // Get password input element with xPath
        const [passwordInputEl] = await page.$x('/html/body/div[1]/div[2]/div[1]/div[3]/form/div[1]/div[2]/div/input');

        // Enter udemy account password
        await passwordInputEl.type(process.env.UDEMY_ACCOUNT_PASSWORD);

        // Get login button element with xPath
        const [loginButtonEl] = await page.$x('/html/body/div[1]/div[2]/div[1]/div[3]/form/div[2]/div/input');

        // Click login button and wait for page navigation to complete
        await Promise.all([page.waitForNavigation(), loginButtonEl.click()]);
    } catch (err) {
        console.error(err);
    }
};

export const scrapeFreeCourses = async () => {
    // Get all free courses URLs
    const coursesURLs = await getAllFreeCourseURLs();

    for (let url of coursesURLs) {
        await claimFreeCourse(url);
    }
};

export const navigateToPage = async (url: string) => {
    try {
        // Navigate to provided course url
        await page.goto(url);
    } catch (err) {
        console.error(err);
    }
};

export const closeBrowser = async () => {
    try {
        // Close browser
        await browser.close();
    } catch (err) {
        console.error(err);
    }
};

export const initPuppeteer = async () => {
    // Launch Puppeteer browser
    browser = await puppeteer.launch({ headless: false });

    // Create new page with browser
    page = await browser.newPage();
};
