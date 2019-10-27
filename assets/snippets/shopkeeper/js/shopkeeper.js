function getXMLHttpRequest()
{
    if(window.XMLHttpRequest){
        return new XMLHttpRequest();
    }
    else{
        try {return new ActiveXObject("Msxml2.XMLHTTP");}
        catch(e) {
            try {return new ActiveXObject("Microsoft.XMLHTTP");}
            catch(e) {return false;}
        }
    }
}

var req = getXMLHttpRequest();

function addToCart(fr)
{
    act = 'assets/snippets/shopkeeper/ajax-action.php';
    var fdata = new FormData(fr);
    fdata.append('action', 'fill_cart');
    fr.onsubmit = function(){return false};
    req.open('POST', act, true);
    req.send(fdata);
    req.onreadystatechange = function(){
        if(req.readyState == 4){
            if(req.status == 200){
                $.post(window.location.pathname, {'act_getcart':'get'}, function(data) {
                    if(data != 'err'){
                        var arr_data = JSON.parse(data);
                        if(document.getElementById("cartInner").getElementsByTagName("b")[1].firstChild.nodeValue != arr_data['pop_total_count']){
                            document.getElementById("cartInner").getElementsByTagName("b")[0].firstChild.nodeValue = arr_data['pop_total_items'];
                            document.getElementById("cartInner").getElementsByTagName("b")[1].firstChild.nodeValue = arr_data['pop_total_count'];
                            document.getElementById("cartInner").getElementsByTagName("b")[2].firstChild.nodeValue = arr_data['pop_total_sum'];

                            //$('#pop_articul').html(arr_data['pop_articul']);
                            $('#pop_img_prod').attr('src', arr_data['pop_img_prod']);
                            $('#pop_price').html(arr_data['pop_price']);
                            $('#pop_title_prod').html(arr_data['pop_title_prod']);
                            $('#oc_count').val(arr_data['pop_count']);
                            $('#pop_total_sum').html(arr_data['pop_total_sum']);
                            $('#pop_total_count').html(arr_data['pop_total_count']);
                            $('#pop_total_items').html(arr_data['pop_total_items']);

                            //$.fancybox({ href:'#cartcoiner', wrapCSS: 'modal_pop_wind_cart'  });

                            $("#cartcon").click();

                            press_only_num('oc_count');
                            document.getElementsByClassName('pop_minus')[0].onclick = function(){
                                var val = 0;
                                if(document.getElementById('oc_count').value > 1){
                                    val = document.getElementById('oc_count').value;
                                    if((val-1)>0)
                                        val--;
                                    else
                                        val = 1;

                                    document.getElementById('oc_count').value = val;
                                    var ind = arr_data['index_cart'];
                                    get_recount(ind,val);
                                }
                            }
                            document.getElementsByClassName('pop_plus')[0].onclick = function(){
                                var val = 0;
                                val = document.getElementById('oc_count').value;
                                val++;
                                document.getElementById('oc_count').value = val;
                                var ind = arr_data['index_cart'];
                                get_recount(ind,val);
                            }

                            document.getElementById('oc_count').onkeyup = function(){
                                var ind = arr_data['index_cart'];
                                var ct = document.getElementById('oc_count').value;
                                get_recount(ind,ct);
                            }

                            document.getElementById('ocSHK_send_order').onclick = function(){
                                var msg = document.getElementById('msg_ocshk');
                                msg.innerHTML = '';

                                var url = FBmodule.url_send+'?action=data_oc';
                                var ocfr = document.getElementById('ocSHK_form');
                                document.getElementById('ocSHK_send_order').disabled = true;
                                var oc_data = '';
                                for(var i=0; i<ocfr.length; i++){
                                    var elm = ocfr.elements[i];
                                    if(elm.name == 'lang' || elm.name == 'mail_subject')
                                        oc_data+='&'+elm.name+'='+encodeURIComponent(elm.value);
                                    else
                                        oc_data+='&fdata['+elm.name+'][value]='+encodeURIComponent(elm.value)+'&fdata['+elm.name+'][check]='+encodeURIComponent(elm.getAttribute('data-fl-check'));
                                }

                                oc_data+='&fdata[id_product][value]='+encodeURIComponent(fr.oc_id_product.value);
                                oc_data+='&fdata[name_product][value]='+encodeURIComponent(fr.oc_name_product.value);
                                oc_data+='&fdata[price][value]='+encodeURIComponent(fr.oc_price.value);
                                oc_data+='&fdata[count][value]='+encodeURIComponent(document.getElementById('oc_count').value);

                                req.open('POST', url, true);
                                req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                req.send(oc_data);
                                req.onreadystatechange = function (){
                                    if(req.readyState == 4){
                                        if (req.status == 200){
                                            var response = req.responseText;
                                            if(response == 'ok'){
                                                //$("#open_hide_succ").click();
                                                if(FBmodule.oc_goto.length > 0)
                                                    window.location.href = FBmodule.oc_goto;
                                                else
                                                    FBmodule.fancybox({ href:'#ocSHK_success', wrapCSS:'modal_ocShort' });
                                            }
                                            else{
                                                var f = 0;
                                                data_msg = JSON.parse(response);
                                                msg.innerHTML = data_msg.msg;
                                                for(var i=0; i<ocfr.length; i++){
                                                    var elm = ocfr.elements[i];
                                                    if(data_msg.fl[elm.name]){
                                                        if(f == 0){f=1;elm.focus();}
                                                        elm.parentNode.setAttribute('class',FBmodule.nameClassError);
                                                    }
                                                }
                                            }
                                        }

                                        document.getElementById('ocSHK_send_order').disabled = false;
                                    }
                                }
                            }

                        }
                    }
                });
            }
        }
    }
}

