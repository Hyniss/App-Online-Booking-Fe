const countries = [
    {
        label: "+65 Singapore",
        value: "65",
        image: "https://gds.baguette.engineering/flags/sg.png",
    },
    {
        label: "+355 Albania",
        value: "355",
        image: "https://gds.baguette.engineering/flags/al.png",
    },
    {
        label: "+376 Andorra",
        value: "376",
        image: "https://gds.baguette.engineering/flags/ad.png",
    },
    {
        label: "+1 Antigua",
        value: "1",
        image: "https://gds.baguette.engineering/flags/ag.png",
    },
    {
        label: "+54 Argentina",
        value: "54",
        image: "https://gds.baguette.engineering/flags/ar.png",
    },
    {
        label: "+374 Armenia",
        value: "374",
        image: "https://gds.baguette.engineering/flags/am.png",
    },
    {
        label: "+61 Australia",
        value: "61",
        image: "https://gds.baguette.engineering/flags/au.png",
    },
    {
        label: "+43 Austria",
        value: "43",
        image: "https://gds.baguette.engineering/flags/at.png",
    },
    {
        label: "+994 Azerbaijan",
        value: "994",
        image: "https://gds.baguette.engineering/flags/az.png",
    },
    {
        label: "+1 Bahamas",
        value: "1",
        image: "https://gds.baguette.engineering/flags/bs.png",
    },
    {
        label: "+973 Bahrain",
        value: "973",
        image: "https://gds.baguette.engineering/flags/bh.png",
    },
    {
        label: "+880 Bangladesh",
        value: "880",
        image: "https://gds.baguette.engineering/flags/bd.png",
    },
    {
        label: "+1 Barbados",
        value: "1",
        image: "https://gds.baguette.engineering/flags/bb.png",
    },
    {
        label: "+375 Belarus",
        value: "375",
        image: "https://gds.baguette.engineering/flags/by.png",
    },
    {
        label: "+32 Belgium",
        value: "32",
        image: "https://gds.baguette.engineering/flags/be.png",
    },
    {
        label: "+501 Belize",
        value: "501",
        image: "https://gds.baguette.engineering/flags/bz.png",
    },
    {
        label: "+1 Bermuda",
        value: "1",
        image: "https://gds.baguette.engineering/flags/bm.png",
    },
    {
        label: "+975 Bhutan",
        value: "975",
        image: "https://gds.baguette.engineering/flags/bt.png",
    },
    {
        label: "+591 Bolivia",
        value: "591",
        image: "https://gds.baguette.engineering/flags/bo.png",
    },
    {
        label: "+387 Bosnia-Herzegovina",
        value: "387",
        image: "https://gds.baguette.engineering/flags/ba.png",
    },
    {
        label: "+267 Botswana",
        value: "267",
        image: "https://gds.baguette.engineering/flags/bw.png",
    },
    {
        label: "+55 Brazil",
        value: "55",
        image: "https://gds.baguette.engineering/flags/br.png",
    },
    {
        label: "+1 British Virgin Islands",
        value: "1",
        image: "https://gds.baguette.engineering/flags/vg.png",
    },
    {
        label: "+673 Brunei",
        value: "673",
        image: "https://gds.baguette.engineering/flags/bn.png",
    },
    {
        label: "+359 Bulgaria",
        value: "359",
        image: "https://gds.baguette.engineering/flags/bg.png",
    },
    {
        label: "+855 Cambodia",
        value: "855",
        image: "https://gds.baguette.engineering/flags/kh.png",
    },
    {
        label: "+1 Canada",
        value: "1",
        image: "https://gds.baguette.engineering/flags/ca.png",
    },
    {
        label: "+1 Cayman Islands",
        value: "1",
        image: "https://gds.baguette.engineering/flags/ky.png",
    },
    {
        label: "+56 Chile",
        value: "56",
        image: "https://gds.baguette.engineering/flags/cl.png",
    },
    {
        label: "+86 China",
        value: "86",
        image: "https://gds.baguette.engineering/flags/cn.png",
    },
    {
        label: "+57 Colombia",
        value: "57",
        image: "https://gds.baguette.engineering/flags/co.png",
    },
    {
        label: "+682 Cook Islands",
        value: "682",
        image: "https://gds.baguette.engineering/flags/ck.png",
    },
    {
        label: "+506 Costa Rica",
        value: "506",
        image: "https://gds.baguette.engineering/flags/cr.png",
    },
    {
        label: "+385 Croatia",
        value: "385",
        image: "https://gds.baguette.engineering/flags/hr.png",
    },
    {
        label: "+357 Cyprus",
        value: "357",
        image: "https://gds.baguette.engineering/flags/cy.png",
    },
    {
        label: "+420 Czech Republic",
        value: "420",
        image: "https://gds.baguette.engineering/flags/cz.png",
    },
    {
        label: "+45 Denmark",
        value: "45",
        image: "https://gds.baguette.engineering/flags/dk.png",
    },
    {
        label: "+1 Dominica",
        value: "1",
        image: "https://gds.baguette.engineering/flags/dm.png",
    },
    {
        label: "+1 Dominican Rep",
        value: "1",
        image: "https://gds.baguette.engineering/flags/do.png",
    },
    {
        label: "+593 Ecuador",
        value: "593",
        image: "https://gds.baguette.engineering/flags/ec.png",
    },
    {
        label: "+20 Egypt",
        value: "20",
        image: "https://gds.baguette.engineering/flags/eg.png",
    },
    {
        label: "+503 El Salvador",
        value: "503",
        image: "https://gds.baguette.engineering/flags/sv.png",
    },
    {
        label: "+44 England",
        value: "44",
        image: "https://gds.baguette.engineering/flags/gb-eng.png",
    },
    {
        label: "+372 Estonia",
        value: "372",
        image: "https://gds.baguette.engineering/flags/ee.png",
    },
    {
        label: "+298 Faeroe Is",
        value: "298",
        image: "https://gds.baguette.engineering/flags/fo.png",
    },
    {
        label: "+500 Falkland Is",
        value: "500",
        image: "https://gds.baguette.engineering/flags/fk.png",
    },
    {
        label: "+679 Fiji",
        value: "679",
        image: "https://gds.baguette.engineering/flags/fj.png",
    },
    {
        label: "+358 Finland",
        value: "358",
        image: "https://gds.baguette.engineering/flags/fi.png",
    },
    {
        label: "+33 France",
        value: "33",
        image: "https://gds.baguette.engineering/flags/fr.png",
    },
    {
        label: "+995 Georgia",
        value: "995",
        image: "https://gds.baguette.engineering/flags/ge.png",
    },
    {
        label: "+49 Germany",
        value: "49",
        image: "https://gds.baguette.engineering/flags/de.png",
    },
    {
        label: "+350 Gibraltar (UK)",
        value: "350",
        image: "https://gds.baguette.engineering/flags/gi.png",
    },
    {
        label: "+30 Greece",
        value: "30",
        image: "https://gds.baguette.engineering/flags/gr.png",
    },
    {
        label: "+299 Greenland",
        value: "299",
        image: "https://gds.baguette.engineering/flags/gl.png",
    },
    {
        label: "+1 Guam",
        value: "1",
        image: "https://gds.baguette.engineering/flags/gu.png",
    },
    {
        label: "+502 Guatemala",
        value: "502",
        image: "https://gds.baguette.engineering/flags/gt.png",
    },
    {
        label: "+504 Honduras",
        value: "504",
        image: "https://gds.baguette.engineering/flags/hn.png",
    },
    {
        label: "+852 Hong Kong",
        value: "852",
        image: "https://gds.baguette.engineering/flags/hk.png",
    },
    {
        label: "+36 Hungary",
        value: "36",
        image: "https://gds.baguette.engineering/flags/hu.png",
    },
    {
        label: "+354 Iceland",
        value: "354",
        image: "https://gds.baguette.engineering/flags/is.png",
    },
    {
        label: "+91 India",
        value: "91",
        image: "https://gds.baguette.engineering/flags/in.png",
    },
    {
        label: "+62 Indonesia",
        value: "62",
        image: "https://gds.baguette.engineering/flags/id.png",
    },
    {
        label: "+964 Iraq",
        value: "964",
        image: "https://gds.baguette.engineering/flags/iq.png",
    },
    {
        label: "+353 Ireland",
        value: "353",
        image: "https://gds.baguette.engineering/flags/ie.png",
    },
    {
        label: "+972 Israel",
        value: "972",
        image: "https://gds.baguette.engineering/flags/il.png",
    },
    {
        label: "+39 Italy",
        value: "39",
        image: "https://gds.baguette.engineering/flags/it.png",
    },
    {
        label: "+1 Jamaica",
        value: "1",
        image: "https://gds.baguette.engineering/flags/jm.png",
    },
    {
        label: "+81 Japan",
        value: "81",
        image: "https://gds.baguette.engineering/flags/jp.png",
    },
    {
        label: "+962 Jordan",
        value: "962",
        image: "https://gds.baguette.engineering/flags/jo.png",
    },
    {
        label: "+7 Kazakstan",
        value: "7",
        image: "https://gds.baguette.engineering/flags/kz.png",
    },
    {
        label: "+965 Kuwait",
        value: "965",
        image: "https://gds.baguette.engineering/flags/kw.png",
    },
    {
        label: "+856 Laos",
        value: "856",
        image: "https://gds.baguette.engineering/flags/la.png",
    },
    {
        label: "+371 Latvia",
        value: "371",
        image: "https://gds.baguette.engineering/flags/lv.png",
    },
    {
        label: "+423 Liechtenstein",
        value: "423",
        image: "https://gds.baguette.engineering/flags/li.png",
    },
    {
        label: "+370 Lithuania",
        value: "370",
        image: "https://gds.baguette.engineering/flags/lt.png",
    },
    {
        label: "+352 Luxembourg",
        value: "352",
        image: "https://gds.baguette.engineering/flags/lu.png",
    },
    {
        label: "+853 Macau",
        value: "853",
        image: "https://gds.baguette.engineering/flags/mo.png",
    },
    {
        label: "+389 Macedonia",
        value: "389",
        image: "https://gds.baguette.engineering/flags/mk.png",
    },
    {
        label: "+60 Malaysia",
        value: "60",
        image: "https://gds.baguette.engineering/flags/my.png",
    },
    {
        label: "+960 Maldives",
        value: "960",
        image: "https://gds.baguette.engineering/flags/mv.png",
    },
    {
        label: "+356 Malta",
        value: "356",
        image: "https://gds.baguette.engineering/flags/mt.png",
    },
    {
        label: "+596 Martinique",
        value: "596",
        image: "https://gds.baguette.engineering/flags/mq.png",
    },
    {
        label: "+230 Mauritius",
        value: "230",
        image: "https://gds.baguette.engineering/flags/mu.png",
    },
    {
        label: "+52 Mexico",
        value: "52",
        image: "https://gds.baguette.engineering/flags/mx.png",
    },
    {
        label: "+373 Moldova",
        value: "373",
        image: "https://gds.baguette.engineering/flags/md.png",
    },
    {
        label: "+377 Monaco",
        value: "377",
        image: "https://gds.baguette.engineering/flags/mc.png",
    },
    {
        label: "+382 Montenegro",
        value: "382",
        image: "https://gds.baguette.engineering/flags/me.png",
    },
    {
        label: "+1 Montserrat",
        value: "1",
        image: "https://gds.baguette.engineering/flags/ms.png",
    },
    {
        label: "+212 Morocco",
        value: "212",
        image: "https://gds.baguette.engineering/flags/ma.png",
    },
    {
        label: "+95 Myanmar",
        value: "95",
        image: "https://gds.baguette.engineering/flags/mm.png",
    },
    {
        label: "+977 Nepal",
        value: "977",
        image: "https://gds.baguette.engineering/flags/np.png",
    },
    {
        label: "+31 Netherlands",
        value: "31",
        image: "https://gds.baguette.engineering/flags/nl.png",
    },
    {
        label: "+64 New Zealand",
        value: "64",
        image: "https://gds.baguette.engineering/flags/nz.png",
    },
    {
        label: "+505 Nicaragua",
        value: "505",
        image: "https://gds.baguette.engineering/flags/ni.png",
    },
    {
        label: "+47 Norway",
        value: "47",
        image: "https://gds.baguette.engineering/flags/no.png",
    },
    {
        label: "+968 Oman",
        value: "968",
        image: "https://gds.baguette.engineering/flags/om.png",
    },
    {
        label: "+507 Panama",
        value: "507",
        image: "https://gds.baguette.engineering/flags/pa.png",
    },
    {
        label: "+675 Papua New Guinea",
        value: "675",
        image: "https://gds.baguette.engineering/flags/pg.png",
    },
    {
        label: "+595 Paraguay",
        value: "595",
        image: "https://gds.baguette.engineering/flags/py.png",
    },
    {
        label: "+51 Peru",
        value: "51",
        image: "https://gds.baguette.engineering/flags/pe.png",
    },
    {
        label: "+63 Philippines",
        value: "63",
        image: "https://gds.baguette.engineering/flags/ph.png",
    },
    {
        label: "+48 Poland",
        value: "48",
        image: "https://gds.baguette.engineering/flags/pl.png",
    },
    {
        label: "+351 Portugal",
        value: "351",
        image: "https://gds.baguette.engineering/flags/pt.png",
    },
    {
        label: "+1 Puerto Rico",
        value: "1",
        image: "https://gds.baguette.engineering/flags/pr.png",
    },
    {
        label: "+974 Qatar",
        value: "974",
        image: "https://gds.baguette.engineering/flags/qa.png",
    },
    {
        label: "+40 Romania",
        value: "40",
        image: "https://gds.baguette.engineering/flags/ro.png",
    },
    {
        label: "+7 Russia",
        value: "7",
        image: "https://gds.baguette.engineering/flags/ru.png",
    },
    {
        label: "+378 San Marino",
        value: "378",
        image: "https://gds.baguette.engineering/flags/sm.png",
    },
    {
        label: "+966 Saudi Arabia",
        value: "966",
        image: "https://gds.baguette.engineering/flags/sa.png",
    },
    {
        label: "+381 Serbia",
        value: "381",
        image: "https://gds.baguette.engineering/flags/rs.png",
    },
    {
        label: "+248 Seychelles",
        value: "248",
        image: "https://gds.baguette.engineering/flags/sc.png",
    },
    {
        label: "+65 Singapore",
        value: "65",
        image: "https://gds.baguette.engineering/flags/sg.png",
    },
    {
        label: "+421 Slovakia",
        value: "421",
        image: "https://gds.baguette.engineering/flags/sk.png",
    },
    {
        label: "+386 Slovenia",
        value: "386",
        image: "https://gds.baguette.engineering/flags/si.png",
    },
    {
        label: "+27 South Africa",
        value: "27",
        image: "https://gds.baguette.engineering/flags/za.png",
    },
    {
        label: "+82 South Korea",
        value: "82",
        image: "https://gds.baguette.engineering/flags/kr.png",
    },
    {
        label: "+34 Spain",
        value: "34",
        image: "https://gds.baguette.engineering/flags/es.png",
    },
    {
        label: "+94 Sri Lanka",
        value: "94",
        image: "https://gds.baguette.engineering/flags/lk.png",
    },
    {
        label: "+1 St Kitts &amp; Nevis",
        value: "1",
        image: "https://gds.baguette.engineering/flags/kn.png",
    },
    {
        label: "+1 St Lucia",
        value: "1",
        image: "https://gds.baguette.engineering/flags/lc.png",
    },
    {
        label: "+1 St Vincent",
        value: "1",
        image: "https://gds.baguette.engineering/flags/vc.png",
    },
    {
        label: "+46 Sweden",
        value: "46",
        image: "https://gds.baguette.engineering/flags/se.png",
    },
    {
        label: "+41 Switzerland",
        value: "41",
        image: "https://gds.baguette.engineering/flags/ch.png",
    },
    {
        label: "+886 Taiwan",
        value: "886",
        image: "https://gds.baguette.engineering/flags/tw.png",
    },
    {
        label: "+992 Tajikistan",
        value: "992",
        image: "https://gds.baguette.engineering/flags/tj.png",
    },
    {
        label: "+66 Thailand",
        value: "66",
        image: "https://gds.baguette.engineering/flags/th.png",
    },
    {
        label: "+1 Trinidad and Tobago",
        value: "1",
        image: "https://gds.baguette.engineering/flags/tt.png",
    },
    {
        label: "+216 Tunisia",
        value: "216",
        image: "https://gds.baguette.engineering/flags/tn.png",
    },
    {
        label: "+90 Turkey",
        value: "90",
        image: "https://gds.baguette.engineering/flags/tr.png",
    },
    {
        label: "+993 Turkmenistan",
        value: "993",
        image: "https://gds.baguette.engineering/flags/tm.png",
    },
    {
        label: "+971 UAE",
        value: "971",
        image: "https://gds.baguette.engineering/flags/ae.png",
    },
    {
        label: "+1 US Virgin Islands",
        value: "1",
        image: "https://gds.baguette.engineering/flags/vi.png",
    },
    {
        label: "+1 USA",
        value: "1",
        image: "https://gds.baguette.engineering/flags/us.png",
    },
    {
        label: "+380 Ukraine",
        value: "380",
        image: "https://gds.baguette.engineering/flags/ua.png",
    },
    {
        label: "+598 Uruguay",
        value: "598",
        image: "https://gds.baguette.engineering/flags/uy.png",
    },
    {
        label: "+998 Uzbekistan",
        value: "998",
        image: "https://gds.baguette.engineering/flags/uz.png",
    },
    {
        label: "+678 Vanuatu",
        value: "678",
        image: "https://gds.baguette.engineering/flags/vu.png",
    },
    {
        label: "+58 Venezuela",
        value: "58",
        image: "https://gds.baguette.engineering/flags/ve.png",
    },
    {
        label: "+84 Vietnam",
        value: "84",
        image: "https://gds.baguette.engineering/flags/vn.png",
    },
    {
        label: "+263 Zimbabwe",
        value: "263",
        image: "https://gds.baguette.engineering/flags/zw.png",
    },
];
export { countries };
