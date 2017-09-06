(() => {
    var datepicker = {};

    datepicker.getMonthData = function (year, month) {
        // 用于返回数据
        var ret = [];

        // 获得这个月的第一天
        var firstDay = new Date(year, month - 1, 1);
        // 获得这个月的第一天是星期几，用于判断前面的数
        var firstDayWeekDay = firstDay.getDay();
        // 如果获得这个是星期天，将getDay的0重置为7
        if (firstDayWeekDay === 0)
            firstDayWeekDay = 7;

        // 用于日历头部的显示
        HeadYear = firstDay.getFullYear();
        HeadMonth = firstDay.getMonth() + 1;

        // 获得这个月的最后一天和日期
        var lastDay = new Date(year, month, 0);
        var lastDate = lastDay.getDate();

        // 获得上个月的最后一天
        var lastDayOfLastMonth = new Date(year, month - 1, 0);
        var lastDateOfLastMonth = lastDayOfLastMonth.getDate();

        // 用于判断第一行显示多少个上一个月的日期。
        // 如果这个月的第一天是星期一，那么上一个月就没有日期显示
        // 如果这个月的第一天是星期二，那么上一个月就显示一个日期在星期一的位置
        // 因此，上一个月需要显示日期的数量是这个月的第一天的星期几 -1.
        var preMonthDayCount = firstDayWeekDay - 1;

        for (var i = 0; i < 7 * 6; i++) {
            // 利用i获取每一天的真实日期
            // 假设上个月有2天在这个日历内，那么这个月的2号就是星期四
            // 当i等于3的时候，就是星期四
            // 3 - 2 = 1，再加1才是真实日期
            // 所以利用i拿到真实日期公式：i - 上个月日期显示的数量 + 1.
            var date = i - preMonthDayCount + 1;
            // showDate用于修正真实日期，用于显示
            var showDate = date;
            // showMonth用于统计该日期真实月份
            var thisMonth = month;

            // 统计哪些不是本月的日期，设置实际月份和现实日期（最好将日期写下来研究）
            if (date <= 0) {
                // 当这个data数值等于零或小于零时，就说明遍历的这个日期是上一个月的
                thisMonth = month - 1;
                showDate = lastDateOfLastMonth + date;
            } else if (date > lastDate) {
                //下个月的，比如这个月有30日，多出2日，date显示是31，32，则是下月的1、2号
                thisMonth = month + 1;
                showDate = showDate - lastDate;
            }

            //如果-1的时候变成0，说明上月份是上年12月
            if (thisMonth === 0)
                thisMonth = 12;
            //如果+1的时候变成13，说下月份是下年1月
            if (thisMonth === 13)
                thisMonth = 1;

            ret.push(
                {
                    month: thisMonth,  // 每个日期的实际月份
                    date: date, // 真实日期，有负数情况，date为1时作为本月的1号
                    showDate: showDate // 显示日期
                }
            );
        }

        console.log(ret);

        return {
            year: HeadYear,
            month: HeadMonth,
            lastDate,  // 传入最后一天的日期，用来判断渲染颜色
            days: ret
        };

    };

    window.datepicker = datepicker;
})();