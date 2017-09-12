(function ($) {

  var delKeys = [8, 46]
  var keys = [8, 9, 16, 17, 36, 37, 38, 39, 40, 46, 91]

  $.fn.apart_num = function () {

    return this.each(function () {
      var timeOut = null;
      var cleanValue = '';
      var input = $(this);

      function _render (self) {
        var value = self.value;

        var isFirstDigit = /^[1-9]{1}/.test(value)

        var out = !isFirstDigit ? '' : value.replace(/[^a-zа-я\d]/gi, '').substr(0,6)

        self.value = out
      }

      input.on('keyup', function (event) {
        var self = this;

        if (delKeys.indexOf(event.keyCode) !== -1) {
          var $value = self.value;

          if(timeOut) {
            clearTimeout(timeOut)
            timeOut = null
          }
          timeOut = setTimeout(function () {
            $(self).data('cleanValue', $value.replace(/\D/g, '').substr(1))
          }, 500)
        }

        if (keys.indexOf(event.keyCode) !== -1) return

        _render(self)
      })
      .on('change', function (event) {
        _render(this)
      })
    })
  }

  $.fn.maskMoney = function ($max) {

    var max = $max || 5

    return this.each(function () {
      var timeOut = null;
      var cleanValue = '';
      var input = $(this);

      function _render (self) {
        var value = self.value;
        var out = value.replace(/\D/g, '')

        if (out.length > max) {
          out = out.substr(0, max)
        }

        self.value = out
      }

      input.on('keyup', function (event) {
        var self = this;

        if (delKeys.indexOf(event.keyCode) !== -1) {
          var $value = self.value;

          if(timeOut) {
            clearTimeout(timeOut)
            timeOut = null
          }
          timeOut = setTimeout(function () {
            $(self).data('cleanValue', $value.replace(/\D/g, '').substr(1))
          }, 500)
        }

        if (keys.indexOf(event.keyCode) !== -1) return

        _render(self)
      })
      .on('change', function (event) {
        _render(this)
      })
    })
  }

  $.fn.maskMobile = function () {
    var exp = [
      [/^(\+?\d{0,1})$/, '$1'],
      [/^(\+?\d{1})?(\d{0,3})$/, '$1 ($2'],
      [/^(\+?\d{1})?(\d{3})(\d{0,3})$/, '$1 ($2) $3'],
      [/^(\+?\d{1})?(\d{3})(\d{3})(\d{0,4})$/, '$1 ($2) $3-$4']
    ]

    return this.each(function () {
      var timeOut = null;
      var cleanValue = '';
      var input = $(this);

      input.data('cleanValue', '')

      if ( !input.is('input') ) {
        input.text(input.text().replace(exp[3][0], exp[3][1]))
        return
      }

      function _render (self) {
        var out = '';
        var value = self.value;

        out = +value[0] === 7 ? '+' + value : value

        out = out.replace(/(?!^\+)\D/g, '')
        var inc = out.indexOf('+') !== -1 ? true : false

        cleanValue = value.replace(/\D/g, '').substr(1)
        var num = value.replace(/\D/g, '')

        if (num.length >= (11 + inc)) {
          out = out.substr(0, (11 + inc)).replace(exp[3][0], exp[3][1])
          cleanValue = cleanValue.substr(0, 10)
        } else if (num.length > 6) {
          out = out.replace(exp[3][0], exp[3][1])
        } else if (num.length > 4) {
          out = out.replace(exp[2][0], exp[2][1])
        } else if (num.length > 1) {
          out = out.replace(exp[1][0], exp[1][1])
        } else {
          out = out.replace(exp[0][0], exp[0][1])
        }

        self.value = out

        $(self).data('cleanValue', inc && +value[1] !== 7 || !inc && +value[0] !== 8 ? '' : cleanValue)
      }

      if (this.value.length) {
        _render(this)
      }

      input.on('keyup', function (event) {
        var self = this;

        if (delKeys.indexOf(event.keyCode) !== -1) {
          var $value = self.value;

          if(timeOut) {
            clearTimeout(timeOut)
            timeOut = null
          }
          timeOut = setTimeout(function () {
            $(self).data('cleanValue', $value.replace(/\D/g, '').substr(1))
          }, 500)
        }

        if (keys.indexOf(event.keyCode) !== -1) return

        _render(this)
      })
      .on('change', function (event) {
        _render(this)
      })
    })

  }

})(jQuery)

$(function () {
  $('input[data-masks=mobile]').addClass('maskMobile').attr('placeholder', '+7 (000) 000-0000').maskMobile()

  // $('.mask-mobile').maskMobile()

  // $('input[data-masks=int_money]').maskMoney()

  // $('input[data-masks=num]').apart_num()
});