var pop_chfCt = 0;
function get_recount(index,count){
    if(pop_chfCt != count){
        $.post(window.location.pathname, {'act_getcart':'get_recount', 'index':index, 'count':count}, function(data) {
            if(data != 'err'){
                pop_chfCt = count;
                var re_data = JSON.parse(data);
                if(document.getElementById("cartInner").getElementsByTagName("b")[1].firstChild.nodeValue != re_data['pop_total_count']){
                    document.getElementById("cartInner").getElementsByTagName("b")[0].firstChild.nodeValue = re_data['pop_total_items'];
                    document.getElementById("cartInner").getElementsByTagName("b")[1].firstChild.nodeValue = re_data['pop_total_count'];
                    document.getElementById("cartInner").getElementsByTagName("b")[2].firstChild.nodeValue = re_data['pop_total_sum'];

                    $('#pop_total_sum').html(re_data['pop_total_sum']);
                    $('#pop_total_items').html(re_data['pop_total_items']);
                    $('#pop_total_count').html(re_data['pop_total_count']);
                }
            }
        });
    }
}

var chfCt = 0;
function chgCount( ind, el )
{
    var clr = el.value.replace( /[^0-9]/g, '' );
    var count = (clr > 0)? clr : 1;
    if( count != el.value ){ el.value = count; }

//	setTimeout(function(count){
    if(chfCt != count){
        $.post(window.location.pathname, {'re_count_index':'1', 'num':ind, 'count':count}, function(data) {
            chfCt = count;
            var re_data = JSON.parse(data);

            el.parentNode.parentNode.getElementsByClassName('row-total-price')[0].innerHTML = re_data['index_price'];
            document.getElementById("pr_total").innerHTML = re_data['totalPrice'];

            if(document.getElementById("cartInner").getElementsByTagName("b")[1].firstChild.nodeValue != re_data['totalCount']){
                document.getElementById("cartInner").getElementsByTagName("b")[0].firstChild.nodeValue = re_data['totalItems'];
                document.getElementById("cartInner").getElementsByTagName("b")[1].firstChild.nodeValue = re_data['totalCount'];
                document.getElementById("cartInner").getElementsByTagName("b")[2].firstChild.nodeValue = re_data['totalPrice'];
            }
        });
    }
//	},300);
}

function getNum(ind,el,op){
    var count = el.parentNode.getElementsByTagName('input')[0].value;
    if((op == "-" && count>1) || (op == "+")){
        $.post(window.location.pathname, {'re_count':'1', 'op':op, 'num':ind, 'count':count}, function(data) {
            var re_data = JSON.parse(data);

            el.parentNode.getElementsByTagName('input')[0].value = re_data['index_count'];
            el.parentNode.parentNode.getElementsByClassName('row-total-price')[0].innerHTML = re_data['index_price'];
            document.getElementById("pr_total").innerHTML = re_data['totalPrice'];

            if(document.getElementById("cartInner").getElementsByTagName("b")[1].firstChild.nodeValue != re_data['totalCount']){
                document.getElementById("cartInner").getElementsByTagName("b")[0].firstChild.nodeValue = re_data['totalItems'];
                document.getElementById("cartInner").getElementsByTagName("b")[1].firstChild.nodeValue = re_data['totalCount'];
                document.getElementById("cartInner").getElementsByTagName("b")[2].firstChild.nodeValue = re_data['totalPrice'];
            }
        });
    }
}


