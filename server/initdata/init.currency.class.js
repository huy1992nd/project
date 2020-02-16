'use strict';
var mySqlController = require('./../controller/mysql/mysql.controller');
var data_input = 
    {
        list_site:["localhost"],
        list_currency:
            {
                "USD": {
                    "symbol": "$",
                    "name": "US Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "USD",
                    "name_plural": "US dollars"
                },
                "CAD": {
                    "symbol": "CA$",
                    "name": "Canadian Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "CAD",
                    "name_plural": "Canadian dollars"
                },
                "EUR": {
                    "symbol": "€",
                    "name": "Euro",
                    "symbol_native": "€",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "EUR",
                    "name_plural": "euros"
                },
                "AED": {
                    "symbol": "AED",
                    "name": "United Arab Emirates Dirham",
                    "symbol_native": "د.إ.‏",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "AED",
                    "name_plural": "UAE dirhams"
                },
                "AFN": {
                    "symbol": "Af",
                    "name": "Afghan Afghani",
                    "symbol_native": "؋",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "AFN",
                    "name_plural": "Afghan Afghanis"
                },
                "ALL": {
                    "symbol": "ALL",
                    "name": "Albanian Lek",
                    "symbol_native": "Lek",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "ALL",
                    "name_plural": "Albanian lekë"
                },
                "AMD": {
                    "symbol": "AMD",
                    "name": "Armenian Dram",
                    "symbol_native": "դր.",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "AMD",
                    "name_plural": "Armenian drams"
                },
                "ARS": {
                    "symbol": "AR$",
                    "name": "Argentine Peso",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "ARS",
                    "name_plural": "Argentine pesos"
                },
                "AUD": {
                    "symbol": "AU$",
                    "name": "Australian Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "AUD",
                    "name_plural": "Australian dollars"
                },
                "AZN": {
                    "symbol": "man.",
                    "name": "Azerbaijani Manat",
                    "symbol_native": "ман.",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "AZN",
                    "name_plural": "Azerbaijani manats"
                },
                "BAM": {
                    "symbol": "KM",
                    "name": "Bosnia-Herzegovina Convertible Mark",
                    "symbol_native": "KM",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "BAM",
                    "name_plural": "Bosnia-Herzegovina convertible marks"
                },
                "BDT": {
                    "symbol": "Tk",
                    "name": "Bangladeshi Taka",
                    "symbol_native": "৳",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "BDT",
                    "name_plural": "Bangladeshi takas"
                },
                "BGN": {
                    "symbol": "BGN",
                    "name": "Bulgarian Lev",
                    "symbol_native": "лв.",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "BGN",
                    "name_plural": "Bulgarian leva"
                },
                "BHD": {
                    "symbol": "BD",
                    "name": "Bahraini Dinar",
                    "symbol_native": "د.ب.‏",
                    "decimal_digits": 3,
                    "rounding": 0,
                    "code": "BHD",
                    "name_plural": "Bahraini dinars"
                },
                "BIF": {
                    "symbol": "FBu",
                    "name": "Burundian Franc",
                    "symbol_native": "FBu",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "BIF",
                    "name_plural": "Burundian francs"
                },
                "BND": {
                    "symbol": "BN$",
                    "name": "Brunei Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "BND",
                    "name_plural": "Brunei dollars"
                },
                "BOB": {
                    "symbol": "Bs",
                    "name": "Bolivian Boliviano",
                    "symbol_native": "Bs",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "BOB",
                    "name_plural": "Bolivian bolivianos"
                },
                "BRL": {
                    "symbol": "R$",
                    "name": "Brazilian Real",
                    "symbol_native": "R$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "BRL",
                    "name_plural": "Brazilian reals"
                },
                "BWP": {
                    "symbol": "BWP",
                    "name": "Botswanan Pula",
                    "symbol_native": "P",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "BWP",
                    "name_plural": "Botswanan pulas"
                },
                "BYR": {
                    "symbol": "BYR",
                    "name": "Belarusian Ruble",
                    "symbol_native": "BYR",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "BYR",
                    "name_plural": "Belarusian rubles"
                },
                "BZD": {
                    "symbol": "BZ$",
                    "name": "Belize Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "BZD",
                    "name_plural": "Belize dollars"
                },
                "CDF": {
                    "symbol": "CDF",
                    "name": "Congolese Franc",
                    "symbol_native": "FrCD",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "CDF",
                    "name_plural": "Congolese francs"
                },
                "CHF": {
                    "symbol": "CHF",
                    "name": "Swiss Franc",
                    "symbol_native": "CHF",
                    "decimal_digits": 2,
                    "rounding": 0.05,
                    "code": "CHF",
                    "name_plural": "Swiss francs"
                },
                "CLP": {
                    "symbol": "CL$",
                    "name": "Chilean Peso",
                    "symbol_native": "$",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "CLP",
                    "name_plural": "Chilean pesos"
                },
                "CNY": {
                    "symbol": "CN¥",
                    "name": "Chinese Yuan",
                    "symbol_native": "CN¥",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "CNY",
                    "name_plural": "Chinese yuan"
                },
                "COP": {
                    "symbol": "CO$",
                    "name": "Colombian Peso",
                    "symbol_native": "$",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "COP",
                    "name_plural": "Colombian pesos"
                },
                "CRC": {
                    "symbol": "₡",
                    "name": "Costa Rican Colón",
                    "symbol_native": "₡",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "CRC",
                    "name_plural": "Costa Rican colóns"
                },
                "CVE": {
                    "symbol": "CV$",
                    "name": "Cape Verdean Escudo",
                    "symbol_native": "CV$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "CVE",
                    "name_plural": "Cape Verdean escudos"
                },
                "CZK": {
                    "symbol": "Kč",
                    "name": "Czech Republic Koruna",
                    "symbol_native": "Kč",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "CZK",
                    "name_plural": "Czech Republic korunas"
                },
                "DJF": {
                    "symbol": "Fdj",
                    "name": "Djiboutian Franc",
                    "symbol_native": "Fdj",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "DJF",
                    "name_plural": "Djiboutian francs"
                },
                "DKK": {
                    "symbol": "Dkr",
                    "name": "Danish Krone",
                    "symbol_native": "kr",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "DKK",
                    "name_plural": "Danish kroner"
                },
                "DOP": {
                    "symbol": "RD$",
                    "name": "Dominican Peso",
                    "symbol_native": "RD$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "DOP",
                    "name_plural": "Dominican pesos"
                },
                "DZD": {
                    "symbol": "DA",
                    "name": "Algerian Dinar",
                    "symbol_native": "د.ج.‏",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "DZD",
                    "name_plural": "Algerian dinars"
                },
                "EEK": {
                    "symbol": "Ekr",
                    "name": "Estonian Kroon",
                    "symbol_native": "kr",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "EEK",
                    "name_plural": "Estonian kroons"
                },
                "EGP": {
                    "symbol": "EGP",
                    "name": "Egyptian Pound",
                    "symbol_native": "ج.م.‏",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "EGP",
                    "name_plural": "Egyptian pounds"
                },
                "ERN": {
                    "symbol": "Nfk",
                    "name": "Eritrean Nakfa",
                    "symbol_native": "Nfk",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "ERN",
                    "name_plural": "Eritrean nakfas"
                },
                "ETB": {
                    "symbol": "Br",
                    "name": "Ethiopian Birr",
                    "symbol_native": "Br",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "ETB",
                    "name_plural": "Ethiopian birrs"
                },
                "GBP": {
                    "symbol": "£",
                    "name": "British Pound Sterling",
                    "symbol_native": "£",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "GBP",
                    "name_plural": "British pounds sterling"
                },
                "GEL": {
                    "symbol": "GEL",
                    "name": "Georgian Lari",
                    "symbol_native": "GEL",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "GEL",
                    "name_plural": "Georgian laris"
                },
                "GHS": {
                    "symbol": "GH₵",
                    "name": "Ghanaian Cedi",
                    "symbol_native": "GH₵",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "GHS",
                    "name_plural": "Ghanaian cedis"
                },
                "GNF": {
                    "symbol": "FG",
                    "name": "Guinean Franc",
                    "symbol_native": "FG",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "GNF",
                    "name_plural": "Guinean francs"
                },
                "GTQ": {
                    "symbol": "GTQ",
                    "name": "Guatemalan Quetzal",
                    "symbol_native": "Q",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "GTQ",
                    "name_plural": "Guatemalan quetzals"
                },
                "HKD": {
                    "symbol": "HK$",
                    "name": "Hong Kong Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "HKD",
                    "name_plural": "Hong Kong dollars"
                },
                "HNL": {
                    "symbol": "HNL",
                    "name": "Honduran Lempira",
                    "symbol_native": "L",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "HNL",
                    "name_plural": "Honduran lempiras"
                },
                "HRK": {
                    "symbol": "kn",
                    "name": "Croatian Kuna",
                    "symbol_native": "kn",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "HRK",
                    "name_plural": "Croatian kunas"
                },
                "HUF": {
                    "symbol": "Ft",
                    "name": "Hungarian Forint",
                    "symbol_native": "Ft",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "HUF",
                    "name_plural": "Hungarian forints"
                },
                "IDR": {
                    "symbol": "Rp",
                    "name": "Indonesian Rupiah",
                    "symbol_native": "Rp",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "IDR",
                    "name_plural": "Indonesian rupiahs"
                },
                "ILS": {
                    "symbol": "₪",
                    "name": "Israeli New Sheqel",
                    "symbol_native": "₪",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "ILS",
                    "name_plural": "Israeli new sheqels"
                },
                "INR": {
                    "symbol": "Rs",
                    "name": "Indian Rupee",
                    "symbol_native": "টকা",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "INR",
                    "name_plural": "Indian rupees"
                },
                "IQD": {
                    "symbol": "IQD",
                    "name": "Iraqi Dinar",
                    "symbol_native": "د.ع.‏",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "IQD",
                    "name_plural": "Iraqi dinars"
                },
                "IRR": {
                    "symbol": "IRR",
                    "name": "Iranian Rial",
                    "symbol_native": "﷼",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "IRR",
                    "name_plural": "Iranian rials"
                },
                "ISK": {
                    "symbol": "Ikr",
                    "name": "Icelandic Króna",
                    "symbol_native": "kr",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "ISK",
                    "name_plural": "Icelandic krónur"
                },
                "JMD": {
                    "symbol": "J$",
                    "name": "Jamaican Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "JMD",
                    "name_plural": "Jamaican dollars"
                },
                "JOD": {
                    "symbol": "JD",
                    "name": "Jordanian Dinar",
                    "symbol_native": "د.أ.‏",
                    "decimal_digits": 3,
                    "rounding": 0,
                    "code": "JOD",
                    "name_plural": "Jordanian dinars"
                },
                "JPY": {
                    "symbol": "¥",
                    "name": "Japanese Yen",
                    "symbol_native": "￥",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "JPY",
                    "name_plural": "Japanese yen"
                },
                "KES": {
                    "symbol": "Ksh",
                    "name": "Kenyan Shilling",
                    "symbol_native": "Ksh",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "KES",
                    "name_plural": "Kenyan shillings"
                },
                "KHR": {
                    "symbol": "KHR",
                    "name": "Cambodian Riel",
                    "symbol_native": "៛",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "KHR",
                    "name_plural": "Cambodian riels"
                },
                "KMF": {
                    "symbol": "CF",
                    "name": "Comorian Franc",
                    "symbol_native": "FC",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "KMF",
                    "name_plural": "Comorian francs"
                },
                "KRW": {
                    "symbol": "₩",
                    "name": "South Korean Won",
                    "symbol_native": "₩",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "KRW",
                    "name_plural": "South Korean won"
                },
                "KWD": {
                    "symbol": "KD",
                    "name": "Kuwaiti Dinar",
                    "symbol_native": "د.ك.‏",
                    "decimal_digits": 3,
                    "rounding": 0,
                    "code": "KWD",
                    "name_plural": "Kuwaiti dinars"
                },
                "KZT": {
                    "symbol": "KZT",
                    "name": "Kazakhstani Tenge",
                    "symbol_native": "тңг.",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "KZT",
                    "name_plural": "Kazakhstani tenges"
                },
                "LBP": {
                    "symbol": "LB£",
                    "name": "Lebanese Pound",
                    "symbol_native": "ل.ل.‏",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "LBP",
                    "name_plural": "Lebanese pounds"
                },
                "LKR": {
                    "symbol": "SLRs",
                    "name": "Sri Lankan Rupee",
                    "symbol_native": "SL Re",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "LKR",
                    "name_plural": "Sri Lankan rupees"
                },
                "LTL": {
                    "symbol": "Lt",
                    "name": "Lithuanian Litas",
                    "symbol_native": "Lt",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "LTL",
                    "name_plural": "Lithuanian litai"
                },
                "LVL": {
                    "symbol": "Ls",
                    "name": "Latvian Lats",
                    "symbol_native": "Ls",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "LVL",
                    "name_plural": "Latvian lati"
                },
                "LYD": {
                    "symbol": "LD",
                    "name": "Libyan Dinar",
                    "symbol_native": "د.ل.‏",
                    "decimal_digits": 3,
                    "rounding": 0,
                    "code": "LYD",
                    "name_plural": "Libyan dinars"
                },
                "MAD": {
                    "symbol": "MAD",
                    "name": "Moroccan Dirham",
                    "symbol_native": "د.م.‏",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "MAD",
                    "name_plural": "Moroccan dirhams"
                },
                "MDL": {
                    "symbol": "MDL",
                    "name": "Moldovan Leu",
                    "symbol_native": "MDL",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "MDL",
                    "name_plural": "Moldovan lei"
                },
                "MGA": {
                    "symbol": "MGA",
                    "name": "Malagasy Ariary",
                    "symbol_native": "MGA",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "MGA",
                    "name_plural": "Malagasy Ariaries"
                },
                "MKD": {
                    "symbol": "MKD",
                    "name": "Macedonian Denar",
                    "symbol_native": "MKD",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "MKD",
                    "name_plural": "Macedonian denari"
                },
                "MMK": {
                    "symbol": "MMK",
                    "name": "Myanma Kyat",
                    "symbol_native": "K",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "MMK",
                    "name_plural": "Myanma kyats"
                },
                "MOP": {
                    "symbol": "MOP$",
                    "name": "Macanese Pataca",
                    "symbol_native": "MOP$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "MOP",
                    "name_plural": "Macanese patacas"
                },
                "MUR": {
                    "symbol": "MURs",
                    "name": "Mauritian Rupee",
                    "symbol_native": "MURs",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "MUR",
                    "name_plural": "Mauritian rupees"
                },
                "MXN": {
                    "symbol": "MX$",
                    "name": "Mexican Peso",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "MXN",
                    "name_plural": "Mexican pesos"
                },
                "MYR": {
                    "symbol": "RM",
                    "name": "Malaysian Ringgit",
                    "symbol_native": "RM",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "MYR",
                    "name_plural": "Malaysian ringgits"
                },
                "MZN": {
                    "symbol": "MTn",
                    "name": "Mozambican Metical",
                    "symbol_native": "MTn",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "MZN",
                    "name_plural": "Mozambican meticals"
                },
                "NAD": {
                    "symbol": "N$",
                    "name": "Namibian Dollar",
                    "symbol_native": "N$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "NAD",
                    "name_plural": "Namibian dollars"
                },
                "NGN": {
                    "symbol": "₦",
                    "name": "Nigerian Naira",
                    "symbol_native": "₦",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "NGN",
                    "name_plural": "Nigerian nairas"
                },
                "NIO": {
                    "symbol": "C$",
                    "name": "Nicaraguan Córdoba",
                    "symbol_native": "C$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "NIO",
                    "name_plural": "Nicaraguan córdobas"
                },
                "NOK": {
                    "symbol": "Nkr",
                    "name": "Norwegian Krone",
                    "symbol_native": "kr",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "NOK",
                    "name_plural": "Norwegian kroner"
                },
                "NPR": {
                    "symbol": "NPRs",
                    "name": "Nepalese Rupee",
                    "symbol_native": "नेरू",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "NPR",
                    "name_plural": "Nepalese rupees"
                },
                "NZD": {
                    "symbol": "NZ$",
                    "name": "New Zealand Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "NZD",
                    "name_plural": "New Zealand dollars"
                },
                "OMR": {
                    "symbol": "OMR",
                    "name": "Omani Rial",
                    "symbol_native": "ر.ع.‏",
                    "decimal_digits": 3,
                    "rounding": 0,
                    "code": "OMR",
                    "name_plural": "Omani rials"
                },
                "PAB": {
                    "symbol": "B/.",
                    "name": "Panamanian Balboa",
                    "symbol_native": "B/.",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "PAB",
                    "name_plural": "Panamanian balboas"
                },
                "PEN": {
                    "symbol": "S/.",
                    "name": "Peruvian Nuevo Sol",
                    "symbol_native": "S/.",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "PEN",
                    "name_plural": "Peruvian nuevos soles"
                },
                "PHP": {
                    "symbol": "₱",
                    "name": "Philippine Peso",
                    "symbol_native": "₱",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "PHP",
                    "name_plural": "Philippine pesos"
                },
                "PKR": {
                    "symbol": "PKRs",
                    "name": "Pakistani Rupee",
                    "symbol_native": "₨",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "PKR",
                    "name_plural": "Pakistani rupees"
                },
                "PLN": {
                    "symbol": "zł",
                    "name": "Polish Zloty",
                    "symbol_native": "zł",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "PLN",
                    "name_plural": "Polish zlotys"
                },
                "PYG": {
                    "symbol": "₲",
                    "name": "Paraguayan Guarani",
                    "symbol_native": "₲",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "PYG",
                    "name_plural": "Paraguayan guaranis"
                },
                "QAR": {
                    "symbol": "QR",
                    "name": "Qatari Rial",
                    "symbol_native": "ر.ق.‏",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "QAR",
                    "name_plural": "Qatari rials"
                },
                "RON": {
                    "symbol": "RON",
                    "name": "Romanian Leu",
                    "symbol_native": "RON",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "RON",
                    "name_plural": "Romanian lei"
                },
                "RSD": {
                    "symbol": "din.",
                    "name": "Serbian Dinar",
                    "symbol_native": "дин.",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "RSD",
                    "name_plural": "Serbian dinars"
                },
                "RUB": {
                    "symbol": "RUB",
                    "name": "Russian Ruble",
                    "symbol_native": "руб.",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "RUB",
                    "name_plural": "Russian rubles"
                },
                "RWF": {
                    "symbol": "RWF",
                    "name": "Rwandan Franc",
                    "symbol_native": "FR",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "RWF",
                    "name_plural": "Rwandan francs"
                },
                "SAR": {
                    "symbol": "SR",
                    "name": "Saudi Riyal",
                    "symbol_native": "ر.س.‏",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "SAR",
                    "name_plural": "Saudi riyals"
                },
                "SDG": {
                    "symbol": "SDG",
                    "name": "Sudanese Pound",
                    "symbol_native": "SDG",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "SDG",
                    "name_plural": "Sudanese pounds"
                },
                "SEK": {
                    "symbol": "Skr",
                    "name": "Swedish Krona",
                    "symbol_native": "kr",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "SEK",
                    "name_plural": "Swedish kronor"
                },
                "SGD": {
                    "symbol": "S$",
                    "name": "Singapore Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "SGD",
                    "name_plural": "Singapore dollars"
                },
                "SOS": {
                    "symbol": "Ssh",
                    "name": "Somali Shilling",
                    "symbol_native": "Ssh",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "SOS",
                    "name_plural": "Somali shillings"
                },
                "SYP": {
                    "symbol": "SY£",
                    "name": "Syrian Pound",
                    "symbol_native": "ل.س.‏",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "SYP",
                    "name_plural": "Syrian pounds"
                },
                "THB": {
                    "symbol": "฿",
                    "name": "Thai Baht",
                    "symbol_native": "฿",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "THB",
                    "name_plural": "Thai baht"
                },
                "TND": {
                    "symbol": "DT",
                    "name": "Tunisian Dinar",
                    "symbol_native": "د.ت.‏",
                    "decimal_digits": 3,
                    "rounding": 0,
                    "code": "TND",
                    "name_plural": "Tunisian dinars"
                },
                "TOP": {
                    "symbol": "T$",
                    "name": "Tongan Paʻanga",
                    "symbol_native": "T$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "TOP",
                    "name_plural": "Tongan paʻanga"
                },
                "TRY": {
                    "symbol": "TL",
                    "name": "Turkish Lira",
                    "symbol_native": "TL",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "TRY",
                    "name_plural": "Turkish Lira"
                },
                "TTD": {
                    "symbol": "TT$",
                    "name": "Trinidad and Tobago Dollar",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "TTD",
                    "name_plural": "Trinidad and Tobago dollars"
                },
                "TWD": {
                    "symbol": "NT$",
                    "name": "New Taiwan Dollar",
                    "symbol_native": "NT$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "TWD",
                    "name_plural": "New Taiwan dollars"
                },
                "TZS": {
                    "symbol": "TSh",
                    "name": "Tanzanian Shilling",
                    "symbol_native": "TSh",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "TZS",
                    "name_plural": "Tanzanian shillings"
                },
                "UAH": {
                    "symbol": "₴",
                    "name": "Ukrainian Hryvnia",
                    "symbol_native": "₴",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "UAH",
                    "name_plural": "Ukrainian hryvnias"
                },
                "UGX": {
                    "symbol": "USh",
                    "name": "Ugandan Shilling",
                    "symbol_native": "USh",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "UGX",
                    "name_plural": "Ugandan shillings"
                },
                "UYU": {
                    "symbol": "$U",
                    "name": "Uruguayan Peso",
                    "symbol_native": "$",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "UYU",
                    "name_plural": "Uruguayan pesos"
                },
                "UZS": {
                    "symbol": "UZS",
                    "name": "Uzbekistan Som",
                    "symbol_native": "UZS",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "UZS",
                    "name_plural": "Uzbekistan som"
                },
                "VEF": {
                    "symbol": "Bs.F.",
                    "name": "Venezuelan Bolívar",
                    "symbol_native": "Bs.F.",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "VEF",
                    "name_plural": "Venezuelan bolívars"
                },
                "VND": {
                    "symbol": "₫",
                    "name": "Vietnamese Dong",
                    "symbol_native": "₫",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "VND",
                    "name_plural": "Vietnamese dong"
                },
                "XAF": {
                    "symbol": "FCFA",
                    "name": "CFA Franc BEAC",
                    "symbol_native": "FCFA",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "XAF",
                    "name_plural": "CFA francs BEAC"
                },
                "XOF": {
                    "symbol": "CFA",
                    "name": "CFA Franc BCEAO",
                    "symbol_native": "CFA",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "XOF",
                    "name_plural": "CFA francs BCEAO"
                },
                "YER": {
                    "symbol": "YR",
                    "name": "Yemeni Rial",
                    "symbol_native": "ر.ي.‏",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "YER",
                    "name_plural": "Yemeni rials"
                },
                "ZAR": {
                    "symbol": "R",
                    "name": "South African Rand",
                    "symbol_native": "R",
                    "decimal_digits": 2,
                    "rounding": 0,
                    "code": "ZAR",
                    "name_plural": "South African rand"
                },
                "ZMK": {
                    "symbol": "ZK",
                    "name": "Zambian Kwacha",
                    "symbol_native": "ZK",
                    "decimal_digits": 0,
                    "rounding": 0,
                    "code": "ZMK",
                    "name_plural": "Zambian kwachas"
                }
            }
    }


