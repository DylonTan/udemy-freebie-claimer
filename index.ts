import { CronJob } from 'cron';
import { initPuppeteer, navigateToPage, loginWithCredentials, scrapeFreeCourses, closeBrowser } from './helpers';

const sortMethod = process.argv[0];

const job = new CronJob(
    // Set cron time to 00:00 every day
    '0 0 * * *',
    async () => {
        // Initialize Puppeteer
        await initPuppeteer();

        // Navigate to Udemy login page
        await navigateToPage(
            'https://www.udemy.com/join/login-popup/?skip_suggest=1&locale=en_US&next=https%3A%2F%2Fwww.udemy.com%2Flogout%2F&response_type=html',
        );

        // Login with credentials
        await loginWithCredentials();

        for (let p = 1; p < 100; p++) {
            // Navigate to next page
            await navigateToPage(
                `https://www.udemy.com/courses/it-and-software/?p=${p}&price=price-free&sort=${sortMethod}`,
            );

            // Scrape free courses
            await scrapeFreeCourses();
        }

        // Close Puppeteer browser
        await closeBrowser();
    },
    null,
    false,
    'Asia/Kuala_Lumpur',
);

// Start cron job
job.start();
