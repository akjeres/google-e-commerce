window.onload = function(){
    FBmodule.press_only_num('bc_phone');
    FBmodule.press_only_num('fb_phone');
    FBmodule.press_only_num('fbWind_phone');
    FBmodule.press_only_num('oc_phone');
    FBmodule.press_only_num('ocSHK_phone');
    FBmodule.press_only_num('ocShort_phone');

}

var FBmodule = {
    url_send : '/assets/modules/feedback_module/ajax.php',
    ajax : (window.XMLHttpRequest)? new XMLHttpRequest() : ((window.ActiveXObject("Msxml2.XMLHTTP"))? new ActiveXObject("Msxml2.XMLHTTP") : new ActiveXObject("Microsoft.XMLHTTP")),
    nameClassError : 'validate-fld-error',
    id_product : 0,
    name_product : '',
    price_product : 0,
    count_product : 0,
    roundToPoint : 2,
    dec_point : '.',
    thousands_sep : ' ',
    elmNotType : 'submit|button',
    fancybox : window.$.fancybox,
    dataFl : function(id){},
    bc_goto : '',
    fb_goto : '',
    oc_goto : '',
    checkId : function(id){
        if(document.getElementById(id)!=null){return true;}
        else{return false;}
    },
    sendForm_bc : function (lang,subj,pref){
        var url = FBmodule.url_send, data='',data_msg,f=0;

        pref = (pref === undefined || pref.length == 0)? '' : pref;
        var msg = document.getElementById('msg_bc'+pref);
        msg.innerHTML = '';

        data = 'lang='+lang+'&mail_subject='+encodeURIComponent(subj)+'&page='+encodeURIComponent(window.location.pathname);

        var fr = document.getElementById('bcform'+pref);
        fr.onsubmit = function(){return false};

        var bt = fr.getElementsByTagName('button')[0];
        //	var bt = document.getElementsByClassName('btn-send-back-call')[0];
        bt.disabled = true;
        for(var i=0; i<fr.length; i++){
            var elm = fr.elements[i];
            if(elm.name.indexOf('additional_values_') == -1)
                data+='&fdata['+elm.name+'][value]='+encodeURIComponent(elm.value)+'&fdata['+elm.name+'][check]='+encodeURIComponent(elm.getAttribute('data-fl-check'));
            else
                data+='&fdata['+elm.name+'][check]='+encodeURIComponent(elm.getAttribute('data-fl-check'));
        }
        FBmodule.ajax.open('POST', url+'?action=data_bc', true);
        FBmodule.ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        FBmodule.ajax.send(data + '&' + $(fr).serialize());
        FBmodule.ajax.onreadystatechange = function (){
            if(FBmodule.ajax.readyState == 4){
                if (FBmodule.ajax.status == 200){
                    var response = FBmodule.ajax.responseText;
                    if(response == 'ok'){
                        if(FBmodule.bc_goto.length > 0)
                            window.location.href = FBmodule.bc_goto;
                        else
                            FBmodule.fancybox({ href : '#bc_success'+pref, wrapCSS:'modal_bc_success'+pref });
                        fr.reset();
                    }
                    else{
                        data_msg = JSON.parse(response);
                        msg.innerHTML = data_msg.msg;
                        for(var i=0; i<fr.length; i++){
                            var elm = fr.elements[i];
                            if( FBmodule.elmNotType.indexOf(elm.type) == -1 ){
                                if(data_msg.fl[elm.name]){
                                    if(f == 0){f=1;elm.focus();}
                                    elm.parentNode.setAttribute('class',FBmodule.nameClassError);
                                }
                                else
                                    elm.parentNode.setAttribute('class','');
                            }
                        }
                    }
                }
                else
                    alert('Error! Status code '+FBmodule.ajax.status);

                bt.disabled = false;
            }
        }
    },
    sendForm_fb : function (lang,subj,pref){
        var url = FBmodule.url_send, data='',data_msg,f=0;

        pref = (pref === undefined || pref.length == 0)? '' : pref;
        var msg = document.getElementById('msg_fb'+pref);
        msg.innerHTML = '';

        data = 'lang='+lang+'&mail_subject='+encodeURIComponent(subj);

        var fr = document.getElementById('fbform'+pref);
        fr.onsubmit = function(){return false};

        var bt = fr.getElementsByTagName('button')[0];
        bt.disabled = true;
        for(var i=0; i<fr.length; i++){
            var elm = fr.elements[i];
            if(elm.name.indexOf('additional_values_') == -1)
                data+='&fdata['+elm.name+'][value]='+encodeURIComponent(elm.value)+'&fdata['+elm.name+'][check]='+encodeURIComponent(elm.getAttribute('data-fl-check'));
            else
                data+='&fdata['+elm.name+'][check]='+encodeURIComponent(elm.getAttribute('data-fl-check'));
        }
        FBmodule.ajax.open('POST', url+'?action=data_fb', true);
        FBmodule.ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        FBmodule.ajax.send(data + '&' + $(fr).serialize());
        FBmodule.ajax.onreadystatechange = function (){
            if(FBmodule.ajax.readyState == 4){
                if (FBmodule.ajax.status == 200){
                    var response = FBmodule.ajax.responseText;
                    if(response == 'ok'){
                        if(FBmodule.fb_goto.length > 0)
                            window.location.href = FBmodule.fb_goto;
                        else
                            fr.parentNode.innerHTML = document.getElementById('fb_success'+pref).innerHTML;
                    }
                    else{
                        data_msg = JSON.parse(response);
                        msg.innerHTML = data_msg.msg;
                        for(var i=0; i<fr.length; i++){
                            var elm = fr.elements[i];
                            if( FBmodule.elmNotType.indexOf(elm.type) == -1 ){
                                if(data_msg.fl[elm.name]){
                                    if(f == 0){f=1;elm.focus();}
                                    elm.parentNode.setAttribute('class',FBmodule.nameClassError);
                                }
                                else
                                    elm.parentNode.setAttribute('class','');
                            }
                        }
                    }
                }
                else
                    alert('Error! Status code '+FBmodule.ajax.status);

                bt.disabled = false;
            }
        }
    },
    sendForm_fbWind : function (lang,subj,pref){
        var url = FBmodule.url_send, data='',data_msg,f=0;

        pref = (pref === undefined || pref.length == 0)? '' : pref;
        var msg = document.getElementById('msg_fbWind'+pref);
        msg.innerHTML = '';

        data = 'lang='+lang+'&mail_subject='+encodeURIComponent(subj);

        var fr = document.getElementById('fbformWind'+pref);
        fr.onsubmit = function(){return false};

        var bt = fr.getElementsByTagName('button')[0];
        bt.disabled = true;
        for(var i=0; i<fr.length; i++){
            var elm = fr.elements[i];
            if(elm.name.indexOf('additional_values_') == -1)
                data+='&fdata['+elm.name+'][value]='+encodeURIComponent(elm.value)+'&fdata['+elm.name+'][check]='+encodeURIComponent(elm.getAttribute('data-fl-check'));
            else
                data+='&fdata['+elm.name+'][check]='+encodeURIComponent(elm.getAttribute('data-fl-check'));
        }
        FBmodule.ajax.open('POST', url+'?action=data_fb', true);
        FBmodule.ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        FBmodule.ajax.send(data + '&' + $(fr).serialize());
        FBmodule.ajax.onreadystatechange = function (){
            if(FBmodule.ajax.readyState == 4){
                if (FBmodule.ajax.status == 200){
                    var response = FBmodule.ajax.responseText;
                    if(response == 'ok'){
                        if(FBmodule.fb_goto.length > 0)
                            window.location.href = FBmodule.fb_goto;
                        else
                            FBmodule.fancybox({ href : '#fb_successWind'+pref, wrapCSS:'modal_fb_success'+pref });
                        fr.reset();
                    }
                    else{
                        data_msg = JSON.parse(response);
                        msg.innerHTML = data_msg.msg;
                        for(var i=0; i<fr.length; i++){
                            var elm = fr.elements[i];
                            if( FBmodule.elmNotType.indexOf(elm.type) == -1 ){
                                if(data_msg.fl[elm.name]){
                                    if(f == 0){f=1;elm.focus();}
                                    elm.parentNode.setAttribute('class',FBmodule.nameClassError);
                                }
                                else
                                    elm.parentNode.setAttribute('class','');
                            }
                        }
                    }
                }
                else
                    alert('Error! Status code '+FBmodule.ajax.status);

                bt.disabled = false;
            }
        }
    },
    sendForm_oc : function (fr){
        fr.onsubmit = function(){return false;};
        var msg = document.getElementById('ocWind_msg');
        msg.innerHTML = '';
        var url = FBmodule.url_send+'?action=data_oc';

        var url_img = fr.oc_img_product.value;
        var name = fr.oc_name_product.value;
        var price = fr.oc_price.value;
        var count = (fr.oc_count !== undefined)? parseInt(fr.oc_count.value) : 1;

        document.getElementById('ocWind_img_product').src = url_img;
        document.getElementById('ocWind_name_product').innerHTML = name;
        document.getElementById('ocWind_price').innerHTML = price;
        document.getElementById('ocWind_sum').innerHTML = FBmodule.number_format((count * price), FBmodule.roundToPoint, FBmodule.dec_point, FBmodule.thousands_sep);
        document.getElementById('ocWind_count').value = count;

        FBmodule.fancybox({ href:"#ocWind", wrapCSS:'modal_one_click' });

        FBmodule.press_only_num('ocWind_count');
        document.getElementsByClassName('ocWind_minus')[0].onclick = function(){
            var val = parseInt( document.getElementById('ocWind_count').value );
            if((val-1)!=0)
                val--;
            document.getElementById('ocWind_count').value = val;

            document.getElementById('ocWind_sum').innerHTML = FBmodule.number_format(val*price, FBmodule.roundToPoint, FBmodule.dec_point, FBmodule.thousands_sep);
        }
        document.getElementsByClassName('ocWind_plus')[0].onclick = function(){
            var val = parseInt( document.getElementById('ocWind_count').value );
            val++;
            document.getElementById('ocWind_count').value = val;

            document.getElementById('ocWind_sum').innerHTML = FBmodule.number_format(val*price, FBmodule.roundToPoint, FBmodule.dec_point, FBmodule.thousands_sep);
        }

        document.getElementById('ocWind_count').onkeyup = function(e) {
            var val = parseInt( document.getElementById('ocWind_count').value );
            document.getElementById('ocWind_sum').innerHTML = FBmodule.number_format(val*price, FBmodule.roundToPoint, FBmodule.dec_point, FBmodule.thousands_sep);
        }

        document.getElementById('ocWind_send_order').onclick = function(){
            var ocfr = document.getElementById('ocWind_form');
            document.getElementById('ocWind_send_order').disabled = true;
            var data = '';
            for(var i=0; i<ocfr.length; i++){
                var elm = ocfr.elements[i];
                if( (elm.name != 'lang' || elm.name != 'mail_subject') && (elm.name.indexOf('additional_values_') == -1) )
                    data+='&fdata['+elm.name+'][value]='+encodeURIComponent(elm.value)+'&fdata['+elm.name+'][check]='+encodeURIComponent(elm.getAttribute('data-fl-check'));
                else
                    data+='&fdata['+elm.name+'][check]='+encodeURIComponent(elm.getAttribute('data-fl-check'));
            }

            data+='&fdata[id_product][value]='+encodeURIComponent(fr.oc_id_product.value);
            data+='&fdata[name_product][value]='+encodeURIComponent(fr.oc_name_product.value);
            data+='&fdata[price][value]='+encodeURIComponent(fr.oc_price.value);
            data+='&fdata[count][value]='+encodeURIComponent(document.getElementById('ocWind_count').value);

            FBmodule.ajax.open('POST', url, true);
            FBmodule.ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            FBmodule.ajax.send(data + '&' + $(ocfr).serialize());
            FBmodule.ajax.onreadystatechange = function (){
                if(FBmodule.ajax.readyState == 4){
                    if (FBmodule.ajax.status == 200){
                        var response = FBmodule.ajax.responseText;
                        if(response == 'ok'){
                            if(FBmodule.oc_goto.length > 0)
                                window.location.href = FBmodule.oc_goto;
                            else
                                FBmodule.fancybox({ href:'#ocWind_success', wrapCSS:'modal_oc_success' });
                            ocfr.reset();
                        }
                        else{
                            data_msg = JSON.parse(response);
                            msg.innerHTML = data_msg.msg;
                            var f=0;
                            for(var i=0; i<ocfr.length; i++){
                                var elm = ocfr.elements[i];
                                if( FBmodule.elmNotType.indexOf(elm.type) == -1 ){
                                    if(data_msg.fl[elm.name]){
                                        if(f == 0){f=1;elm.focus();}
                                        elm.parentNode.setAttribute('class',FBmodule.nameClassError);
                                    }
                                    else
                                        elm.parentNode.setAttribute('class','');
                                }
                            }
                        }
                    }

                    document.getElementById('ocWind_send_order').disabled = false;
                }
            }
        }
    },
    sendForm_ocShort : function (fr,lang,subj){
        fr.onsubmit = function(){return false;};
        var msg = document.getElementById('ocShort_msg');
        msg.innerHTML = '';
        var url = FBmodule.url_send+'?action=data_oc';
        var data = '';
        data = 'lang='+lang+'&mail_subject='+encodeURIComponent(subj);

        for(var i=0; i<fr.length; i++){
            var elm = fr.elements[i];
            if(elm.name == 'oc_id_product')
                data+='&fdata[id_product][value]='+encodeURIComponent(fr.oc_id_product.value);
            else if(elm.name == 'oc_name_product')
                data+='&fdata[name_product][value]='+encodeURIComponent(fr.oc_name_product.value);
            else if(elm.name == 'oc_price')
                data+='&fdata[price][value]='+encodeURIComponent(fr.oc_price.value);
            else if(elm.name.indexOf('additional_values_') == -1)
                data+='&fdata['+elm.name+'][value]='+encodeURIComponent(elm.value)+'&fdata['+elm.name+'][check]='+encodeURIComponent(elm.getAttribute('data-fl-check'));
            else
                data+='&fdata['+elm.name+'][check]='+encodeURIComponent(elm.getAttribute('data-fl-check'));
        }

        var bt = fr.getElementsByTagName('button')[0];
        bt.disabled = true;

        FBmodule.ajax.open('POST', url, true);
        FBmodule.ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        FBmodule.ajax.send(data + '&' + $(fr).serialize());
        FBmodule.ajax.onreadystatechange = function (){
            if(FBmodule.ajax.readyState == 4){
                if (FBmodule.ajax.status == 200){
                    var response = FBmodule.ajax.responseText;
                    if(response == 'ok'){
                        if(FBmodule.oc_goto.length > 0)
                            window.location.href = FBmodule.oc_goto;
                        else
                            FBmodule.fancybox({ href:'#ocShort_success', wrapCSS:'modal_ocShort_success' });
                        fr.reset();
                    }
                    else{
                        data_msg = JSON.parse(response);
                        msg.innerHTML = data_msg.msg;
                        var f=0;
                        for(var i=0; i<fr.length; i++){
                            var elm = fr.elements[i];
                            if( FBmodule.elmNotType.indexOf(elm.type) == -1 ){
                                if(data_msg.fl[elm.name]){
                                    if(f == 0){f=1;elm.focus();}
                                    elm.parentNode.setAttribute('class',FBmodule.nameClassError);
                                }
                                else
                                    elm.parentNode.setAttribute('class','');
                            }
                        }
                    }
                }

                bt.disabled = false;
            }
        }
    },
    press_only_num : function (id){
        if(document.getElementById(id)!=null){
            document.getElementById(id).onkeypress = function(e) {
                e = e || event;
                if (e.ctrlKey || e.altKey || e.metaKey) return;

                var chr = FBmodule.getChar(e);

                if (chr == null) return;

                if (chr < '0' || chr > '9') {
                    return false;
                }
            }
        }
    },
    getChar : function (event){
        if(event.which == null){
            if (event.keyCode < 32) return null;
            return String.fromCharCode(event.keyCode) // IE
        }

        if(event.which != 0 && event.charCode != 0){
            if (event.which < 32) return null;
            return String.fromCharCode(event.which) // остальные
        }
        return null; // специальная клавиша
    },
    number_format : function (number, decimals, dec_point, thousands_sep) {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ' ' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if(s[0].length > 3){
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if((s[1] || '').length < prec){
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

}