const fetch = require('node-fetch');

async function log(message) {
    await console.log(`  ${message}`);
}

module.exports = {
    onInit: async ({constants, inputs, utils}) => {
        const parsedBuildMinutesRequired = parseInt(inputs.buildMinutesRequired);
        const reprBuildMinutesRequired = JSON.stringify(inputs.buildMinutesRequired);

        if (Number.isNaN(parsedBuildMinutesRequired)) {
            utils.build.failPlugin(`The input \`buildMinutesRequired\` must be an integer. You provided: ${reprBuildMinutesRequired}`);
        }

        if (!('NETLIFY_AUTH_TOKEN' in process.env)) {
            await log('Could not find the NETLIFY_AUTH_TOKEN environment variable.');
            await log('This build will continue.')
            utils.build.failPlugin('This plugin requires the NETLIFY_AUTH_TOKEN environment variable.');
        }
        const authHeader = {Authorization: `Bearer ${process.env.NETLIFY_AUTH_TOKEN}`}

        if (!('SITE_ID' in constants)) {
            await log('Could not determine the Site ID.');
            await log('If you are running locally, use `netlify link` or set the NETLIFY_SITE_ID environment variable.')
            await log('This build will continue.')
            utils.build.failPlugin('Could not determine the Site ID.');
        }

        // Look up the account for this build and check how many build minutes are available
        const siteUrl = `https://api.netlify.com/api/v1/sites/${constants.SITE_ID}`;
        const siteResponse = await fetch(siteUrl, {headers: authHeader});
        const site = await siteResponse.json();

        const statusUrl = `https://api.netlify.com/api/v1/${site.account_slug}/builds/status`;
        const statusResponse = await fetch(statusUrl, {headers: authHeader});
        const status = await statusResponse.json();

        let minutesUsed = status.minutes.current;
        if ('overrideMinutesUsed' in inputs) {
            const parsedOverrideMinutesUsed = parseInt(inputs.overrideMinutesUsed);
            const reprOverrideMinutesUsed = JSON.stringify(inputs.overrideMinutesUsed);
            if (Number.isNaN(parsedOverrideMinutesUsed)) {
                utils.build.failPlugin(`The input \`overrideMinutesUsed\` must be an integer. You provided: ${reprOverrideMinutesUsed}`);
            }
            await log(`Overriding actual minutes used with value from plugin input: ${parsedOverrideMinutesUsed}`);
            minutesUsed = parsedOverrideMinutesUsed;
        }
        const minutesIncluded = status.minutes.included_minutes;
        await log(`You have used ${minutesUsed} of ${minutesIncluded} build minutes in this billing cycle.`);
        await log(`This billing cycle will end on ${status.minutes.period_end_date}.`);

        const minutesAvailable = minutesIncluded - minutesUsed;
        let plural = 's';
        if (minutesAvailable === 1) {
            plural = '';
        }
        await log(`This build will be cancelled if you have less than ${parsedBuildMinutesRequired} minutes available.`);
        await log(`You have ${minutesAvailable} build minute${plural} available in this billing cycle.`);
        if (minutesAvailable < parsedBuildMinutesRequired) {
            if (constants.IS_LOCAL) {
                await log('You do not have enough build minutes available, but this is a local build.');
                await log('This build will continue.')
                utils.build.failPlugin('Not enough build minutes available, but local builds are allowed.');
            } else {
                utils.build.cancelBuild('Cancelling this build due to insufficient build minutes available.');
            }
        }
    }
}
