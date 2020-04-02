exports.data = {
   page_infor : {
      list_song_link: ".new-left-item > div.item-right > h3 > a",
      list_song_img: ".new-left-item div.item-left > a > img"
   },
   page_infor_2 : {
      list_song_link: ".library-product-item a.product-cover ",
      list_song_name: ".library-product-item a.product-cover p.product-name",
      singer_infor: ".library-product-item a.product-cover p.product-singer",
      list_song_img: ".library-product-item a.product-cover div.product-image img"
   },
   page_detail : {
      link_you_tube: "iframe #video-player",
      singer_infor: "#voca-wrap > div.main-wrapper > div > div.blog-body > div > div.blog-new > div.blog-new-left > div > div.news-content > p:nth-child(1)",
      content_song: '.news-content p',
   },
   page_detail_2 : {
      link_you_tube: "iframe #video-player",
      content_song: '.song-detail-lyric .song-detail-lyric-cover .lyric-sentence ',
   }
}