window.onload = function(){
    press_only_num('oc_count');
}

function press_only_num(id)
{
    if(document.getElementById(id)!=null){
        document.getElementById(id).onkeypress = function(e) {
            e = e || event;
            if (e.ctrlKey || e.altKey || e.metaKey) return;

            var chr = getChar(e);

            if (chr == null) return;

            if (chr < '0' || chr > '9') {
                return false;
            }
        }
    }
}

function getChar(event){
    if(event.which == null){
        if (event.keyCode < 32) return null;
        return String.fromCharCode(event.keyCode) // IE
    }

    if(event.which != 0 && event.charCode != 0){
        if (event.which < 32) return null;
        return String.fromCharCode(event.which) // остальные
    }

    return null; // специальная клавиша
}

function buy_complect(fr){
    var act = "assets/snippets/shopkeeper/ajax-action.php";
    var fdata = new FormData(fr);
    fdata.append("action", "fill_cart");
    fr.onsubmit = function(){return false};
    req.open("POST", act, true);
    req.send(fdata);
    req.onreadystatechange = function (){
        if(req.readyState == 4){
            if (req.status == 200){
                window.location.href = window.location.href;
            }
        }
    }
}

function buy_modification(fr){
    var act = "assets/snippets/shopkeeper/ajax-action.php";
    var fdata = new FormData(fr);
    fdata.append("action", "fill_cart");
    fr.onsubmit = function(){return false};
    req.open("POST", act, true);
    req.send(fdata);
    req.onreadystatechange = function (){
        if(req.readyState == 4){
            if (req.status == 200){

                $.post(window.location.pathname, {'act_getcart':'get'}, function(data) {
                    if(data != 'err'){
                        var arr_data = JSON.parse(data);
                        if(document.getElementById("cartInner").getElementsByTagName("b")[1].firstChild.nodeValue != arr_data['pop_total_count']){
                            document.getElementById("cartInner").getElementsByTagName("b")[0].firstChild.nodeValue = arr_data['pop_total_items'];
                            document.getElementById("cartInner").getElementsByTagName("b")[1].firstChild.nodeValue = arr_data['pop_total_count'];
                            document.getElementById("cartInner").getElementsByTagName("b")[2].firstChild.nodeValue = arr_data['pop_total_sum'];

                            $('#pop_img_prod').attr('src', fr.elements['modif[img]'].value);
                            //$('#pop_price').html(fr.elements['modif[price]'].value);
                            $('#pop_price').html(arr_data['pop_price']);
                            $('#pop_title_prod').html(fr.elements['name'].value+' '+fr.elements['modif[name]'].value);
                            $('#oc_count').val(arr_data['pop_count']);
                            $('#pop_total_sum').html(arr_data['pop_total_sum']);
                            $('#pop_total_count').html(arr_data['pop_total_items']);
                            $('#pop_total_count').html(arr_data['pop_total_count']);

                            $("#cartcon").click();
                            //window.$.fancybox({ href:'#cartcoiner', wrapCSS: 'modal_pop_wind_cart'  });
                            press_only_num('oc_count');
                            document.getElementsByClassName('pop_minus')[0].onclick = function(){
                                var val = 0;
                                if(document.getElementById('oc_count').value > 1){
                                    val = document.getElementById('oc_count').value;
                                    if((val-1)>0)
                                        val--;
                                    else
                                        val = 1;

                                    document.getElementById('oc_count').value = val;
                                    var ind = arr_data['index_cart'];
                                    get_recount(ind,val);
                                }
                            }
                            document.getElementsByClassName('pop_plus')[0].onclick = function(){
                                var val = 0;
                                val = document.getElementById('oc_count').value;
                                val++;
                                document.getElementById('oc_count').value = val;
                                var ind = arr_data['index_cart'];
                                get_recount(ind,val);
                            }

                            document.getElementById('oc_count').onkeyup = function(){
                                var ind = arr_data['index_cart'];
                                var ct = document.getElementById('oc_count').value;
                                get_recount(ind,ct);
                            }

                            document.getElementById('ocSHK_send_order').onclick = function(){
                                var msg = document.getElementById('msg_ocshk');
                                msg.innerHTML = '';

                                var url = FBmodule.url_send+'?action=data_oc';
                                var ocfr = document.getElementById('ocSHK_form');
                                document.getElementById('ocSHK_send_order').disabled = true;
                                var oc_data = '';
                                for(var i=0; i<ocfr.length; i++){
                                    var elm = ocfr.elements[i];
                                    if(elm.name == 'lang' || elm.name == 'mail_subject')
                                        oc_data+='&'+elm.name+'='+encodeURIComponent(elm.value);
                                    else
                                        oc_data+='&fdata['+elm.name+'][value]='+encodeURIComponent(elm.value)+'&fdata['+elm.name+'][check]='+encodeURIComponent(elm.getAttribute('data-fl-check'));
                                }

                                oc_data+='&fdata[id_product][value]='+encodeURIComponent(fr.oc_id_product.value);
                                oc_data+='&fdata[name_product][value]='+encodeURIComponent(fr.oc_name_product.value);
                                oc_data+='&fdata[price][value]='+encodeURIComponent(fr.oc_price.value);
                                oc_data+='&fdata[count][value]='+encodeURIComponent(document.getElementById('oc_count').value);

                                req.open('POST', url, true);
                                req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                req.send(oc_data);
                                req.onreadystatechange = function (){
                                    if(req.readyState == 4){
                                        if (req.status == 200){
                                            var response = req.responseText;
                                            if(response == 'ok'){
                                                //$("#open_hide_succ").click();
                                                FBmodule.fancybox({ href:'#ocSHK_success', wrapCSS:'modal_ocShort' });
                                            }
                                            else{
                                                var f = 0;
                                                data_msg = JSON.parse(response);
                                                msg.innerHTML = data_msg.msg;
                                                for(var i=0; i<ocfr.length; i++){
                                                    var elm = ocfr.elements[i];
                                                    if(data_msg.fl[elm.name]){
                                                        if(f == 0){f=1;elm.focus();}
                                                        elm.parentNode.setAttribute('class',FBmodule.nameClassError);
                                                    }
                                                }
                                            }
                                        }

                                        document.getElementById('ocSHK_send_order').disabled = false;
                                    }
                                }

                            }
                            /*
                             document.getElementById('oc_send_order').onclick = function(){
                             var msg = document.getElementById('msg_oc');
                             var id = encodeURIComponent(fr.elements['shk-id'].value);
                             var phone = encodeURIComponent(document.getElementById('oc_phone').value);
                             var count = encodeURIComponent(document.getElementById('oc_count').value);

                             var prodname = encodeURIComponent(fr.elements['name'].value+' '+fr.elements['modif[name]'].value);
                             var price = encodeURIComponent(arr_data['pop_price']);

                             var data = 'id='+id+'&phone='+phone+'&count='+count+'&prodname='+prodname+'&price='+price;

                             var url = window.location.pathname+'?act=sendsh_oc';
                             req.open('POST', url, true);
                             req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                             req.send(data);
                             req.onreadystatechange = function (){
                             if(req.readyState == 4){
                             if (req.status == 200){
                             var response = req.responseText;
                             if(response == 'ok'){
                             msg.innerHTML = '';
                             $("#open_hide_succ_sh").click();
                             }
                             else{
                             msg.innerHTML = response;
                             }
                             }
                             }
                             }
                             }
                             */
                        }
                    }
                });

            }
        }
    }
}