var list_country_by_currency = [
    {
        "country": "Afghanistan",
        "currency_code": "AFN"
    },
    {
        "country": "Albania",
        "currency_code": "ALL"
    },
    {
        "country": "Algeria",
        "currency_code": "DZD"
    },
    {
        "country": "American Samoa",
        "currency_code": "USD"
    },
    {
        "country": "Andorra",
        "currency_code": "EUR"
    },
    {
        "country": "Angola",
        "currency_code": "AOA"
    },
    {
        "country": "Anguilla",
        "currency_code": "XCD"
    },
    {
        "country": "Antarctica",
        "currency_code": "XCD"
    },
    {
        "country": "Antigua and Barbuda",
        "currency_code": "XCD"
    },
    {
        "country": "Argentina",
        "currency_code": "ARS"
    },
    {
        "country": "Armenia",
        "currency_code": "AMD"
    },
    {
        "country": "Aruba",
        "currency_code": "AWG"
    },
    {
        "country": "Australia",
        "currency_code": "AUD"
    },
    {
        "country": "Austria",
        "currency_code": "EUR"
    },
    {
        "country": "Azerbaijan",
        "currency_code": "AZN"
    },
    {
        "country": "Bahamas",
        "currency_code": "BSD"
    },
    {
        "country": "Bahrain",
        "currency_code": "BHD"
    },
    {
        "country": "Bangladesh",
        "currency_code": "BDT"
    },
    {
        "country": "Barbados",
        "currency_code": "BBD"
    },
    {
        "country": "Belarus",
        "currency_code": "BYR"
    },
    {
        "country": "Belgium",
        "currency_code": "EUR"
    },
    {
        "country": "Belize",
        "currency_code": "BZD"
    },
    {
        "country": "Benin",
        "currency_code": "XOF"
    },
    {
        "country": "Bermuda",
        "currency_code": "BMD"
    },
    {
        "country": "Bhutan",
        "currency_code": "BTN"
    },
    {
        "country": "Bolivia",
        "currency_code": "BOB"
    },
    {
        "country": "Bosnia and Herzegovina",
        "currency_code": "BAM"
    },
    {
        "country": "Botswana",
        "currency_code": "BWP"
    },
    {
        "country": "Bouvet Island",
        "currency_code": "NOK"
    },
    {
        "country": "Brazil",
        "currency_code": "BRL"
    },
    {
        "country": "British Indian Ocean Territory",
        "currency_code": "USD"
    },
    {
        "country": "Brunei",
        "currency_code": "BND"
    },
    {
        "country": "Bulgaria",
        "currency_code": "BGN"
    },
    {
        "country": "Burkina Faso",
        "currency_code": "XOF"
    },
    {
        "country": "Burundi",
        "currency_code": "BIF"
    },
    {
        "country": "Cambodia",
        "currency_code": "KHR"
    },
    {
        "country": "Cameroon",
        "currency_code": "XAF"
    },
    {
        "country": "Canada",
        "currency_code": "CAD"
    },
    {
        "country": "Cape Verde",
        "currency_code": "CVE"
    },
    {
        "country": "Cayman Islands",
        "currency_code": "KYD"
    },
    {
        "country": "Central African Republic",
        "currency_code": "XAF"
    },
    {
        "country": "Chad",
        "currency_code": "XAF"
    },
    {
        "country": "Chile",
        "currency_code": "CLP"
    },
    {
        "country": "China",
        "currency_code": "CNY"
    },
    {
        "country": "Christmas Island",
        "currency_code": "AUD"
    },
    {
        "country": "Cocos (Keeling) Islands",
        "currency_code": "AUD"
    },
    {
        "country": "Colombia",
        "currency_code": "COP"
    },
    {
        "country": "Comoros",
        "currency_code": "KMF"
    },
    {
        "country": "Congo",
        "currency_code": "XAF"
    },
    {
        "country": "Cook Islands",
        "currency_code": "NZD"
    },
    {
        "country": "Costa Rica",
        "currency_code": "CRC"
    },
    {
        "country": "Croatia",
        "currency_code": "HRK"
    },
    {
        "country": "Cuba",
        "currency_code": "CUP"
    },
    {
        "country": "Cyprus",
        "currency_code": "EUR"
    },
    {
        "country": "Czech Republic",
        "currency_code": "CZK"
    },
    {
        "country": "Denmark",
        "currency_code": "DKK"
    },
    {
        "country": "Djibouti",
        "currency_code": "DJF"
    },
    {
        "country": "Dominica",
        "currency_code": "XCD"
    },
    {
        "country": "Dominican Republic",
        "currency_code": "DOP"
    },
    {
        "country": "East Timor",
        "currency_code": "USD"
    },
    {
        "country": "Ecuador",
        "currency_code": "ECS"
    },
    {
        "country": "Egypt",
        "currency_code": "EGP"
    },
    {
        "country": "El Salvador",
        "currency_code": "SVC"
    },
    {
        "country": "England",
        "currency_code": "GBP"
    },
    {
        "country": "Equatorial Guinea",
        "currency_code": "XAF"
    },
    {
        "country": "Eritrea",
        "currency_code": "ERN"
    },
    {
        "country": "Estonia",
        "currency_code": "EUR"
    },
    {
        "country": "Ethiopia",
        "currency_code": "ETB"
    },
    {
        "country": "Falkland Islands",
        "currency_code": "FKP"
    },
    {
        "country": "Faroe Islands",
        "currency_code": "DKK"
    },
    {
        "country": "Fiji Islands",
        "currency_code": "FJD"
    },
    {
        "country": "Finland",
        "currency_code": "EUR"
    },
    {
        "country": "France",
        "currency_code": "EUR"
    },
    {
        "country": "French Guiana",
        "currency_code": "EUR"
    },
    {
        "country": "French Polynesia",
        "currency_code": "XPF"
    },
    {
        "country": "French Southern territories",
        "currency_code": "EUR"
    },
    {
        "country": "Gabon",
        "currency_code": "XAF"
    },
    {
        "country": "Gambia",
        "currency_code": "GMD"
    },
    {
        "country": "Georgia",
        "currency_code": "GEL"
    },
    {
        "country": "Germany",
        "currency_code": "EUR"
    },
    {
        "country": "Ghana",
        "currency_code": "GHS"
    },
    {
        "country": "Gibraltar",
        "currency_code": "GIP"
    },
    {
        "country": "Greece",
        "currency_code": "EUR"
    },
    {
        "country": "Greenland",
        "currency_code": "DKK"
    },
    {
        "country": "Grenada",
        "currency_code": "XCD"
    },
    {
        "country": "Guadeloupe",
        "currency_code": "EUR"
    },
    {
        "country": "Guam",
        "currency_code": "USD"
    },
    {
        "country": "Guatemala",
        "currency_code": "QTQ"
    },
    {
        "country": "Guinea",
        "currency_code": "GNF"
    },
    {
        "country": "Guinea-Bissau",
        "currency_code": "CFA"
    },
    {
        "country": "Guyana",
        "currency_code": "GYD"
    },
    {
        "country": "Haiti",
        "currency_code": "HTG"
    },
    {
        "country": "Heard Island and McDonald Islands",
        "currency_code": "AUD"
    },
    {
        "country": "Holy See (Vatican City State)",
        "currency_code": "EUR"
    },
    {
        "country": "Honduras",
        "currency_code": "HNL"
    },
    {
        "country": "Hong Kong",
        "currency_code": "HKD"
    },
    {
        "country": "Hungary",
        "currency_code": "HUF"
    },
    {
        "country": "Iceland",
        "currency_code": "ISK"
    },
    {
        "country": "India",
        "currency_code": "INR"
    },
    {
        "country": "Indonesia",
        "currency_code": "IDR"
    },
    {
        "country": "Iran",
        "currency_code": "IRR"
    },
    {
        "country": "Iraq",
        "currency_code": "IQD"
    },
    {
        "country": "Ireland",
        "currency_code": "EUR"
    },
    {
        "country": "Israel",
        "currency_code": "ILS"
    },
    {
        "country": "Italy",
        "currency_code": "EUR"
    },
    {
        "country": "Ivory Coast",
        "currency_code": "XOF"
    },
    {
        "country": "Jamaica",
        "currency_code": "JMD"
    },
    {
        "country": "Japan",
        "currency_code": "JPY"
    },
    {
        "country": "Jordan",
        "currency_code": "JOD"
    },
    {
        "country": "Kazakhstan",
        "currency_code": "KZT"
    },
    {
        "country": "Kenya",
        "currency_code": "KES"
    },
    {
        "country": "Kiribati",
        "currency_code": "AUD"
    },
    {
        "country": "Kuwait",
        "currency_code": "KWD"
    },
    {
        "country": "Kyrgyzstan",
        "currency_code": "KGS"
    },
    {
        "country": "Laos",
        "currency_code": "LAK"
    },
    {
        "country": "Latvia",
        "currency_code": "LVL"
    },
    {
        "country": "Lebanon",
        "currency_code": "LBP"
    },
    {
        "country": "Lesotho",
        "currency_code": "LSL"
    },
    {
        "country": "Liberia",
        "currency_code": "LRD"
    },
    {
        "country": "Libyan Arab Jamahiriya",
        "currency_code": "LYD"
    },
    {
        "country": "Liechtenstein",
        "currency_code": "CHF"
    },
    {
        "country": "Lithuania",
        "currency_code": "LTL"
    },
    {
        "country": "Luxembourg",
        "currency_code": "EUR"
    },
    {
        "country": "Macao",
        "currency_code": "MOP"
    },
    {
        "country": "North Macedonia",
        "currency_code": "MKD"
    },
    {
        "country": "Madagascar",
        "currency_code": "MGF"
    },
    {
        "country": "Malawi",
        "currency_code": "MWK"
    },
    {
        "country": "Malaysia",
        "currency_code": "MYR"
    },
    {
        "country": "Maldives",
        "currency_code": "MVR"
    },
    {
        "country": "Mali",
        "currency_code": "XOF"
    },
    {
        "country": "Malta",
        "currency_code": "EUR"
    },
    {
        "country": "Martinique",
        "currency_code": "EUR"
    },
    {
        "country": "Mauritania",
        "currency_code": "MRO"
    },
    {
        "country": "Mauritius",
        "currency_code": "MUR"
    },
    {
        "country": "Mayotte",
        "currency_code": "EUR"
    },
    {
        "country": "Mexico",
        "currency_code": "MXN"
    },
    {
        "country": "Moldova",
        "currency_code": "MDL"
    },
    {
        "country": "Monaco",
        "currency_code": "EUR"
    },
    {
        "country": "Mongolia",
        "currency_code": "MNT"
    },
    {
        "country": "Montserrat",
        "currency_code": "XCD"
    },
    {
        "country": "Morocco",
        "currency_code": "MAD"
    },
    {
        "country": "Mozambique",
        "currency_code": "MZN"
    },
    {
        "country": "Myanmar",
        "currency_code": "MMR"
    },
    {
        "country": "Namibia",
        "currency_code": "NAD"
    },
    {
        "country": "Nauru",
        "currency_code": "AUD"
    },
    {
        "country": "Nepal",
        "currency_code": "NPR"
    },
    {
        "country": "Netherlands",
        "currency_code": "EUR"
    },
    {
        "country": "Netherlands Antilles",
        "currency_code": "ANG"
    },
    {
        "country": "New Caledonia",
        "currency_code": "XPF"
    },
    {
        "country": "New Zealand",
        "currency_code": "NZD"
    },
    {
        "country": "Nicaragua",
        "currency_code": "NIO"
    },
    {
        "country": "Niger",
        "currency_code": "XOF"
    },
    {
        "country": "Nigeria",
        "currency_code": "NGN"
    },
    {
        "country": "Niue",
        "currency_code": "NZD"
    },
    {
        "country": "Norfolk Island",
        "currency_code": "AUD"
    },
    {
        "country": "North Korea",
        "currency_code": "KPW"
    },
    {
        "country": "Northern Ireland",
        "currency_code": "GBP"
    },
    {
        "country": "Northern Mariana Islands",
        "currency_code": "USD"
    },
    {
        "country": "Norway",
        "currency_code": "NOK"
    },
    {
        "country": "Oman",
        "currency_code": "OMR"
    },
    {
        "country": "Pakistan",
        "currency_code": "PKR"
    },
    {
        "country": "Palau",
        "currency_code": "USD"
    },
    {
        "country": "Palestine",
        "currency_code": null
    },
    {
        "country": "Panama",
        "currency_code": "PAB"
    },
    {
        "country": "Papua New Guinea",
        "currency_code": "PGK"
    },
    {
        "country": "Paraguay",
        "currency_code": "PYG"
    },
    {
        "country": "Peru",
        "currency_code": "PEN"
    },
    {
        "country": "Philippines",
        "currency_code": "PHP"
    },
    {
        "country": "Pitcairn",
        "currency_code": "NZD"
    },
    {
        "country": "Poland",
        "currency_code": "PLN"
    },
    {
        "country": "Portugal",
        "currency_code": "EUR"
    },
    {
        "country": "Puerto Rico",
        "currency_code": "USD"
    },
    {
        "country": "Qatar",
        "currency_code": "QAR"
    },
    {
        "country": "Reunion",
        "currency_code": "EUR"
    },
    {
        "country": "Romania",
        "currency_code": "RON"
    },
    {
        "country": "Russian Federation",
        "currency_code": "RUB"
    },
    {
        "country": "Rwanda",
        "currency_code": "RWF"
    },
    {
        "country": "Saint Helena",
        "currency_code": "SHP"
    },
    {
        "country": "Saint Kitts and Nevis",
        "currency_code": "XCD"
    },
    {
        "country": "Saint Lucia",
        "currency_code": "XCD"
    },
    {
        "country": "Saint Pierre and Miquelon",
        "currency_code": "EUR"
    },
    {
        "country": "Saint Vincent and the Grenadines",
        "currency_code": "XCD"
    },
    {
        "country": "Samoa",
        "currency_code": "WST"
    },
    {
        "country": "San Marino",
        "currency_code": "EUR"
    },
    {
        "country": "Sao Tome and Principe",
        "currency_code": "STD"
    },
    {
        "country": "Saudi Arabia",
        "currency_code": "SAR"
    },
    {
        "country": "Scotland",
        "currency_code": "GBP"
    },
    {
        "country": "Senegal",
        "currency_code": "XOF"
    },
    {
        "country": "Seychelles",
        "currency_code": "SCR"
    },
    {
        "country": "Sierra Leone",
        "currency_code": "SLL"
    },
    {
        "country": "Singapore",
        "currency_code": "SGD"
    },
    {
        "country": "Slovakia",
        "currency_code": "EUR"
    },
    {
        "country": "Slovenia",
        "currency_code": "EUR"
    },
    {
        "country": "Solomon Islands",
        "currency_code": "SBD"
    },
    {
        "country": "Somalia",
        "currency_code": "SOS"
    },
    {
        "country": "South Africa",
        "currency_code": "ZAR"
    },
    {
        "country": "South Georgia and the South Sandwich Islands",
        "currency_code": "GBP"
    },
    {
        "country": "South Korea",
        "currency_code": "KRW"
    },
    {
        "country": "South Sudan",
        "currency_code": "SSP"
    },
    {
        "country": "Spain",
        "currency_code": "EUR"
    },
    {
        "country": "SriLanka",
        "currency_code": "LKR"
    },
    {
        "country": "Sudan",
        "currency_code": "SDG"
    },
    {
        "country": "Suriname",
        "currency_code": "SRD"
    },
    {
        "country": "Svalbard and Jan Mayen",
        "currency_code": "NOK"
    },
    {
        "country": "Swaziland",
        "currency_code": "SZL"
    },
    {
        "country": "Sweden",
        "currency_code": "SEK"
    },
    {
        "country": "Switzerland",
        "currency_code": "CHF"
    },
    {
        "country": "Syria",
        "currency_code": "SYP"
    },
    {
        "country": "Tajikistan",
        "currency_code": "TJS"
    },
    {
        "country": "Tanzania",
        "currency_code": "TZS"
    },
    {
        "country": "Thailand",
        "currency_code": "THB"
    },
    {
        "country": "The Democratic Republic of Congo",
        "currency_code": "CDF"
    },
    {
        "country": "Togo",
        "currency_code": "XOF"
    },
    {
        "country": "Tokelau",
        "currency_code": "NZD"
    },
    {
        "country": "Tonga",
        "currency_code": "TOP"
    },
    {
        "country": "Trinidad and Tobago",
        "currency_code": "TTD"
    },
    {
        "country": "Tunisia",
        "currency_code": "TND"
    },
    {
        "country": "Turkey",
        "currency_code": "TRY"
    },
    {
        "country": "Turkmenistan",
        "currency_code": "TMT"
    },
    {
        "country": "Turks and Caicos Islands",
        "currency_code": "USD"
    },
    {
        "country": "Tuvalu",
        "currency_code": "AUD"
    },
    {
        "country": "Uganda",
        "currency_code": "UGX"
    },
    {
        "country": "Ukraine",
        "currency_code": "UAH"
    },
    {
        "country": "United Arab Emirates",
        "currency_code": "AED"
    },
    {
        "country": "United Kingdom",
        "currency_code": "GBP"
    },
    {
        "country": "United States",
        "currency_code": "USD"
    },
    {
        "country": "United States Minor Outlying Islands",
        "currency_code": "USD"
    },
    {
        "country": "Uruguay",
        "currency_code": "UYU"
    },
    {
        "country": "Uzbekistan",
        "currency_code": "UZS"
    },
    {
        "country": "Vanuatu",
        "currency_code": "VUV"
    },
    {
        "country": "Venezuela",
        "currency_code": "VEF"
    },
    {
        "country": "Vietnam",
        "currency_code": "VND"
    },
    {
        "country": "Virgin Islands, British",
        "currency_code": "USD"
    },
    {
        "country": "Virgin Islands, U.S.",
        "currency_code": "USD"
    },
    {
        "country": "Wales",
        "currency_code": "GBP"
    },
    {
        "country": "Wallis and Futuna",
        "currency_code": "XPF"
    },
    {
        "country": "Western Sahara",
        "currency_code": "MAD"
    },
    {
        "country": "Yemen",
        "currency_code": "YER"
    },
    {
        "country": "Yugoslavia",
        "currency_code": null
    },
    {
        "country": "Zambia",
        "currency_code": "ZMW"
    },
    {
        "country": "Zimbabwe",
        "currency_code": "ZWD"
    }
]

