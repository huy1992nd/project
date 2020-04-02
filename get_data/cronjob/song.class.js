const Parent = require('./parent.class');
const mode = require('../model');
const element = require('../element/song-element').data;
const URL = "https://www.voca.vn/blog/music/lyric";
// const URL_2 = "https://music.voca.vn/kind-music/11";
const URL_2 = "https://music.voca.vn/";
const Song = mode.Song;
const CrawlDataHistory = mode.CrawlDataHistory;
const headless = true;
const LIST_PAGE_NUMBER = [
    1,
    2,3,4,5,6,7,8,9,10,
    11,12,13,14,15,16,17,18,19,20
]
const LIST_PAGE_NUMBER_2 = [
    // 1,2,3,4,5,
    6,7,8,9,10,
    11,12,13,14,15,
    16,17,18,19,20,21
]

class CrawlSongData extends Parent {

    constructor(type) {
        super();
        this.browser = null;
        this.maxTimeFailer = 15;
        this.start_time = 0;
        this.end_time = 0;
        this.is_finish = 0;
        this.is_running = 0;
        this.list_data_save = [];
        this.list_link_page = [];
        this.done_get_link = 0;
        this.list_link_done = [];
        this.numberFailer = 0;
        this.type = type;
    }

    async startCraw() {
        if (this.numberFailer == 0) {
            this.is_running = 1;
            this.browser = await this.initBrowser(headless);
            this.start_time = +new Date();
            console.log('start crawl at ', new Date().toISOString(), this.start_time, this.type);
        }
    }

    async finishCraw() {
        this.end_time = +new Date();
        await new Promise((resolve, reject) => {
            try {
                let data_insert = {
                    type: this.type,
                    count: this.list_data_save.length,
                    time_start: this.start_time,
                    time_end: this.end_time,
                    time: this.end_time - this.start_time,
                    status: this.is_finish ? true : false,
                    created_at: new Date()
                }
                let insert_obj = new CrawlDataHistory(data_insert);
                insert_obj.save((err, result) => {
                    if (err) {
                        reject(err);
                    }
                    if (result) {
                        resolve(true)
                    }
                });
            } catch (error) {
                reject(error)
            }
        });

        console.log('crawl start at  ', this.type, new Date().toISOString(), this.start_time);
        console.log('crawl finish at  ', this.type, new Date().toISOString(), this.end_time);
        console.log('crawl in ', this.type, this.end_time - this.start_time, ' miniseconds');
        this.is_running = 0;
        this.start_time = 0;
        this.end_time = 0;
        this.list_data_save = [];
        this.list_link_page = [];
        this.done_get_link = 0;
        this.list_link_done = [];
        this.numberFailer = 0;
        this.is_finish = 0;
        await this.browser.close();
    }

    getLinkPage(page_number) {
    }

    async crawlData() {
    }

    async getContentOfPage(link_page_object) {
    }

}

class CrawlVocalData extends CrawlSongData{
    constructor(type) {
        super();
        this.type = type;
    }

