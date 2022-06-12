(function ($) {
    "use strict";
    const imJs = {
        m: function (e) {
            imJs.d();
            imJs.methods();
        },
        d: function (e) {
            (this._window = $(window)),
                (this._document = $(document)),
                (this._body = $("body")),
                (this._html = $("html"));
        },
        methods: function (e) {
            imJs.stickyHeader();
            imJs.toggleMenuMobile();
        },
        stickyHeader: function (e) {
            $(window).scroll(function () {
                if ($(this).scrollTop() > 50) {
                    $(".header--sticky").addClass("sticky");
                } else {
                    $(".header--sticky").removeClass("sticky");
                }
            });
        },
        toggleMenuMobile() {
            $(".header-default .hamburger-icon").on("click", function (e) {
                $(".header-default .main-menu").toggleClass("show");
                $("body").toggleClass("no-scroll");
            });
        },
        backToTopInit: function () {
            // declare variable
            const scrollTop = $(".backto-top");
            $(window).scroll(function () {
                // declare variable
                const topPos = $(this).scrollTop();
                // if user scrolls down - show scroll to top button
                if (topPos > 100) {
                    $(scrollTop).css("opacity", "1");
                } else {
                    $(scrollTop).css("opacity", "0");
                }
            });

            //Click event to scroll to top
            $(scrollTop).on("click", function () {
                $("html, body").animate(
                    {
                        scrollTop: 0,
                        easingType: "linear",
                    },
                    500,
                );
                return false;
            });
        },
    };
    imJs.m();

    function getNFT() {
        var keyword = $('.home .search-autocomplete .search-field input').val();
        var action = $('.home .search-autocomplete').attr('action');
        console.log('keywor', keyword);
        console.log('action', action);
        var elem = $('.home .content-search .list-item');
        $('#loading').addClass('display');
        $.ajax({
            method: 'GET',
            url: action + keyword,
            contentType: 'application/json',
            dataType: 'json',
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            cache: false,
            data: { limit: 10, page: 1 },
            success: function (data, status) {
                if (data.status === 1) {
                    console.log('data', data)
                    $('.home .welcome').addClass('d-none');
                    var collection = data.data.collection;
                    var token = data.data.token;
                    if (collection.length > 0) {
                        elem.empty();
                        localStorage.setItem('token', JSON.stringify(token));
                        localStorage.setItem('collection', JSON.stringify(collection));
                        $.map(collection, function (item, index) {
                            const { collection_name, logo_url, collection_address, items } = item;
                            var replaceUrl = token.find(item => item.collection_address === collection_address)?.url;
                            var randomUrl = 'https://source.unsplash.com/random/200x200?sig=1';
                            console.log('replace', replaceUrl);
                            var itemAppend = `
                            <div class="item-nft">
                                <div class="item-img hover">
                                    <img
                                    loading="lazy"
                                    width="220"
                                    height="180"
                                    src=${logo_url || replaceUrl || randomUrl}
                                    alt=${collection_address} />
                                </div>
                                <div class="item-title">
                                <p class="title">${collection_name}</p>
                                <p class="sub-title">${items} nft items</p>
                                </div>
                            </div>
                            `
                            if (index <= 7) {
                                elem.append(itemAppend)
                            }
                            $('.home .recent-search').addClass('d-none');
                        })
                    } else {
                        elem.empty();
                        elem.append(`
                            <div class="page-not-found">
                                <div class="content"><img src="../assets/images/404.png" alt="404"/>
                                <p>No collections found. Please try another keyword.</p>
                                </div>
                            </div>
                        `)
                    }
                    console.log('status', status)

                    console.log('item nft', localStorage.getItem('nft'))
                }
            },
            error: function (e) {
                console.log('e', e)
            },
            complete: function () {
                $('#loading').removeClass('display')
            }
        })
    }
    $('#search-nft input').keydown(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            return false;
        }
    })

    $('#search-nft .icon-search').on('click', function (e) {
        var keyword = $('#search-nft input').val();
        if (keyword.length > 0) {
            getNFT();
        }
    });

    function getRecentSearch() {
        var elem = $('.home .recent-search .list-item');
        $('.home .welcome').addClass('d-none');
        if (localStorage.getItem('collection')) {
            $.map(JSON.parse(localStorage.getItem('collection')), function (item, index) {
                const { collection_name, logo_url, collection_address, items } = item;
                var replaceUrl = JSON.parse(localStorage.getItem('token')).find(item => item.collection_address === collection_address)?.url;
                var randomUrl = 'https://source.unsplash.com/random/200x200?sig=1';
                if (index <= 3) {
                    elem.append(`
                    <div class="item-nft">
                        <div class="item-img hover">
                            <img
                            loading="lazy"
                            width="220"
                            height="180"
                            src=${logo_url || replaceUrl || randomUrl}
                            alt=${collection_address} />
                        </div>
                        <div class="item-title">
                        <p class="title">${collection_name}</p>
                        <p class="sub-title">${items} nft items</p>
                        </div>
                    </div>
                    `)
                }
            })
        }
    }

    getRecentSearch();
})(jQuery, window);
