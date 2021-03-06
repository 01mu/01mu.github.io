function numWord(labelValue) {
    return Math.abs(Number(labelValue)) >= 1.0e+9
    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + " billion"
    : Math.abs(Number(labelValue)) >= 1.0e+6
    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + " million"
    : Math.abs(Number(labelValue)) >= 1.0e+3
    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + " thousand"
    : Math.abs(Number(labelValue));
}

function commas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function countryCode (inputValue) {
    var nameCountries = {
        'Afghanistan' : 'AF',
        'Aland Islands' : 'AX',
        'Albania' : 'AL',
        'Algeria' : 'DZ',
        'American Samoa' : 'AS',
        'Andorra' : 'AD',
        'Angola' : 'AO',
        'Anguilla' : 'AI',
        'Antarctica' : 'AQ',
        'Antigua and Barbuda' : 'AG',
        'Argentina' : 'AR',
        'Armenia' : 'AM',
        'Aruba' : 'AW',
        'Australia' : 'AU',
        'Austria' : 'AT',
        'Azerbaijan' : 'AZ',
        'Bahamas' : 'BS',
        'Bahrain' : 'BH',
        'Bangladesh' : 'BD',
        'Barbados' : 'BB',
        'Belarus' : 'BY',
        'Belgium' : 'BE',
        'Belize' : 'BZ',
        'Benin' : 'BJ',
        'Bermuda' : 'BM',
        'Bhutan' : 'BT',
        'Bolivia' : 'BO',
        'Bosnia and Herzegovina' : 'BA',
        'Botswana' : 'BW',
        'Bouvet Island' : 'BV',
        'Brazil' : 'BR',
        'British Indian Ocean Territory' : 'IO',
        'Brunei' : 'BN',
        'Bulgaria' : 'BG',
        'Burkina Faso' : 'BF',
        'Burundi' : 'BI',
        'Cambodia' : 'KH',
        'Cameroon' : 'CM',
        'Canada' : 'CA',
        'Cabo Verde' : 'CV',
        'Cayman Islands' : 'KY',
        'Central African Republic' : 'CF',
        'Chad' : 'TD',
        'Chile' : 'CL',
        'China' : 'CN',
        'Christmas Island' : 'CX',
        'Cocos (Keeling) Islands' : 'CC',
        'Colombia' : 'CO',
        'Comoros' : 'KM',
        'Congo (Brazzaville)' : 'CG',
        'Congo (Kinshasa)' : 'CD',
        'Cook Islands' : 'CK',
        'Costa Rica' : 'CR',
        'Cote d\'Ivoire' : 'CI',
        'Croatia' : 'HR',
        'Cuba' : 'CU',
        'Cyprus' : 'CY',
        'Czechia' : 'CZ',
        'Denmark' : 'DK',
        'Djibouti' : 'DJ',
        'Dominica' : 'DM',
        'Dominican Republic' : 'DO',
        'Ecuador' : 'EC',
        'Egypt' : 'EG',
        'El Salvador' : 'SV',
        'Equatorial Guinea' : 'GQ',
        'Eritrea' : 'ER',
        'Estonia' : 'EE',
        'Ethiopia' : 'ET',
        'Falkland Islands (Malvinas)' : 'FK',
        'Faroe Islands' : 'FO',
        'Fiji' : 'FJ',
        'Finland' : 'FI',
        'France' : 'FR',
        'French Guiana' : 'GF',
        'French Polynesia' : 'PF',
        'French Southern Territories' : 'TF',
        'Gabon' : 'GA',
        'Gambia' : 'GM',
        'Georgia' : 'GE',
        'Germany' : 'DE',
        'Ghana' : 'GH',
        'Gibraltar' : 'GI',
        'Greece' : 'GR',
        'Greenland' : 'GL',
        'Grenada' : 'GD',
        'Guadeloupe' : 'GP',
        'Guam' : 'GU',
        'Guatemala' : 'GT',
        'Guernsey' : 'GG',
        'Guinea' : 'GN',
        'Guinea-Bissau' : 'GW',
        'Guyana' : 'GY',
        'Haiti' : 'HT',
        'Heard Island & Mcdonald Islands' : 'HM',
        'Holy See' : 'VA',
        'Honduras' : 'HN',
        'Hong Kong' : 'HK',
        'Hungary' : 'HU',
        'Iceland' : 'IS',
        'India' : 'IN',
        'Indonesia' : 'ID',
        'Iran' : 'IR',
        'Iraq' : 'IQ',
        'Ireland' : 'IE',
        'Isle Of Man' : 'IM',
        'Israel' : 'IL',
        'Italy' : 'IT',
        'Jamaica' : 'JM',
        'Japan' : 'JP',
        'Jersey' : 'JE',
        'Jordan' : 'JO',
        'Kazakhstan' : 'KZ',
        'Kenya' : 'KE',
        'Kiribati' : 'KI',
        'South Korea' : 'KR',
        'Kuwait' : 'KW',
        'Kyrgyzstan' : 'KG',
        'Laos' : 'LA',
        'Latvia' : 'LV',
        'Lebanon' : 'LB',
        'Lesotho' : 'LS',
        'Liberia' : 'LR',
        'Libya' : 'LY',
        'Liechtenstein' : 'LI',
        'Lithuania' : 'LT',
        'Luxembourg' : 'LU',
        'Macao' : 'MO',
        'North Macedonia' : 'MK',
        'Madagascar' : 'MG',
        'Malawi' : 'MW',
        'Malaysia' : 'MY',
        'Maldives' : 'MV',
        'Mali' : 'ML',
        'Malta' : 'MT',
        'Marshall Islands' : 'MH',
        'Martinique' : 'MQ',
        'Mauritania' : 'MR',
        'Mauritius' : 'MU',
        'Mayotte' : 'YT',
        'Mexico' : 'MX',
        'Micronesia, Federated States Of' : 'FM',
        'Moldova' : 'MD',
        'Monaco' : 'MC',
        'Mongolia' : 'MN',
        'Montenegro' : 'ME',
        'Montserrat' : 'MS',
        'Morocco' : 'MA',
        'Mozambique' : 'MZ',
        'Burma' : 'MM',
        'Namibia' : 'NA',
        'Nauru' : 'NR',
        'Nepal' : 'NP',
        'Netherlands' : 'NL',
        'Netherlands Antilles' : 'AN',
        'New Caledonia' : 'NC',
        'New Zealand' : 'NZ',
        'Nicaragua' : 'NI',
        'Niger' : 'NE',
        'Nigeria' : 'NG',
        'Niue' : 'NU',
        'Norfolk Island' : 'NF',
        'Northern Mariana Islands' : 'MP',
        'Norway' : 'NO',
        'Oman' : 'OM',
        'Pakistan' : 'PK',
        'Palau' : 'PW',
        'Palestinian Territory, Occupied' : 'PS',
        'Panama' : 'PA',
        'Papua New Guinea' : 'PG',
        'Paraguay' : 'PY',
        'Peru' : 'PE',
        'Philippines' : 'PH',
        'Pitcairn' : 'PN',
        'Poland' : 'PL',
        'Portugal' : 'PT',
        'Puerto Rico' : 'PR',
        'Qatar' : 'QA',
        'Reunion' : 'RE',
        'Romania' : 'RO',
        'Russia' : 'RU',
        'Rwanda' : 'RW',
        'Saint Barthelemy' : 'BL',
        'Saint Helena' : 'SH',
        'Saint Kitts and Nevis' : 'KN',
        'Saint Lucia' : 'LC',
        'Saint Martin' : 'MF',
        'Saint Pierre And Miquelon' : 'PM',
        'Saint Vincent and the Grenadines' : 'VC',
        'Samoa' : 'WS',
        'San Marino' : 'SM',
        'Sao Tome and Principe' : 'ST',
        'Saudi Arabia' : 'SA',
        'Senegal' : 'SN',
        'Serbia' : 'RS',
        'Seychelles' : 'SC',
        'Sierra Leone' : 'SL',
        'Singapore' : 'SG',
        'Slovakia' : 'SK',
        'Slovenia' : 'SI',
        'Solomon Islands' : 'SB',
        'Somalia' : 'SO',
        'South Africa' : 'ZA',
        'South Georgia And Sandwich Isl.' : 'GS',
        'Spain' : 'ES',
        'Sri Lanka' : 'LK',
        'Sudan' : 'SD',
        'Suriname' : 'SR',
        'Svalbard And Jan Mayen' : 'SJ',
        'Eswatini' : 'SZ',
        'Sweden' : 'SE',
        'Switzerland' : 'CH',
        'Syria' : 'SY',
        'Taiwan' : 'TW',
        'Tajikistan' : 'TJ',
        'Tanzania' : 'TZ',
        'Thailand' : 'TH',
        'Timor-Leste' : 'TL',
        'Togo' : 'TG',
        'Tokelau' : 'TK',
        'Tonga' : 'TO',
        'Trinidad and Tobago' : 'TT',
        'Tunisia' : 'TN',
        'Turkey' : 'TR',
        'Turkmenistan' : 'TM',
        'Turks And Caicos Islands' : 'TC',
        'Tuvalu' : 'TV',
        'Uganda' : 'UG',
        'Ukraine' : 'UA',
        'United Arab Emirates' : 'AE',
        'United Kingdom' : 'GB',
        'United States' : 'US',
        'United States Outlying Islands' : 'UM',
        'Uruguay' : 'UY',
        'Uzbekistan' : 'UZ',
        'Vanuatu' : 'VU',
        'Venezuela' : 'VE',
        'Vietnam' : 'VN',
        'Virgin Islands, British' : 'VG',
        'Virgin Islands, U.S.' : 'VI',
        'Wallis And Futuna' : 'WF',
        'Western Sahara' : 'EH',
        'Yemen' : 'YE',
        'Zambia' : 'ZM',
        'Zimbabwe' : 'ZW',
        'Kosovo': 'XK',
        'West Bank and Gaza': 'PALESTINE',
        'MS Zaandam': 'NONE',
        'Diamond Princess': 'NONE',
        'South Sudan': 'SS',
        'Global': 'GLOBAL'
    };

    return nameCountries[inputValue];
};

function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['January','February','March','April','May','June','July',
        'August','September','October','November','December'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year;
    return time;
}

function getTimeString(date) {
    var date = new Date(date * 1000);

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    return month + '/' + day + '/' + year;
}
