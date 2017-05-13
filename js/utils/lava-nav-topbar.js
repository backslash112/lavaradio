$(function(){
    $(".lavasite-header-sub-product").hover(
        function(){
            $(this).siblings(".lavasite-header-sub-product").stop().animate({opacity:'0.5'},"slow");
        },
        function(){
            $(this).siblings(".lavasite-header-sub-product").stop().animate({opacity:'1'},"200");
        }
    );
});
jQuery(document).ready(function(){
    var qcloud={};
    $('[_t_nav]').hover(function(){
        var _nav = $(this).attr('_t_nav');
        clearTimeout( qcloud[ _nav + '_timer' ] );
        qcloud[ _nav + '_timer' ] = setTimeout(function(){
            $('[_t_nav]').each(function(){
                $(this).parent("#lavasite-header-link-product")[ _nav == $(this).attr('_t_nav') ? 'addClass':'removeClass' ]('hover');
            });
            $('#'+_nav).stop(true,true).slideDown(200);
        }, 150);
    },function(){
        var _nav = $(this).attr('_t_nav');
        clearTimeout( qcloud[ _nav + '_timer' ] );
        qcloud[ _nav + '_timer' ] = setTimeout(function(){
            $('[_t_nav]').parent("#lavasite-header-link-product").removeClass('hover');
            $('#'+_nav).stop(true,true).slideUp(200);
        }, 150);
    });
});