      // Overide
      getLinkPage(page_number) {
        return new Promise(async (resolve, reject) => {
            try {
                // const page = await this.initPage(this.browser, [ "script"]);
                const page = await this.initPage(this.browser, ["font", "stylesheet", "script", "image"]);
                let link_page = `${URL}?page=${page_number}`;
                await page.goto(link_page, { waitUntil: 'networkidle0' });
                var element_page = element.page_infor;

                var list_page_name = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.list_song_link), element => element.textContent),
                    element_page
                );

                var list_page_link = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.list_song_link), element => element.href),
                    element_page
                );

                var list_page_image = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.list_song_img), element => element.src),
                    element_page
                );

                list_page_link.forEach((link_song, index) => {
                    if (link_song) {
                        let name_song = list_page_name[index] || "";
                        name_song = name_song.replace("Lời dịch bài hát ","");
                        let link_image = list_page_image[index] || "";
                        if ( link_song && link_song.includes("loi-dich-bai-hat") && !this.list_link_page.find(item => item.link_song == link_song)) {
                            this.list_link_page.push(
                                {
                                    link_song: link_song,
                                    name_song: name_song,
                                    link_image: link_image
                                }
                            );
                        }else{
                            
                        }
                    }
                })
                await page.close();
                resolve(true);
            } catch (error) {
                reject(error)
            }
        });
    }

    async crawlData() {
        if (this.is_running == 0 || (this.is_running == 1 && this.numberFailer > 0)) {
            try {
                await this.startCraw();
                if (this.done_get_link == 0) {
                    await this.asyncForEach(LIST_PAGE_NUMBER, async (page_number, index) => {
                        await this.getLinkPage(page_number);
                    });
                    this.done_get_link = 1;
                    console.log('Done get link', this.list_link_page);
                }

                await this.asyncForEach(this.list_link_page, async (link_page_object, index) => {
                    if (!this.list_link_done.includes(link_page_object.link_song)) {
                        await this.getContentOfPage(link_page_object);
                    }
                });
                console.log("get data ok ready save in database ", this.type);
                await new Promise((resolve, reject) => {
                    try {
                        if (this.list_data_save.length) {
                            Song.remove({ type: this.type }, (err) => {
                                resolve(true)
                            });
                        }
                    } catch (error) {
                        reject(error)
                    }
                });
                await this.asyncForEach(this.list_data_save, async (item, index) => {
                    item.tour_id = index;
                    await Song.updateOne({ song_id: index, type: this.type }, {
                        $set: item
                    }, { upsert: true }, (err, result) => {
                        if (err) {
                            console.log('Have error when insert data', item);
                        } else {
                        }
                    });
                });
                this.is_finish = 1;
                this.finishCraw();
            } catch (error) {
                this.numberFailer++;
                console.log('Number_failer ---> ', this.type, this.numberFailer);
                if (this.numberFailer < this.maxTimeFailer) {
                    this.crawlData()
                } else {
                    this.finishCraw();
                    console.log(' can not craw data tour', this.type);
                }
                console.log('have error when crawl data tour', error)
            }
        } else {
            console.log('The previous run has not finished you cannot create new ', this.type);
        }

    }

    // Overide
    async getContentOfPage(link_page_object) {
        return new Promise(async (resolve, reject) => {
            try {
                // const page = await this.initPage(this.browser, ["font", "stylesheet", "script", "image"]);
                const page = await this.initPage(this.browser, ["font", "stylesheet", "image"]);
                await page.goto(link_page_object.link_song, { waitUntil: 'networkidle0' });
                const element_page = element.page_detail;
                
                // const link_you_tube = await page.$eval("#video-player", el => el.src);
                const link_you_tube = await page.evaluate(
                    (element_page) => document.getElementById("video-player").src,
                    element_page
                );
                // const singer_infor = await page.$eval(element_page.singer_infor, el => el.innerText);
                const content_song = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.content_song), element => element.textContent),
                    element_page
                );
                var singer_infor = "";
                var  list_song_content = [];
                var is_start_get_content_song = 0;
                var is_finish_get_content_song = 0;

                content_song.forEach((item,index)=>{
                    if(!is_start_get_content_song){
                        if(item.includes("| Vietsub by")){
                            is_start_get_content_song = 1;
                            let list_singer_infor = item.split("|");
                            singer_infor = list_singer_infor.length == 3 ? list_singer_infor[1] : list_singer_infor[0];
                        }
                    }else{
                        if(!is_finish_get_content_song){
                            if(item == "-----" || item.includes("Nếu bạn muốn học tiếng") || item.includes("VOCA Music áp dụng một qui trình")){ 
                                is_finish_get_content_song = 1;
                            }else{
                                if( item.includes("\n-----")){
                                    is_finish_get_content_song = 1;
                                }
                                if( item != " " && !item.includes("Học tiếng Anh qua bài")){
                                    list_song_content.push(item)
                                }
                            }
                        }
                    }
                })
                let data_save = {
                    type: this.type,
                    name: link_page_object.name_song,
                    link_song: link_page_object.link_song,
                    link_you_tube: link_you_tube,
                    link_image: link_page_object.link_image,
                    content: list_song_content,
                    singer: singer_infor.replace("Nam ca sĩ: ","").replace("Nữ ca sĩ: ","").replace("Ca sĩ: ","").replace("Ca sĩ:","").trim(),
                    created_at: new Date()
                };
                this.list_data_save.push(data_save);
                await page.close();
                this.list_link_done.push(link_page_object.link_song);
                console.log('done ---> ', this.type, this.list_data_save.length);
                resolve(true);
            } catch (error) {
                reject(error)
            }

        });
    }
}

class CrawlVocalData2 extends CrawlSongData{
    constructor(type) {
        super();
        this.type = type;
    }

