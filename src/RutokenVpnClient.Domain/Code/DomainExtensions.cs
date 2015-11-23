using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RutokenVpnClient.Domain.Code
{
    public static class DomainExtensions
    {
        public static string ToViewString(this DateTime date)
        {
            var monthNames = new[] { "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря" };
            return string.Format("{0} {1} {2}", date.Day, monthNames[date.Month - 1], date.Year);
        }
    }
}
