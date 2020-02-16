'use strict';
var mySqlController = require('./../controller/mysql/mysql.controller');
var countries = {
    data: [
        { "name": "Afghanistan", "code": "AF" },
        { "name": "Åland Islands", "code": "AX" },
        { "name": "Albania", "code": "AL" },
        { "name": "Algeria", "code": "DZ" },
        { "name": "American Samoa", "code": "AS" },
        { "name": "AndorrA", "code": "AD" },
        { "name": "Angola", "code": "AO" },
        { "name": "Anguilla", "code": "AI" },
        { "name": "Antarctica", "code": "AQ" },
        { "name": "Antigua and Barbuda", "code": "AG" },
        { "name": "Argentina", "code": "AR" },
        { "name": "Armenia", "code": "AM" },
        { "name": "Aruba", "code": "AW" },
        { "name": "Australia", "code": "AU" },
        { "name": "Austria", "code": "AT" },
        { "name": "Azerbaijan", "code": "AZ" },
        { "name": "Bahamas", "code": "BS" },
        { "name": "Bahrain", "code": "BH" },
        { "name": "Bangladesh", "code": "BD" },
        { "name": "Barbados", "code": "BB" },
        { "name": "Belarus", "code": "BY" },
        { "name": "Belgium", "code": "BE" },
        { "name": "Belize", "code": "BZ" },
        { "name": "Benin", "code": "BJ" },
        { "name": "Bermuda", "code": "BM" },
        { "name": "Bhutan", "code": "BT" },
        { "name": "Bolivia", "code": "BO" },
        { "name": "Bosnia and Herzegovina", "code": "BA" },
        { "name": "Botswana", "code": "BW" },
        { "name": "Bouvet Island", "code": "BV" },
        { "name": "Brazil", "code": "BR" },
        { "name": "British Indian Ocean Territory", "code": "IO" },
        { "name": "Brunei Darussalam", "code": "BN" },
        { "name": "Bulgaria", "code": "BG" },
        { "name": "Burkina Faso", "code": "BF" },
        { "name": "Burundi", "code": "BI" },
        { "name": "Cambodia", "code": "KH" },
        { "name": "Cameroon", "code": "CM" },
        { "name": "Canada", "code": "CA" },
        { "name": "Cape Verde", "code": "CV" },
        { "name": "Cayman Islands", "code": "KY" },
        { "name": "Central African Republic", "code": "CF" },
        { "name": "Chad", "code": "TD" },
        { "name": "Chile", "code": "CL" },
        { "name": "China", "code": "CN" },
        { "name": "Christmas Island", "code": "CX" },
        { "name": "Cocos (Keeling) Islands", "code": "CC" },
        { "name": "Colombia", "code": "CO" },
        { "name": "Comoros", "code": "KM" },
        { "name": "Congo", "code": "CG" },
        { "name": "Congo, The Democratic Republic of the", "code": "CD" },
        { "name": "Cook Islands", "code": "CK" },
        { "name": "Costa Rica", "code": "CR" },
        { "name": "Cote D'Ivoire", "code": "CI" },
        { "name": "Croatia", "code": "HR" },
        { "name": "Cuba", "code": "CU" },
        { "name": "Cyprus", "code": "CY" },
        { "name": "Czech Republic", "code": "CZ" },
        { "name": "Denmark", "code": "DK" },
        { "name": "Djibouti", "code": "DJ" },
        { "name": "Dominica", "code": "DM" },
        { "name": "Dominican Republic", "code": "DO" },
        { "name": "Ecuador", "code": "EC" },
        { "name": "Egypt", "code": "EG" },
        { "name": "El Salvador", "code": "SV" },
        { "name": "Equatorial Guinea", "code": "GQ" },
        { "name": "Eritrea", "code": "ER" },
        { "name": "Estonia", "code": "EE" },
        { "name": "Ethiopia", "code": "ET" },
        { "name": "Falkland Islands (Malvinas)", "code": "FK" },
        { "name": "Faroe Islands", "code": "FO" },
        { "name": "Fiji", "code": "FJ" },
        { "name": "Finland", "code": "FI" },
        { "name": "France", "code": "FR" },
        { "name": "French Guiana", "code": "GF" },
        { "name": "French Polynesia", "code": "PF" },
        { "name": "French Southern Territories", "code": "TF" },
        { "name": "Gabon", "code": "GA" },
        { "name": "Gambia", "code": "GM" },
        { "name": "Georgia", "code": "GE" },
        { "name": "Germany", "code": "DE" },
        { "name": "Ghana", "code": "GH" },
        { "name": "Gibraltar", "code": "GI" },
        { "name": "Greece", "code": "GR" },
        { "name": "Greenland", "code": "GL" },
        { "name": "Grenada", "code": "GD" },
        { "name": "Guadeloupe", "code": "GP" },
        { "name": "Guam", "code": "GU" },
        { "name": "Guatemala", "code": "GT" },
        { "name": "Guernsey", "code": "GG" },
        { "name": "Guinea", "code": "GN" },
        { "name": "Guinea-Bissau", "code": "GW" },
        { "name": "Guyana", "code": "GY" },
        { "name": "Haiti", "code": "HT" },
        { "name": "Heard Island and Mcdonald Islands", "code": "HM" },
        { "name": "Holy See (Vatican City State)", "code": "VA" },
        { "name": "Honduras", "code": "HN" },
        { "name": "Hong Kong", "code": "HK" },
        { "name": "Hungary", "code": "HU" },
        { "name": "Iceland", "code": "IS" },
        { "name": "India", "code": "IN" },
        { "name": "Indonesia", "code": "ID" },
        { "name": "Iran, Islamic Republic Of", "code": "IR" },
        { "name": "Iraq", "code": "IQ" },
        { "name": "Ireland", "code": "IE" },
        { "name": "Isle of Man", "code": "IM" },
        { "name": "Israel", "code": "IL" },
        { "name": "Italy", "code": "IT" },
        { "name": "Jamaica", "code": "JM" },
        { "name": "Japan", "code": "JP" },
        { "name": "Jersey", "code": "JE" },
        { "name": "Jordan", "code": "JO" },
        { "name": "Kazakhstan", "code": "KZ" },
        { "name": "Kenya", "code": "KE" },
        { "name": "Kiribati", "code": "KI" },
        { "name": "Korea, Democratic People'S Republic of", "code": "KP" },
        { "name": "Korea, Republic of", "code": "KR" },
        { "name": "Kuwait", "code": "KW" },
        { "name": "Kyrgyzstan", "code": "KG" },
        { "name": "Lao People'S Democratic Republic", "code": "LA" },
        { "name": "Latvia", "code": "LV" },
        { "name": "Lebanon", "code": "LB" },
        { "name": "Lesotho", "code": "LS" },
        { "name": "Liberia", "code": "LR" },
        { "name": "Libyan Arab Jamahiriya", "code": "LY" },
        { "name": "Liechtenstein", "code": "LI" },
        { "name": "Lithuania", "code": "LT" },
        { "name": "Luxembourg", "code": "LU" },
        { "name": "Macao", "code": "MO" },
        { "name": "Macedonia, The Former Yugoslav Republic of", "code": "MK" },
        { "name": "Madagascar", "code": "MG" },
        { "name": "Malawi", "code": "MW" },
        { "name": "Malaysia", "code": "MY" },
        { "name": "Maldives", "code": "MV" },
        { "name": "Mali", "code": "ML" },
        { "name": "Malta", "code": "MT" },
        { "name": "Marshall Islands", "code": "MH" },
        { "name": "Martinique", "code": "MQ" },
        { "name": "Mauritania", "code": "MR" },
        { "name": "Mauritius", "code": "MU" },
        { "name": "Mayotte", "code": "YT" },
        { "name": "Mexico", "code": "MX" },
        { "name": "Micronesia, Federated States of", "code": "FM" },
        { "name": "Moldova, Republic of", "code": "MD" },
        { "name": "Monaco", "code": "MC" },
        { "name": "Mongolia", "code": "MN" },
        { "name": "Montserrat", "code": "MS" },
        { "name": "Morocco", "code": "MA" },
        { "name": "Mozambique", "code": "MZ" },
        { "name": "Myanmar", "code": "MM" },
        { "name": "Namibia", "code": "NA" },
        { "name": "Nauru", "code": "NR" },
        { "name": "Nepal", "code": "NP" },
        { "name": "Netherlands", "code": "NL" },
        { "name": "Netherlands Antilles", "code": "AN" },
        { "name": "New Caledonia", "code": "NC" },
        { "name": "New Zealand", "code": "NZ" },
        { "name": "Nicaragua", "code": "NI" },
        { "name": "Niger", "code": "NE" },
        { "name": "Nigeria", "code": "NG" },
        { "name": "Niue", "code": "NU" },
        { "name": "Norfolk Island", "code": "NF" },
        { "name": "Northern Mariana Islands", "code": "MP" },
        { "name": "Norway", "code": "NO" },
        { "name": "Oman", "code": "OM" },
        { "name": "Pakistan", "code": "PK" },
        { "name": "Palau", "code": "PW" },
        { "name": "Palestinian Territory, Occupied", "code": "PS" },
        { "name": "Panama", "code": "PA" },
        { "name": "Papua New Guinea", "code": "PG" },
        { "name": "Paraguay", "code": "PY" },
        { "name": "Peru", "code": "PE" },
        { "name": "Philippines", "code": "PH" },
        { "name": "Pitcairn", "code": "PN" },
        { "name": "Poland", "code": "PL" },
        { "name": "Portugal", "code": "PT" },
        { "name": "Puerto Rico", "code": "PR" },
        { "name": "Qatar", "code": "QA" },
        { "name": "Reunion", "code": "RE" },
        { "name": "Romania", "code": "RO" },
        { "name": "Russian Federation", "code": "RU" },
        { "name": "RWANDA", "code": "RW" },
        { "name": "Saint Helena", "code": "SH" },
        { "name": "Saint Kitts and Nevis", "code": "KN" },
        { "name": "Saint Lucia", "code": "LC" },
        { "name": "Saint Pierre and Miquelon", "code": "PM" },
        { "name": "Saint Vincent and the Grenadines", "code": "VC" },
        { "name": "Samoa", "code": "WS" },
        { "name": "San Marino", "code": "SM" },
        { "name": "Sao Tome and Principe", "code": "ST" },
        { "name": "Saudi Arabia", "code": "SA" },
        { "name": "Senegal", "code": "SN" },
        { "name": "Serbia and Montenegro", "code": "CS" },
        { "name": "Seychelles", "code": "SC" },
        { "name": "Sierra Leone", "code": "SL" },
        { "name": "Singapore", "code": "SG" },
        { "name": "Slovakia", "code": "SK" },
        { "name": "Slovenia", "code": "SI" },
        { "name": "Solomon Islands", "code": "SB" },
        { "name": "Somalia", "code": "SO" },
        { "name": "South Africa", "code": "ZA" },
        { "name": "South Georgia and the South Sandwich Islands", "code": "GS" },
        { "name": "Spain", "code": "ES" },
        { "name": "Sri Lanka", "code": "LK" },
        { "name": "Sudan", "code": "SD" },
        { "name": "Suriname", "code": "SR" },
        { "name": "Svalbard and Jan Mayen", "code": "SJ" },
        { "name": "Swaziland", "code": "SZ" },
        { "name": "Sweden", "code": "SE" },
        { "name": "Switzerland", "code": "CH" },
        { "name": "Syrian Arab Republic", "code": "SY" },
        { "name": "Taiwan, Province of China", "code": "TW" },
        { "name": "Tajikistan", "code": "TJ" },
        { "name": "Tanzania, United Republic of", "code": "TZ" },
        { "name": "Thailand", "code": "TH" },
        { "name": "Timor-Leste", "code": "TL" },
        { "name": "Togo", "code": "TG" },
        { "name": "Tokelau", "code": "TK" },
        { "name": "Tonga", "code": "TO" },
        { "name": "Trinidad and Tobago", "code": "TT" },
        { "name": "Tunisia", "code": "TN" },
        { "name": "Turkey", "code": "TR" },
        { "name": "Turkmenistan", "code": "TM" },
        { "name": "Turks and Caicos Islands", "code": "TC" },
        { "name": "Tuvalu", "code": "TV" },
        { "name": "Uganda", "code": "UG" },
        { "name": "Ukraine", "code": "UA" },
        { "name": "United Arab Emirates", "code": "AE" },
        { "name": "United Kingdom", "code": "GB" },
        { "name": "United States", "code": "US" },
        { "name": "United States Minor Outlying Islands", "code": "UM" },
        { "name": "Uruguay", "code": "UY" },
        { "name": "Uzbekistan", "code": "UZ" },
        { "name": "Vanuatu", "code": "VU" },
        { "name": "Venezuela", "code": "VE" },
        { "name": "Viet Nam", "code": "VN" },
        { "name": "Virgin Islands, British", "code": "VG" },
        { "name": "Virgin Islands, U.S.", "code": "VI" },
        { "name": "Wallis and Futuna", "code": "WF" },
        { "name": "Western Sahara", "code": "EH" },
        { "name": "Yemen", "code": "YE" },
        { "name": "Zambia", "code": "ZM" },
        { "name": "Zimbabwe", "code": "ZW" }
    ]
}
const cities = {
    data: [
        { name: "An Giang", zipcode: "880000" },
        { name: " Bà Rịa-Vũng Tàu", zipcode: "790000" },
        { name: " Bạc Liêu", zipcode: "960000" },
        { name: " Bắc Kạn", zipcode: "260000" },
        { name: " Bắc Giang", zipcode: "230000" },
        { name: " Bắc Ninh", zipcode: "220000" },
        { name: " Bến Tre", zipcode: "930000" },
        { name: " Bình Dương", zipcode: "820000" },
        { name: " Bình Định", zipcode: "590000" },
        { name: "Bình Phước", zipcode: "830000" },
        { name: "Bình Thuận", zipcode: "800000" },
        { name: "Cà Mau", zipcode: "970000" },
        { name: "Cao Bằng", zipcode: "270000" },
        { name: "Cần Thơ", zipcode: "900000" },
        { name: "Đà Nẵng", zipcode: "550000" },
        { name: "Đắk Lắk", zipcode: "630000" },
        { name: "Đắk Nông", zipcode: "640000" },
        { name: "Điện Biên", zipcode: "380000" },
        { name: "Đồng Nai", zipcode: "810000" },
        { name: "Đồng Tháp", zipcode: "870000" },
        { name: "Gia Lai", zipcode: "600000" },
        { name: "Hà Giang", zipcode: "310000" },
        { name: "Hà Nam", zipcode: "400000" },
        { name: "Hà Nội", zipcode: "100000" },
        { name: "Hà Tĩnh", zipcode: "480000" },
        { name: "Hải Dương", zipcode: "170000" },
        { name: "Hải Phòng", zipcode: "180000" },
        { name: "Hậu Giang", zipcode: "910000" },
        { name: "Hòa Bình", zipcode: "350000" },
        { name: "Thành phố Hồ Chí Minh", zipcode: "700000" },
        { name: "Hưng Yên", zipcode: "160000" },
        { name: "Khánh Hoà", zipcode: "650000" },
        { name: "Kiên Giang", zipcode: "920000" },
        { name: "Kon Tum", zipcode: "580000" },
        { name: "Lai Châu", zipcode: "390000" },
        { name: "Lạng Sơn", zipcode: "240000" },
        { name: "Lào Cai", zipcode: "330000" },
        { name: "Lâm Đồng", zipcode: "670000" },
        { name: "Long An", zipcode: "850000" },
        { name: "Nam Định", zipcode: "420000" },
        { name: "Nghệ An", zipcode: "460000" },
        { name: "Ninh Bình", zipcode: "430000" },
        { name: "Ninh Thuận", zipcode: "660000" },
        { name: "Phú Thọ", zipcode: "290000" },
        { name: "Phú Yên", zipcode: "620000" },
        { name: "Quảng Bình", zipcode: "510000" },
        { name: "Quảng Nam", zipcode: "560000" },
        { name: "Quảng Ngãi", zipcode: "570000" },
        { name: "Quảng Ninh", zipcode: "200000" },
        { name: "Quảng Trị", zipcode: "520000" },
        { name: "Sóc Trăng", zipcode: "950000" },
        { name: "Sơn La", zipcode: "360000" },
        { name: "Tây Ninh", zipcode: "840000" },
        { name: "Thái Bình", zipcode: "410000" },
        { name: "Thái Nguyên", zipcode: "250000" },
        { name: "Thanh Hoá", zipcode: "440000" },
        { name: "Thừa Thiên-Huế", zipcode: "530000" },
        { name: "Tiền Giang", zipcode: "860000" },
        { name: "Trà Vinh", zipcode: "940000" },
        { name: "Tuyên Quang", zipcode: "300000" },
        { name: "Vĩnh Long", zipcode: "890000" },
        { name: "Vĩnh Phúc", zipcode: "280000" },
        { name: "Yên Bái", zipcode: "320000" }]
}

