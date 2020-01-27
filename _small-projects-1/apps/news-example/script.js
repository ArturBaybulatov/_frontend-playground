(function() {
    var allNews = [
        {title: 'Foo'},
        {title: 'Bar'},
        {title: 'Baz'},
        {title: 'Qux'},
        {title: 'Quux'},
        {title: 'Corge'},
    ]

    var $newsContainer = $('.js-news-container').first()
    var $news = $newsContainer.find('.js-news').first()
    var $prevNews = $newsContainer.find('.js-prev-news').first()
    var $nextNews = $newsContainer.find('.js-next-news').first()

    var currentNews = _.sample(allNews) // Изначально рандомная новость
    renderNews(allNews, currentNews, $news)


    $prevNews.on('click', function() {
        var index = $news.data('currentNewsIndex') - 1

        if (index < 0)
            return

        var newNews = allNews[index]
        renderNews(allNews, newNews, $news)
    })


    $nextNews.on('click', function() {
        var index = $news.data('currentNewsIndex') + 1

        if (index === allNews.length)
            return

        var newNews = allNews[index]
        renderNews(allNews, newNews, $news)
    })


    function renderNews(allNews, news, $news) {
        $news.text(news.title)
        $news.data('currentNewsIndex', _.indexOf(allNews, news))
    }
}());