class InitCurrencyController {
    constructor() {
    }

    async addData() {
        // Remove all data 
        let clear_data = await this.removeAllData();
        // Add new data 
        if (clear_data) {
            let add = await this.insertData();
            if (add) {
                console.log("Add data country and city ok !");
            }
        }
    }

    async removeAllData() {
        return new Promise((resolve, reject) => {
            let sql = `
            DELETE FROM fx_currencies WHERE 1 ;
            `;
            mySqlController.ExeQuery({
                query: sql,
                values: []
            }, function (err, rows, fields) {
                if (!err) {
                    resolve(true)
                } else {
                    console.log('clear table currency ok');
                    resolve(false)
                }
            });
        });
    }

    async insertData() {
        return new Promise((resolve, reject) => {
            let values = [];
            let sql = 'INSERT INTO `fx_currencies` ( `code`, `name`, `site`, `country`) VALUES ';
            var list_join = [];
            data_input.list_site.forEach(site => {
                Object.keys(data_input.list_currency).forEach(key=>{
                    let c = data_input.list_currency[key];
                    let country_object = list_country_by_currency.find(item=> item.currency_code == c.code);
                    let country = country_object? country_object.country: "---"; 
                    list_join.push("( ?, ?, ?, ?)");
                    values.push(c.code);
                    values.push(c.name);
                    values.push(site);
                    values.push(country);
                });
                sql = sql + list_join.join(",");
            });
           
            mySqlController.ExeQuery({
                query: sql,
                values: values
            }, async (err, rows, fields) => {
                if (!err) {
                    resolve(true);
                } else {
                    console.log("Have error when add country table", err);
                    resolve(false);
                }
            });
        })
    }

}

module.exports = InitCurrencyController;