class InitCountryController {
    constructor() {
    }

    async addData() {
        // Remove all data 
        let clear_data = await this.removeAllData();
        // Add new data 
        if (clear_data) {
            let add_country = await this.insertDataCountry();
            let add_city = await this.insertCity();
            if (add_country && add_city) {
                console.log("Add data country and city ok !");
            }
        }
    }

    async removeAllData() {
        return new Promise((resolve, reject) => {
            let sql = `
            DELETE FROM fx_country WHERE 1 ;
            DELETE FROM fx_city WHERE 1 ;
            `;
            mySqlController.ExeQuery({
                query: sql,
                values: []
            }, function (err, rows, fields) {
                if (!err) {
                    resolve(true)
                } else {
                    console.log('clear table country and city  ok');
                    resolve(false)
                }
            });
        });
    }

    async insertDataCountry() {
        return new Promise((resolve, reject) => {
            let values = [];
            let sql = 'INSERT INTO `fx_country` ( `name`, `language`, `is_active`, `code`, `currencies`, `countryCallingCodes`) VALUES';
            var list_join = [];
            countries.data.forEach(item => {
                let language = item.code == "VN" ? 'vn' : 'en';
                list_join.push("( ?, ?, ?, ?, ?, ?)");
                values.push(item.name);
                values.push(language);
                values.push(1);
                values.push(item.code);
                values.push("");
                values.push("");

            });
            sql = sql + list_join.join(",");
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

    async insertCity() {
        return new Promise((resolve, reject) => {
            let values = [];
            let sql = 'INSERT INTO `fx_city` ( `name`, `country_code`, `zipcode`, `is_active`) VALUES';
            var list_join = [];
            cities.data.forEach(item => {
                list_join.push("( ?, ?, ?, ?)");
                values.push(item.name);
                values.push('vn');
                values.push(item.zipcode);
                values.push(1);
            });
            sql = sql + list_join.join(",");
            mySqlController.ExeQuery({
                query: sql,
                values: values
            }, async (err, rows, fields) => {
                if (!err) {
                    resolve(true);
                } else {
                    console.log("Have error when add city", err);
                    resolve(false);
                }
            });
        })
    }


}

module.exports = InitCountryController;