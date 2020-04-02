var cron = require('node-cron');
var crawlDataSong = require('./cronjob/song.class');
var crawMynaviRecommend = require('./cronjob/mynavi.class');

crawMynaviRecommend = new crawMynaviRecommend();
cron.schedule('0 10 4 * * *', () => {
    console.log('Running crawl data recomned mynavi every day at 4:10 AM  ');
    crawMynaviRecommend.getDataRecommend();
},
    {
        scheduled: true,
        timezone: "Asia/Tokyo"
    }
);