      // Overide
      getLinkPage(page_number) {
        return new Promise(async (resolve, reject) => {
            try {
                // const page = await this.initPage(this.browser, [ "script"]);
                const page = await this.initPage(this.browser, ["font", "stylesheet", "script", "image"]);
                let link_page = `${URL_2}?page=${page_number}`;
                await page.goto(link_page, { waitUntil: 'networkidle0' });
                var element_page = element.page_infor_2;

                var list_page_name = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.list_song_name), element => element.textContent),
                    element_page
                );

                var list_singer_infor = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.singer_infor), element => element.textContent),
                    element_page
                );

                var list_page_link = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.list_song_link), element => element.href),
                    element_page
                );

                var list_page_image = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.list_song_img), element => element.src),
                    element_page
                );

                list_page_link.forEach((link_song, index) => {
                    if (link_song) {
                        let name_song = list_page_name[index] || "";
                        let link_image = list_page_image[index] || "";
                        let singer_infor = list_singer_infor[index] || "";
                        if ( link_song  && !this.list_link_page.find(item => item.link_song == link_song)) {
                            this.list_link_page.push(
                                {
                                    link_song: link_song,
                                    name_song: name_song,
                                    singer_infor: singer_infor,
                                    link_image: link_image
                                }
                            );
                        }else{
                            
                        }
                    }
                })
                await page.close();
                resolve(true);
            } catch (error) {
                reject(error)
            }
        });
    }

    async crawlData() {
        if (this.is_running == 0 || (this.is_running == 1 && this.numberFailer > 0)) {
            try {
                await this.startCraw();
                if (this.done_get_link == 0) {
                    await this.asyncForEach(LIST_PAGE_NUMBER_2, async (page_number, index) => {
                        await this.getLinkPage(page_number);
                    });
                    this.done_get_link = 1;
                    console.log('Done get link', this.list_link_page);
                }

                await this.asyncForEach(this.list_link_page, async (link_page_object, index) => {
                    if (!this.list_link_done.includes(link_page_object.link_song)) {
                        await this.getContentOfPage(link_page_object);
                    }
                });
                console.log("get data ok ready save in database ", this.type);
                await new Promise((resolve, reject) => {
                    try {
                        if (this.list_data_save.length) {
                            Song.remove({ type: this.type }, (err) => {
                                resolve(true)
                            });
                        }
                    } catch (error) {
                        reject(error)
                    }
                });
                await this.asyncForEach(this.list_data_save, async (item, index) => {
                    item.tour_id = index;
                    await Song.updateOne({ song_id: index, type: this.type }, {
                        $set: item
                    }, { upsert: true }, (err, result) => {
                        if (err) {
                            console.log('Have error when insert data', item);
                        } else {
                        }
                    });
                });
                this.is_finish = 1;
                this.finishCraw();
            } catch (error) {
                this.numberFailer++;
                console.log('Number_failer ---> ', this.type, this.numberFailer);
                if (this.numberFailer < this.maxTimeFailer) {
                    this.crawlData()
                } else {
                    this.finishCraw();
                    console.log(' can not craw data tour', this.type);
                }
                console.log('have error when crawl data tour', error)
            }
        } else {
            console.log('The previous run has not finished you cannot create new ', this.type);
        }

    }

    // Overide
    async getContentOfPage(link_page_object) {
        return new Promise(async (resolve, reject) => {
            try {
                // const page = await this.initPage(this.browser, ["font", "stylesheet", "script", "image"]);
                const page = await this.initPage5(this.browser, ["font", "stylesheet", "image"], []);
                await page.goto(link_page_object.link_song, { waitUntil: 'networkidle2' });
                const element_page = element.page_detail_2;
                
                // const link_you_tube = await page.$eval("#video-player", el => el.src);
                const link_you_tube = await page.evaluate(
                    (element_page) => document.getElementById("video-player").src,
                    element_page
                );
                // const singer_infor = await page.$eval(element_page.singer_infor, el => el.innerText);
                const content_song = await page.evaluate(
                    (element_page) => Array.from(document.querySelectorAll(element_page.content_song), element => element.textContent),
                    element_page
                );
                var  list_song_content = [];
                content_song.forEach((item,index)=>{
                    list_song_content.push(item);
                })
                let data_save = {
                    type: this.type,
                    name: link_page_object.name_song,
                    link_song: link_page_object.link_song,
                    link_you_tube: link_you_tube,
                    link_image: link_page_object.link_image,
                    content: list_song_content,
                    singer: link_page_object.singer_infor,
                    created_at: new Date()
                };
                this.list_data_save.push(data_save);
                await page.close();
                this.list_link_done.push(link_page_object.link_song);
                console.log('done ---> ', this.type, this.list_data_save.length);
                resolve(true);
            } catch (error) {
                reject(error)
            }

        });
    }
}


// s  = new CrawlVocalData("voca.vn");
// s.crawlData();
s_2  = new CrawlVocalData2("voca.vn_2_6_21");
s_2.crawlData();


module.exports = CrawlVocalData;