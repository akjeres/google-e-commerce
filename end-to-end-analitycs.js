var colors_dict = [{"name":"черный","hex":"#000000","id":"18"},{"name":"серый темный","hex":"#616161","id":"318"},{"name":"серый","hex":"#868686","id":"26"},{"name":"серый светл.","hex":"#cfcfcf","id":"313"},{"name":"белый","hex":"#ffffff","id":"16"},{"name":"молочный","hex":"#fffaee","id":"235"},{"name":"коричн. темн.","hex":"#411700","id":"115"},{"name":"коричневый","hex":"#77432b","id":"19"},{"name":"бордо","hex":"#770b0b","id":"250"},{"name":"коричн. светл.","hex":"#a57345","id":"108"},{"name":"зеленый","hex":"#458657","id":"48"},{"name":"хаки","hex":"#757226","id":"316"},{"name":"желтый","hex":"#fdf162","id":"66"},{"name":"бежевый","hex":"#f8e5c2","id":"64"},{"name":"песочный","hex":"#f0ce79","id":"314"},{"name":"рыжий","hex":"#e99e00","id":"17"},{"name":"оранжевый","hex":"#ff6600","id":"252"},{"name":"красный","hex":"#ff0000","id":"69"},{"name":"розовый","hex":"#ff8ffb","id":"86"},{"name":"сиреневый","hex":"#b179c7","id":"315"},{"name":"фиолетовый","hex":"#7125ad","id":"67"},{"name":"синий темный","hex":"#354780","id":"319"},{"name":"синий","hex":"#4950e6","id":"65"},{"name":"голубой","hex":"#79bfff","id":"20"},{"name":"серый светл.","hex":"#d8d8d8","id":"347"},{"name":"желтый","hex":"#fff846","id":"361"},{"name":"оранжевый","hex":"#ffbf36","id":"362"},{"name":"рыжий","hex":"#ff9900","id":"363"},{"name":"розовый","hex":"#ffaaaa","id":"364"},{"name":"красный","hex":"#ff4444","id":"365"},{"name":"фиолетовый","hex":"#7e0dc9","id":"366"},{"name":"голубой","hex":"#85c4ff","id":"368"},{"name":"зеленый","hex":"#4aa35c","id":"369"},{"name":"бордо","hex":"#940041","id":"370"},{"name":"коричневый светлый","hex":"#b38c69","id":"358"},{"name":"коричневый","hex":"#864a4a","id":"359"},{"name":"коричневый темн.","hex":"#663939","id":"360"},{"name":"синий","hex":"#594bff","id":"367"},{"name":"синий темный","hex":"#414183","id":"348"},{"name":"серый темный","hex":"#6b6b6b","id":"349"},{"name":"песочный","hex":"#d8c27d","id":"352"},{"name":"черный","hex":"#3a3a3a","id":"353"},{"name":"серый","hex":"#979797","id":"354"},{"name":"белый","hex":"#fdfdfd","id":"355"},{"name":"молочный","hex":"#fffcee","id":"356"},{"name":"бежевый","hex":"#f7f1e1","id":"357"},{"name":"нет","hex":"","id":"424"}];
(function() {

    // check support
    if (!Element.prototype.matches) {

        // define property
        Element.prototype.matches = Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;

    }

})();
(function () {
    if (!Array.prototype.some) {
        Array.prototype.some = function(fun, thisArg) {
            'use strict';

            if (this == null) {
                throw new TypeError('Array.prototype.some called on null or undefined');
            }

            if (typeof fun !== 'function') {
                throw new TypeError();
            }

            var t = Object(this);
            var len = t.length >>> 0;

            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(thisArg, t[i], i, t)) {
                    return true;
                }
            }

            return false;
        };
    }
})();
(function() {

    // check support
    if (!Element.prototype.closest) {

        // realize
        Element.prototype.closest = function(css) {
            var node = this;

            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }

})();
(function(){
    var mobileWidth = 481;
    var productIdentifier = '.prod-list';
    var analiticsIdentifier = '.div--for-analitycs_short';
    window.addEventListener('load', function (event) {
        if (!dataLayer) return; // Prevent actions without GTM
        var productArr = document.querySelectorAll(productIdentifier);
        if (!(productArr || productArr.length)) return;

        // Event #1: Product view
        var shownProducts = [];
        var shownProductsData = [];
        function pushItemToCollection (item, collection) {
            var iH = Math.ceil(window.innerHeight);
            var iW = Math.ceil(window.innerWidth);
            var rect = item.getBoundingClientRect();
            var h = rect.height;
            h = Math.round(h*0.67);
            var top = Math.floor(rect.top);
            top = (mobileWidth < iW) ? top : top + h;   // Enough top position
            var topFlag = top >= 0 && top <= iH;
            var bottom = Math.floor(rect.bottom);
            var bottomFlag = bottom >=0 && bottom <= iH;
            if (!(topFlag && bottomFlag)) return;       // If there is element doesn't shown enough
            if (collection.some(function (i) {
                    var iData;
                    var itemData;
                    try {
                        if (!'analitics' in i.dataset) return true;
                        if (!'analitics' in item.dataset) return true;
                        iData = JSON.parse(i.dataset['analitics']);
                        itemData = JSON.parse(item.dataset['analitics']);
                    } catch (e) {
                        console.error(e.message);
                        return true;
                    };
                    return iData['id'] == itemData['id'];
                })) return;      // If item was not shown before


            collection.push(item);
            shownProductsData = collection.map(function (it) {
                return getProcessedObj(getDataFromProductShortCard(it, productIdentifier, analiticsIdentifier));
            });
        }
        Array.prototype.forEach.call(productArr, function(el) {
            pushItemToCollection(el, shownProducts);
        });

        // Add extra window's height change listener
        var hL = document.createElement('iframe');
        hL.setAttribute('tabindex', -1);
        hL.classList.add('height-change-listener');
        document.body.appendChild(hL);
        $(hL).css({
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            height: '100%',
            width: 0,
            border: 0,
            backgroundColor: 'transparent',
            zIndex: -1
        });
        // Add extra window's height change listener end
        $(hL).each(function() {
            $(this.contentWindow).resize(function() {
                setTimeout(function() {
                    Array.prototype.forEach.call(document.querySelectorAll(productIdentifier), function(el) {
                        pushItemToCollection(el, shownProducts);
                    });
                },100);
            });
        })
        window.addEventListener('resize', function(e) {
            Array.prototype.forEach.call(document.querySelectorAll(productIdentifier), function(el) {
                pushItemToCollection(el, shownProducts);
            });
        });
        window.addEventListener('scroll' , function(e) {
            Array.prototype.forEach.call(document.querySelectorAll(productIdentifier), function(el) {
                pushItemToCollection(el, shownProducts);
            });
        })

        window.addEventListener('beforeunload', function (e) {
            event1Handler(shownProductsData);
        });
        // Product view end

        // Event #2: Click on the Product
        document.addEventListener('click', function(e) {
            var target = e.target;
            if (!target.closest('a.prod-list-img') && !target.closest('a.prod-list-more')) return;
            target = target.closest('a.prod-list-img') || target.closest('a.prod-list-more');

            event2Handler(getDataFromProductShortCard(target, productIdentifier, analiticsIdentifier));
        })
        // Click on the Product end
    });
})();
(function() {
    // Event #3: Product Details view
    var moreButtonSelector = '.show-more-params';
    var productSelector = 'section.prod-page--analytics';
    var orderButtonSelector = 'input.cart-pop-tocart_btn';

    window.addEventListener('load', function(event) {
        if (!(document.querySelectorAll(moreButtonSelector) && document.querySelectorAll(moreButtonSelector).length == 1)) return;
        var moreButton = document.querySelector(moreButtonSelector);

        var parent = moreButton.closest(productSelector);
        if (!parent) return;
        var event3Data = getDataFromProductShortCard(moreButton, productSelector, '.rows-params');
        delete event3Data['position'];
        delete event3Data['url'];
        var moreClickCounter = 0;
        moreButton.addEventListener('click', function(e) {
            var target = e.target;
            if (!(moreClickCounter % 2)) event3Handler(getProcessedObj(event3Data));
            moreClickCounter++;
        })


        // Event #6.1: Redirect to Cart
        if (!(document.querySelectorAll(orderButtonSelector) && document.querySelectorAll(orderButtonSelector).length == 1)) return;
        var placeOrderButton = document.querySelector(orderButtonSelector);
        var amountInput = document.getElementById('oc_count');

        placeOrderButton.addEventListener('click', function(e) {
            var amount = (amountInput) ? amountInput['value'] + '' : '1';
            event62Handler(getDataForBuyInOneClick(amount), 'Redirect to Cart');
        });
    });
    // Product Details view end
})();
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        toString: function() {
            return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
        }
    } : null;
}
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
};
function getDataFromProductShortCard(node, selectorForParent, selectorForDataNode) {
    var data = {};
    var parent = node.closest(selectorForParent);
    if (!parent) return data;

    try {
        data = JSON.parse(parent.dataset['analitics']);
    } catch (e) {
        data = {};
        console.error(e.message);
    }

    if (isEmpty(data)) return data;
    var arrayForIndex = document.querySelectorAll(selectorForParent);
    data['position'] = Array.prototype.indexOf.call(arrayForIndex, parent) + 1;
    data['position'] += '';
    var extra = parent.querySelector(selectorForDataNode);
    if ((!extra) || (extra.innerHTML == '')) return data;

    var colorValue = getExtraValueFromData(extra.querySelector('.param_inside_row_15'), '.param_inside_value');
    if (colorValue) {
        data['variant'] = colorValue;
    }
    var brandValue = getExtraValueFromData(extra.querySelector('.param_inside_row_11'), '.param_inside_value');
    if (brandValue) {
        data['brand'] = brandValue;
    }
    var categoryValue = getExtraValueFromData(extra.querySelector('.param_inside_row_38'), '.param_inside_value');
    if (categoryValue) {
        data['cat'] = categoryValue;
    }

    return data;
};
function getExtraValueFromData(rowNode, slectorForCell) {
    var result = [];
    if (!rowNode) return;

    var cellNode = rowNode.querySelector(slectorForCell);
    if (!cellNode) return;

    if (cellNode.querySelector('.pr-value')) {
        Array.prototype.forEach.call(cellNode.querySelectorAll('.pr-value'), function (i) {
            var bkgClr = i.style.backgroundColor;
            if (bkgClr) {
                var cDL = colors_dict.length;
                for (var j = 0; j < cDL; j++) {
                    if (bkgClr == hexToRgb(colors_dict[j]['hex']).toString()) {
                        result.push(colors_dict[j]['name']);
                        break;
                    }
                }
            } else {
                result.push(i.textContent.trim());
            }
        });
        result = result.join(', ');
    } else {
        result = cellNode.textContent.trim();
    }
    return result;
};
function getProcessedObj(obj) {
    var currentDict = [
        'name',
        'id',
        'price',
        'brand',
        'cat',
        'variant',
        'position',
    ];
    var resultDitc = currentDict.concat();
    resultDitc[4] = 'category';
    var result = {};
    var length = resultDitc.length;
    for (var i = 0; i < length; i++) {
        if (currentDict[i] in obj) {
            result[resultDitc[i]] = obj[currentDict[i]];
        }
    }

    if (isNaN(result['price']) || Number((result['price'] + '').replace(/\s/, '')) == 0) {
        result['price'] = 'not provided';
    }

    return result;
};
function event1Handler(array) {
    if (!(array && array.length)) return;

    dataLayer.push({
        'ecommerce': {
            'currencyCode': 'UAH',
            'impressions': array
        }
    });
};
function event2Handler (productObj) {
    if (isEmpty(productObj)) return;
    var data = {
        'event': 'productClick',
        'ecommerce': {
            'click': {
                'products': [getProcessedObj(productObj)]
            }
        }
    };
    if ('url' in productObj) {
        data['eventCallback'] = function() {
            document.location = productObj['url'];
        };
    }
    dataLayer.push(data);
};
function event3Handler(productObj) {
    if (isEmpty(productObj)) return;
    var objToProvide = getProcessedObj(productObj);
    var data = {
        'ecommerce': {
            'detail': {
                'actionField': {'list': 'Страница товара'},    // 'detail' actions have an optional list property.
                'products': [objToProvide]
            }
        }
    };
    dataLayer.push(data);
}
function event4Handler(data) {
    var dataToPush = {
        'event': 'addToCart',
        'ecommerce': {
            'currencyCode': 'UAH',
            'add': {
                'products': [data]
            }
        }
    };
    dataLayer.push(dataToPush);
}
function getDataFromCartForEvent4Handler(obj, category_ID, brand_ID, variant_ID) {
    var category = getExtraValueFromData(document.querySelector('.param_inside_row_' + category_ID), '.param_inside_value');
    var brand = getExtraValueFromData(document.querySelector('.param_inside_row_' + brand_ID), '.param_inside_value');
    var variant = getExtraValueFromData(document.querySelector('.param_inside_row_' + variant_ID), '.param_inside_value');
    var result = {};
    if ('pop_title_prod' in obj) {
        result['name'] = obj['pop_title_prod'];
    };
    if ('pop_articul' in obj) {
        result['id'] = obj['pop_articul'];
    };
    if ('pop_price' in obj) {
        result['price'] = obj['pop_price'].replace(/\s/, '');
        if (isNaN(result['price']) || Number(result['price']) == 0) {
            result['price'] = 'not provided';
        }
    };
    if ('pop_total_items' in obj) {
        result['quantity'] = obj['pop_total_items'] + '';
    };
    if (category) {
        result['category'] = category;
    };
    if (brand) {
        result['brand'] = brand;
    };
    if (variant) {
        result['variant'] = variant;
    };

    return result;
}
function event62Handler(data) {
    var step = arguments[1] ? arguments[1] : 2;
    var destination = arguments[2] ? arguments[2] : '/ru/cart';
    var processedData = Array.isArray(data) ? data : [data];
    var dataToPush = {
        'event': 'checkout',
        'ecommerce': {
            'checkout': {
                'actionField': {'step': step },
                'products': processedData
            }
        },
        'eventCallback': function() {
            document.location = window.location.origin + destination;
        }
    };
    dataLayer.push(dataToPush);
}
function getDataForBuyInOneClick(amount) {
    var moreButtonSelector = '.show-more-params';
    if (!document.querySelector(moreButtonSelector)) {
        moreButtonSelector = '.prod-page-params_outer'
    }
    var productSelector = 'section.prod-page--analytics';
    var eventData = getDataFromProductShortCard(document.querySelector(moreButtonSelector), productSelector, '.rows-params');
    delete eventData['position'];
    delete eventData['url'];

    var result = getProcessedObj(eventData);
    result['quantity'] = amount + '';

    return result;
}