if(typeof(site_url)=='undefined'){
    var site_url = jQuery('base').size()>0
        ? jQuery('base:first').attr('href')
        : window.location.protocol+'//'+window.location.host+'/';
}

var shk_timer;

(function($){

    if(typeof langTxt != 'undefined'){
        //default settings:
        var shkOpt = $.extend({
            stuffCont: 'div.shk-item',
            lang: '',
            cartType: 'full',
            style:'default',
            cartTpl: ['@FILE:assets/snippets/shopkeeper/chunks/ru/chunk_shopCart.tpl','',''],
            flyToCart: 'helper',
            currency: '',
            orderFormPage: '',
            priceTV: 'price',
            noCounter: false,
            changePrice: false,
            counterField: false,
            linkAllow: true,
            noLoader: false,
            debug: false,
            shkHelper: '<div id="stuffHelper"><div><b id="stuffHelperName"></b></div>'
            +"\n"+'<div class="shs-count" id="stuffCount">'+langTxt['count']+' <input type="text" size="2" name="count" value="1" maxlength="3" />'
            +'</div><div><button class="shk-but" id="confirmButton">'+langTxt['continue']+'</button> '
            +"\n"+'<button class="shk-but" id="cancelButton">'+langTxt['cancel']+'</button></div></div>'
            +"\n"
        }, shkOptions);


        function number_format(number, decimals, dec_point, thousands_sep) {
            number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                s = '',
                toFixedFix = function (n, prec) {
                    var k = Math.pow(10, prec);
                    return '' + Math.round(n * k) / k;
                };
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0');
            }
            return s.join(dec);
        }

        function shk_numFormat(n){
            return number_format(n, (Math.floor(n)===n ? 0 : 2), '.', ' ');
        }

        var settings_qs = '&site_url='+site_url+'&cart_type='+shkOpt.cartType+'&cart_tpl='+shkOpt.cartTpl[0]+'&cart_row_tpl='+shkOpt.cartTpl[1]+'&addit_data_tpl='+shkOpt.cartTpl[2]+'&currency='+shkOpt.currency+'&price_tv='+shkOpt.priceTV+'&link_allow='+shkOpt.linkAllow+'&nocounter='+shkOpt.noCounter+'&change_price='+shkOpt.changePrice+'&order_page='+shkOpt.orderFormPage;


        $.fn.setCounterToField = function(opt){
            st = $.extend({style:'default',wrapdiv:false}, opt);
            var imgpath = site_url+'assets/snippets/shopkeeper/style/'+st.style+'/img/';
            function checkKey(e){
                var key_code = e.which ? e.which : e.keyCode;
                return (key_code>47&&key_code<58)||key_code==8 ? true : false;
            }
            function changeCount(field,action){
                var count = parseInt($(field).attr('value'));
                var num = action==1 ? count+1 : count-1;
                if(num>=1)
                    $(field).val(num);
            }
            var countButs = '<img class="field-arr-up" src="'+imgpath+'arr_up.gif" width="17" height="9" alt="" />'
                + '<img class="field-arr-down" src="'+imgpath+'arr_down.gif" width="17" height="9" alt="" />'+"\n";
            var field = $(this);
            if(st.wrapdiv)
                $(this).wrap('<div></div>');
            $(this)
                .css({'height':'16px','border':'1px solid #888','vertical-align':'bottom','text-align':'center','padding':'1px 2px','font-size':'13px'})
                .after(countButs)
                .keypress(function(e){return checkKey(e);});
            $(this).next('img').click(function(){
                changeCount(field,1);
            })
                .css({'cursor':'pointer','margin':'0 0 11px 1px','vertical-align':'bottom'})
                .next('img').click(function(){
                changeCount(field,2);
            })
                .css({'cursor':'pointer','margin':'0 0 1px -17px','vertical-align':'bottom'});
        }


        $.fn.shopkeeper = function(){
            if(typeof(jQuery.livequery)!='undefined'){
                $('form',$(this)).livequery('submit',function(){
                    jQuery.toCart(this);
                    return false;
                });
            }else{
                $('form',$(this)).bind('submit',function(){
                    jQuery.toCart(this);
                    return false;
                });
            }
            if(shkOpt.counterField){
                $(this).each(function(i){
                    if($("input[name='shk-count']",$(this)).is(':hidden')==false){
                        $("input[name='shk-count']",$(this)).setCounterToField({style:shkOpt.style});
                    }
                    return this;
                });
            }
            //jQuery.refreshCart(false);
        }

        if (navigator.cookieEnabled==false){
            alert(langTxt['cookieError']);
        }


        function showHelper(elem,name,noCounter,func){
            if(typeof($(elem).get(0))=='undefined') return;
            if(shkOpt.debug){
                log.info('showHelper()');
            }
            $('#stuffHelper').remove();
            $('body').append(shkOpt.shkHelper);
            $('#cancelButton').click(function(){
                $('#stuffHelper').fadeOut(300,function(){$(this).remove()});
                return false;
            });
            $('#confirmButton').click(function(){
                func();
                return false;
            });
            if(noCounter){
                $('#stuffCount').remove();
            }else{
                $('input:text','#stuffCount').setCounterToField();
            }
            var elHelper = $('#stuffHelper');
            var btPos = getCenterPos(elHelper,elem);
            if(name){
                $('#stuffHelperName').html(name);
            }else{
                $('#stuffHelperName').remove();
            }
            $('#stuffHelper').css({'top':btPos.y+'px','left':btPos.x+'px'}).fadeIn(500);
        }


        function showLoading(show){
            if(shkOpt.debug){
                log.info('showLoading(), show='+show);
            }
            if(!shkOpt.noLoader){
                if(show==true){
                    $('body').append('<div id="shkLoading"></div>');
                    var loader = $('#shkLoading');
                    var shopCart = $('#shopCart');
                    var btPos = getCenterPos(loader,shopCart);
                    $('#shkLoading').css({'top':btPos.y+'px','left':btPos.x+'px'}).fadeIn(300);
                }else{
                    $('#shkLoading').fadeOut(300,function(){
                        $(this).remove();
                    });
                }
            }
        }


        function getPosition(elem){
            var el = $(elem).get(0);
            var p = {x: el.offsetLeft, y: el.offsetTop}
            while (el.offsetParent){
                el = el.offsetParent;
                p.x += el.offsetLeft;
                p.y += el.offsetTop;
                if (el != document.body && el != document.documentElement){
                    p.x -= el.scrollLeft;
                    p.y -= el.scrollTop;
                }
            }
            return p;
        }


        function getCenterPos(elA,elB,Awidth,Aheight){
            if(typeof(Awidth)=='undefined') Awidth = $(elA).outerWidth();
            if(typeof(Aheight)=='undefined') Aheight = $(elA).outerHeight();
            posB = new Object();
            cntPos = new Object();
            posB = getPosition(elB);
            var correct;
            cntPos.x = Math.round(($(elB).outerWidth()-Awidth)/2)+posB.x;
            cntPos.y = Math.round(($(elB).outerHeight()-Aheight)/2)+posB.y;
            if(cntPos.x+Awidth>$(window).width()){
                cntPos.x = Math.round($(window).width()-$(elA).outerWidth())-2;
            }
            if(cntPos.x<0){
                cntPos.x = 2;
            }
            return cntPos;
        }


        function ajaxRequest(params,refresh){
            if(typeof(refresh)=='undefined') var refresh = true;
            if(shkOpt.debug){
                log.debug('ajaxRequest(), params='+params);
            }
            $.ajax({
                type: "POST",
                cache: false,
                url: site_url+'assets/snippets/shopkeeper/ajax-action.php',
                data: params+'&lang='+shkOpt.lang,
                success: function(data){
                    showLoading(false);
                    if(refresh){
                        if(window.location.href.indexOf('/'+shkOpt.orderFormPage)>-1){
                            $('#butOrder').hide();
                        }
                        var cartHeight = $('#shopCart').height();
                        $('#shopCart').replaceWith(data);
                        setCartActions();
                        var cartheightNew = $('#shopCart').height();
                        animCartHeight(cartHeight,cartheightNew);
                    }
                }
                ,error: function(jqXHR, textStatus, errorThrown){
                    alert(textStatus+' '+errorThrown);
                }
            });
        }


        jQuery.deleteItem = function(num,el,refresh){
            if(typeof(refresh)=='undefined') var refresh = true;
            var thisAction = function(){
                if(shkOpt.debug){
                    log.debug('jQuery.deleteItem(), num='+num);
                }
                if(num!='all'){
                    showLoading(true);
                    var getParams = '&action=delete&index='+num+settings_qs;
                    ajaxRequest(getParams,refresh);
                }else{
                    jQuery.emptyCart();
                }
                $('#stuffHelper').fadeOut(500,function(){
                    $(this).remove();
                });
            }
            if(el!=null){
                showHelper(el,langTxt['confirm'],true,thisAction);
                $('#confirmButton').text(langTxt['yes']);
            }else{
                thisAction();
            }
        }


        function recountItem(num,el){
            var thisAction = function(){
                var count = $('input:text','#stuffCount').val();
                $('#stuffHelper').fadeOut(500,function(){
                    $(this).remove();
                });
                showLoading(true);
                var getParams = '&action=recount&index='+num+'&count='+count+settings_qs;
                ajaxRequest(getParams);
                if(shkOpt.debug){
                    log.debug('recountItem(): num:'+num+', count:'+count);
                }
            }
            showHelper(el,false,false,thisAction);
            el.blur();
            var thisCount = $(el).is('a') ? parseInt($(el).text().replace(/\D* /,'')) : parseInt($(el).val().replace(/\D* /,''));
            $('input:text','#stuffCount').val(thisCount);
        }


        function setCartActions(){
            if(shkOpt.debug){
                log.info('setCartActions()');
            }
            var rows = $('a.shk-del','#shopCart');
            var countElem = $('input.shk-count','#shopCart');
            if($(rows).size()>0){
                $(rows).each(function(i,n){
                    if(countElem.eq(i).size()>0){
                        countElem.eq(i).focus(function(){
                            recountItem(i,this);
                            return false;
                        });
                    }
                    if($('a.shk-del','#shopCart').eq(i).size()>0){
                        $('a.shk-del','#shopCart').eq(i).click(function(){
                            jQuery.deleteItem(i,this);
                            return false;
                        });
                    }
                });
            }
            $('#butEmptyCart').click(function(){
                jQuery.deleteItem('all',this);
                return false;
            });
            if(window.location.href.indexOf('/'+shkOpt.orderFormPage)>-1){
                $('#butOrder').hide();
            }
            if(typeof(setCartActionsCallback)=='function')
                setCartActionsCallback();
        }


        jQuery.fillCart = function(thisForm,count,refresh){
            if(typeof(refresh)=='undefined') var refresh = true;
            if(shkOpt.debug){
                log.info('jQuery.fillCart()');
            }
            var shopCart = $('#shopCart');
            showLoading(true);
            var stuffCount = typeof(count)!='undefined' && count!='' ? '&count='+count : '';
            var getParams = '&action=fill_cart'+settings_qs+stuffCount;
            var formData = typeof(thisForm)=='object' ? $(thisForm).serialize() : 'shk-id='+thisForm;
            ajaxRequest(getParams+'&'+formData,refresh);
            if(typeof(fillCartCallback)=='function')
                fillCartCallback(thisForm);
        }



        jQuery.toCart = function(thisForm){
            var el = $("input[type='submit'],input[type='image'],button[type='submit']",thisForm).eq(0);
            var name = '';
            if($("input[name='shk-name']",thisForm).size()>0){
                name = $("input[name='shk-name']",thisForm).val();
            }else if($("h3",thisForm).size()>0){
                name = $("h3",thisForm).text();
            }
            if(shkOpt.debug){
                log.debug('jQuery.toCart(), name='+name);
            }
            switch(shkOpt.flyToCart){
                ////////////////////////////////////////////
                //&flyToCart=`helper`
                case 'helper':
                    var thisAction = function(){
                        var count = $('#stuffCount').is('*') && $('input:text','#stuffCount').val().length>0 ? parseInt($('input:text','#stuffCount').val()) : '';
                        $('#stuffHelper').animate({
                            top: cartPos.y+'px',
                            left: cartPos.x+'px'
                        },700).fadeOut(500,function(){
                            $(this).remove();
                            jQuery.fillCart(thisForm,count);
                        });
                    }
                    showHelper(el,name,shkOpt.noCounter,thisAction);
                    var cartPos = getCenterPos($('#stuffHelper'),$('#shopCart'));
                    break;
                ////////////////////////////////////////////
                //&flyToCart=`image`
                case 'image':
                    var parent = $(thisForm).parents(shkOpt.stuffCont);
                    var image = $('img.shk-image:first',parent);
                    if($(image).size()>0){
                        var cart = $('#shopCart');
                        var btPos = getPosition(image);
                        var cartPos = getCenterPos(image,cart);
                        $('img.shk-image:first',parent)
                            .clone(true)
                            .appendTo('body')
                            .css({'top':btPos.y+'px','position':'absolute','left':btPos.x+'px','opacity':0.75})
                            .animate({
                                top: cartPos.y+'px',
                                left: cartPos.x+'px'
                            },700).fadeOut(500,function(){
                            $(this).remove();
                            jQuery.fillCart(thisForm,0);
                        });
                    }else{
                        jQuery.fillCart(thisForm,0);
                    }
                    showHelper(el,langTxt['addedToCart'],true,thisAction);
                    $('#confirmButton,#cancelButton').hide();
                    clearTimeout(shk_timer);
                    shk_timer = setTimeout(function(){
                        $('#stuffHelper').fadeOut(500,function(){
                            $('#stuffHelper').remove();
                        });
                    },1000);
                    break;
                ////////////////////////////////////////////
                //&flyToCart=`nofly`
                case 'nofly':
                    jQuery.fillCart(thisForm,0);
                    showHelper(el,langTxt['addedToCart'],true,thisAction);
                    $('#confirmButton,#cancelButton').hide();
                    clearTimeout(shk_timer);
                    shk_timer = setTimeout(function(){
                        $('#stuffHelper').fadeOut(500,function(){
                            $('#stuffHelper').remove();
                        });
                    },1000);
                    break;
                ////////////////////////////////////////////
                default:
                    jQuery.fillCart(thisForm,0);
                    break;
            }
        }


        jQuery.additOpt = function(elem){
            var thisName = $(elem).attr('name');
            var thisNameArr = thisName.split('__');
            $('#add_'+thisNameArr[1]).remove();
            var additPriceSum = 0;
            var multiplication = new Array;
            var parent = $(elem).parents('form');
            $('select.addparam,input.addparam:checked',parent).each(function(i){
                var value = $(this).val();
                var valArr = value.split('__');
                var price = valArr[1]!='' && !isNaN(valArr[1]) ? parseFloat(valArr[1]) : 0;
                if(valArr[1]!='' && isNaN(valArr[1]) && valArr[1].indexOf('*')==0){
                    multiplication[multiplication.length] = parseFloat(valArr[1].replace('*',''));
                }
                additPriceSum += price;
                if(shkOpt.debug) log.debug('additOpt(): item id='+thisNameArr[1]+', name='+valArr[0]+', price='+price);
            });
            if(additPriceSum!='' && !isNaN(additPriceSum) && !shkOpt.changePrice){
                $('.shk-price:first',parent).after('<sup id="add_'+thisNameArr[1]+'" class="price-add">+'+additPriceSum+'</sup>');
                if(shkOpt.debug) log.debug('additOpt(): item id='+thisNameArr[1]+', additPriceSum='+additPriceSum);
            }else if(!isNaN(additPriceSum) && shkOpt.changePrice){
                var priceTxt = $('.shk-price:first',parent);
                var curPrice = $(priceTxt).is(":has('span')") ? $('span',priceTxt).text() : $(priceTxt).text();
                var splitted = false;
                if(curPrice.indexOf(' ')>-1){
                    curPrice = curPrice.replace(/\D* /,'');
                    splitted = true;
                }
                var newPrice = parseFloat(curPrice)+additPriceSum;
                for(var i=0;i<multiplication.length;i++){
                    newPrice = newPrice*multiplication[i];
                }
                if(splitted){
                    newPrice = shk_numFormat(newPrice);
                    curPrice = shk_numFormat(curPrice);
                }
                $(priceTxt).empty().append('<span style="display:none;">'+curPrice+'</span>'+newPrice);
                if(shkOpt.debug) log.debug('additOpt(): item id='+thisNameArr[1]+', curPrice='+curPrice+', newPrice='+newPrice);
            }
        }


        jQuery.emptyCart = function(refresh){
            if(typeof(refresh)=='undefined') var refresh = true;
            if(shkOpt.debug){
                log.info('emptyCart()');
            }
            showLoading(true);
            ajaxRequest('&action=empty&cart_tpl='+shkOpt.cartTpl[0],refresh);
            if(typeof(emptyCartCallback)=='function')
                emptyCartCallback();
        }


        jQuery.refreshCart = function(loader){
            if(typeof(loader)=='undefined') loader = true;
            if(shkOpt.debug){
                log.info('refreshCart()');
            }
            if(loader) showLoading(true);
            var getParams = '&action=refresh_cart'+settings_qs;
            ajaxRequest(getParams);
        }


        function animCartHeight(curH,newH){
            $('#shopCart')
                .css({'height':curH+'px','overflow':'hidden'})
                .animate({height:newH+'px'},500,function(){
                    $(this).css({'overflow':'visible','height':'auto'});
                });
        }


        $(document).ready(function(){
            setCartActions();
            if(window.location.href.indexOf('/'+shkOpt.orderFormPage)>-1){
                $('#butOrder').hide();
            }
            $('select.addparam,input.addparam:checked',shkOptions.stuffCont).each(function(){
                jQuery.additOpt(this);
            });
            if(shkOpt.debug){
                log.info('window.location.href = '+window.location.href);
                log.info('navigator.userAgent = '+navigator.userAgent);
            }
        });
    }
})(jQuery);
