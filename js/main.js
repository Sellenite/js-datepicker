(() => {
    var datepicker = window.datepicker;

    var monthData;

    var wrapper;

    var input;

    var isOpen;

    // 渲染函数
    datepicker.buildUi = function (year, month) {
        // 需要加载完datepicker.js才加载本js
        monthData = datepicker.getMonthData(year, month);

        // 拼接<td></td>中的内容
        var html =
            '<div class="ui-datepicker-header">' +
            '<a href="javascript:;" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt</a>' +
            '<a href="javascript:;" class="ui-datepicker-btn ui-datepicker-next-btn">&gt</a>' +
            '<span class="ui-datepicker-curr-month">' + monthData.year + '-' + monthData.month + '</span>' +
            '</div>' +
            '<div class="ui-datepicker-body">' +
            '<table>' +
            '<thead>' +
            '<tr>' +
            '<th>一</th>' +
            '<th>二</th>' +
            '<th>三</th>' +
            '<th>四</th>' +
            '<th>五</th>' +
            '<th>六</th>' +
            '<th>日</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';

        for (var i = 0; i < monthData.days.length; i++) {
            // 用于高亮当天的日期
            var todayEqual = new Date().getDate();
            var monthEqual = new Date().getMonth() + 1;
            var yearEqual = new Date().getFullYear();

            var date = monthData.days[i];
            // 一周的第一天
            if (i % 7 === 0)
                html += '<tr>';

            // 渲染<tr></tr>里的内容，利用data-date保存真实日期
            if (date.date <= 0) {
                // 上个月的日期
                html += '<td style="color: #ccc" data-date="' + date.date + '">' + date.showDate + '</td>';
            } else if (date.date > monthData.lastDate) {
                // 下个月的日期
                html += '<td style="color: #ccc" data-date="' + date.date + '">' + date.showDate + '</td>';
            } else if (date.date === todayEqual && monthData.month === monthEqual && monthData.year === yearEqual) {
                // 等于今天的日期
                html += '<td style="background: rgba(0, 0, 0, 0.1)" data-date="' + date.date + '">' + date.showDate + '</td>';
            } else {
                // 普通的日期
                html += '<td data-date="' + date.date + '">' + date.showDate + '</td>';
            }

            // 一周的最后一天
            if (i % 7 === 6)
                html += '</tr>';
        }

        html += '</tbody>' +
            '</table>' +
            '</div>';

        return html;

    };

    // 开始渲染
    datepicker.render = function (direction, year, month) {

        // 如果没有传值，证明需要重新获取时间的值
        if (!year && !month) {
            year = monthData.year;
            month = monthData.month;
        }

        // 判断是否上下页渲染
        if (direction === 'prev')
            month--
        if (direction === 'next')
            month++
        // 超页调整
        if (month === 0) {
            month = 12;
            year--;
        }

        var html = datepicker.buildUi(year, month);

        // 如果这个元素已经被添加，则直接改变innerHTML
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'ui-datepicker-wrapper';
            // 将wrapper注入到body内
            document.body.appendChild(wrapper);
        }

        // 将渲染结果插入进去，结合了上一页和下一页功能
        wrapper.innerHTML = html;

    }

    // datepicker初始化，传入函数
    datepicker.init = function (inputClass, year, month) {
        // 如果没有传入数据，那么就用现在的时间
        if (!year || !month) {
            var today = new Date();
            year = today.getFullYear();
            month = today.getMonth() + 1;
        }

        // 由于是初始渲染而不是上下页渲染，传入一个无用值
        datepicker.render('no-direction', year, month);

        // inputClass = '.example';
        input = document.querySelector(inputClass);
        isOpen = false;

        input.addEventListener('click', function () {
            if (isOpen) {
                wrapper.classList.remove('ui-datepicker-wrapper-show');
                isOpen = false;
            } else {
                // 定位到目标元素下方
                var left = input.offsetLeft;
                var top = input.offsetTop;
                var height = input.offsetHeight;
                wrapper.style.top = top + height + 2 + 'px';
                wrapper.style.left = left + 'px';

                wrapper.classList.add('ui-datepicker-wrapper-show');
                isOpen = true;
            }
        }, false);

        // 使用时间冒泡触发点击事件
        wrapper.addEventListener('click', function (e) {
            var $target = e.target;

            if ($target.classList.contains('ui-datepicker-prev-btn')) {
                // 上个月
                datepicker.render('prev');
            } else if ($target.classList.contains('ui-datepicker-next-btn')) {
                // 下个月
                datepicker.render('next');
            } else if ($target.tagName.toLowerCase() === 'td') {
                // 点击日期，利用最后一个参数可以通过自我判断负数或超过当月日期数，可以自己进退
                var date = new Date(monthData.year, monthData.month - 1, $target.dataset.date);
                input.value = format(date);

                wrapper.classList.remove('ui-datepicker-wrapper-show');
                isOpen = false;
            }

        }, false);

        // toolTip悬浮提示今天星期几，日期
        wrapper.addEventListener('mouseover', function (e) {
            var $target = e.target;

            if ($target.tagName.toLowerCase() === 'td') {
                var date = new Date(monthData.year, monthData.month - 1, $target.dataset.date);
                var datefix = format(date);

                var day = new Date(monthData.year, monthData.month - 1, $target.dataset.date).getDay();
                var dayfix;

                switch (day) {
                    case 1:
                        dayfix = '星期一';
                        break;
                    case 2:
                        dayfix = '星期二';
                        break;
                    case 3:
                        dayfix = '星期三';
                        break;
                    case 4:
                        dayfix = '星期四';
                        break;
                    case 5:
                        dayfix = '星期五';
                        break;
                    case 6:
                        dayfix = '星期六';
                        break;
                    case 0:
                        dayfix = '星期日';
                        break;
                }

                // 创建悬浮元素
                var toolTipBox;
                toolTipBox = document.createElement("div");
                toolTipBox.className = "tooltip-box";

                // 添加独有id，用于删去
                toolTipBox.id = datefix;

                // 渲染悬浮层内容
                html = '<p>' + datefix + '</p>' + '<p>' + dayfix + '</p>';
                toolTipBox.innerHTML = html;

                // 渲染
                $target.appendChild(toolTipBox);

            }

        }, false);

        // 鼠标离开时移除悬浮层
        wrapper.addEventListener('mouseout', function (e) {
            var $target = e.target;

            var date = new Date(monthData.year, monthData.month - 1, $target.dataset.date);
            var datefix = format(date);

            var child = document.getElementById(datefix);

            if ($target.tagName.toLowerCase() === 'td') {
                $target.removeChild(child);
            }

        }, false)

    };

    // 对传出来的时间格式进行格式化
    function format(date) {
        ret = '';

        // 小于9的时候加0
        var padding = function (num) {
            if (num <= 9) {
                return '0' + num;
            }
            return num;
        }

        ret += date.getFullYear() + '-';
        ret += padding(date.getMonth() + 1) + '-';
        ret += padding(date.getDate());

        return ret;

    }

    // 点击外部收起日历
    document.addEventListener('click', (e) => {
        var target = e.target;
        if (!input.contains(target) && !wrapper.contains(target) && target.tagName.toLowerCase() !== 'a') {
            wrapper.classList.remove('ui-datepicker-wrapper-show');
            isOpen = false;
        }
    }, false);

})();