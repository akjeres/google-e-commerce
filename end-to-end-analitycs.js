var colors_dict = [{"name":"черный","hex":"#000000","id":"18"},{"name":"серый темный","hex":"#616161","id":"318"},{"name":"серый","hex":"#868686","id":"26"},{"name":"серый светл.","hex":"#cfcfcf","id":"313"},{"name":"белый","hex":"#ffffff","id":"16"},{"name":"молочный","hex":"#fffaee","id":"235"},{"name":"коричн. темн.","hex":"#411700","id":"115"},{"name":"коричневый","hex":"#77432b","id":"19"},{"name":"бордо","hex":"#770b0b","id":"250"},{"name":"коричн. светл.","hex":"#a57345","id":"108"},{"name":"зеленый","hex":"#458657","id":"48"},{"name":"хаки","hex":"#757226","id":"316"},{"name":"желтый","hex":"#fdf162","id":"66"},{"name":"бежевый","hex":"#f8e5c2","id":"64"},{"name":"песочный","hex":"#f0ce79","id":"314"},{"name":"рыжий","hex":"#e99e00","id":"17"},{"name":"оранжевый","hex":"#ff6600","id":"252"},{"name":"красный","hex":"#ff0000","id":"69"},{"name":"розовый","hex":"#ff8ffb","id":"86"},{"name":"сиреневый","hex":"#b179c7","id":"315"},{"name":"фиолетовый","hex":"#7125ad","id":"67"},{"name":"синий темный","hex":"#354780","id":"319"},{"name":"синий","hex":"#4950e6","id":"65"},{"name":"голубой","hex":"#79bfff","id":"20"},{"name":"серый светл.","hex":"#d8d8d8","id":"347"},{"name":"желтый","hex":"#fff846","id":"361"},{"name":"оранжевый","hex":"#ffbf36","id":"362"},{"name":"рыжий","hex":"#ff9900","id":"363"},{"name":"розовый","hex":"#ffaaaa","id":"364"},{"name":"красный","hex":"#ff4444","id":"365"},{"name":"фиолетовый","hex":"#7e0dc9","id":"366"},{"name":"голубой","hex":"#85c4ff","id":"368"},{"name":"зеленый","hex":"#4aa35c","id":"369"},{"name":"бордо","hex":"#940041","id":"370"},{"name":"коричневый светлый","hex":"#b38c69","id":"358"},{"name":"коричневый","hex":"#864a4a","id":"359"},{"name":"коричневый темн.","hex":"#663939","id":"360"},{"name":"синий","hex":"#594bff","id":"367"},{"name":"синий темный","hex":"#414183","id":"348"},{"name":"серый темный","hex":"#6b6b6b","id":"349"},{"name":"песочный","hex":"#d8c27d","id":"352"},{"name":"черный","hex":"#3a3a3a","id":"353"},{"name":"серый","hex":"#979797","id":"354"},{"name":"белый","hex":"#fdfdfd","id":"355"},{"name":"молочный","hex":"#fffcee","id":"356"},{"name":"бежевый","hex":"#f7f1e1","id":"357"},{"name":"нет","hex":"","id":"424"}];
(function() {

    // проверяем поддержку
    if (!Element.prototype.matches) {

        // определяем свойство
        Element.prototype.matches = Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;

    }

})();
(function() {

    // проверяем поддержку
    if (!Element.prototype.closest) {

        // реализуем
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
    window.addEventListener('load', function (e) {
        if (!dataLayer) return; // Prevent actions without GTM
        var productArr = document.querySelectorAll('.prod-list');
        if (!(productArr || productArr.length)) return;

        console.log('events 1,2');
        // Event #1: Product view

        // Product view end

        // Event #2: Click on the Product
        document.addEventListener('click', function(e) {
            var target = e.target;
            if (!target.closest('a.prod-list-img') && !target.closest('a.prod-list-more')) return;
            
            console.log('event 2');
            target = target.closest('a.prod-list-img') || target.closest('a.prod-list-more');

            event2Handler({
                name: 'Шуба из меха норки Анастасия',
                id: '8097',
                price: '47800',
                brand: 'Норковые шубы (все)',
                cat: 'ШУБЫ',
                variant: 'не выбрано',
                position: '1',
                url: 'http://195.123.195.107/ru/8097-shuba-iz-mekha-norki-anastasiya',
            });
        })
        // Click on the Product end

        // Event #3: Product Details view

        // Product Details view end

        // Event #4: Adding Product to Cart

        // Adding Product to Cart end

        // Event #5: Removing Product from Cart

        // Removing Product from Cart end

        // Event #6: Checkout
            // Event #6.1: Button click
            // Event #6.1 end

            // Event #6.2: Successful form submitting
            // Event #6.2 end

            // Event #6.3: Buy in one click
            // Event #6.3 end
        // Checkout end

    });
})();

function event2Handler (productObj) {
    dataLayer.push({
        'event': 'productClick',
        'ecommerce': {
            'click': {
                'products': [{
                    'name': productObj.name,
                    'id': productObj.id,
                    'price': productObj.price,
                    'brand': productObj.brand,
                    'category': productObj.cat,
                    'variant': productObj.variant,
                    'position': productObj.position
                }]
            }
        },
        'eventCallback': function() {
            document.location = productObj.url;
        }
    });
}