/**
 * Cascading area hierarchy: State → District → Mandal → Village
 * Focused on Andhra Pradesh & Telangana with key agricultural regions.
 */

export interface AreaNode {
  name: string;
  te: string; // Telugu translation
  children?: AreaNode[];
}

// Helper to quickly define nodes
function n(name: string, te: string, children?: AreaNode[]): AreaNode {
  return { name, te, children };
}

export const areaData: AreaNode[] = [
  // ── Andhra Pradesh ──
  n("Andhra Pradesh", "ఆంధ్ర ప్రదేశ్", [
    n("Anantapur", "అనంతపురం", [
      n("Anantapur", "అనంతపురం", [
        n("Anantapur", "అనంతపురం"), n("Bukkarayasamudram", "బుక్కరాయసముద్రం"),
        n("Garladinne", "గార్లదిన్నె"), n("Raptadu", "రాప్తాడు"),
        n("Vidapanakal", "విడపనకల్"),
      ]),
      n("Dharmavaram", "ధర్మవరం", [
        n("Dharmavaram", "ధర్మవరం"), n("Bathalapalle", "బాతలపల్లి"),
        n("Kanaganapalle", "కనగనపల్లి"), n("Mudigubba", "ముదిగుబ్బ"),
      ]),
      n("Kadiri", "కదిరి", [
        n("Kadiri", "కదిరి"), n("Amadagur", "అమదగూరు"),
        n("Nallacheruvu", "నల్లచెరువు"), n("Tanakal", "తానకల్"),
      ]),
      n("Penukonda", "పెనుకొండ", [
        n("Penukonda", "పెనుకొండ"), n("Gorantla", "గొరంట్ల"),
        n("Hindupur", "హిందూపురం"), n("Lepakshi", "లేపాక్షి"),
        n("Somandepalli", "సోమందేపల్లి"),
      ]),
      n("Guntakal", "గుంతకల్", [
        n("Guntakal", "గుంతకల్"), n("Gooty", "గూటి"),
        n("Pamidi", "పామిడి"), n("Uravakonda", "ఉరవకొండ"),
      ]),
      n("Tadipatri", "తాడిపత్రి", [
        n("Tadipatri", "తాడిపత్రి"), n("Yadiki", "యాడికి"),
        n("Peddavadugur", "పెద్దవడుగూరు"), n("Singanamala", "సింగనమల"),
      ]),
    ]),
    n("Chittoor", "చిత్తూరు", [
      n("Chittoor", "చిత్తూరు", [
        n("Chittoor", "చిత్తూరు"), n("Gudipala", "గుడిపాల"),
        n("Yadamarri", "యాడమర్రి"), n("Penumuru", "పెనుమూరు"),
      ]),
      n("Tirupati", "తిరుపతి", [
        n("Tirupati", "తిరుపతి"), n("Tirumala", "తిరుమల"),
        n("Chandragiri", "చంద్రగిరి"), n("Renigunta", "రేణిగుంట"),
      ]),
      n("Madanapalle", "మదనపల్లి", [
        n("Madanapalle", "మదనపల్లి"), n("Nimmanapalle", "నిమ్మనపల్లి"),
        n("Valmikipuram", "వాల్మీకిపురం"), n("Mulakalacheruvu", "ములకలచెరువు"),
      ]),
      n("Punganur", "పుంగనూరు", [
        n("Punganur", "పుంగనూరు"), n("Sodam", "సోడం"),
        n("Palamaneru", "పాలమనేరు"), n("Kuppam", "కుప్పం"),
      ]),
      n("Srikalahasti", "శ్రీకాళహస్తి", [
        n("Srikalahasti", "శ్రీకాళహస్తి"), n("Yerpedu", "యర్పేడు"),
        n("Thottambedu", "తొట్టంబేడు"), n("Narayanavanam", "నారాయణవనం"),
      ]),
    ]),
    n("East Godavari", "తూర్పు గోదావరి", [
      n("Kakinada", "కాకినాడ", [
        n("Kakinada", "కాకినాడ"), n("Samalkot", "సామర్లకోట"),
        n("Peddapuram", "పెద్దాపురం"), n("Gollaprolu", "గొల్లప్రోలు"),
      ]),
      n("Rajahmundry", "రాజమహేంద్రవరం", [
        n("Rajahmundry", "రాజమహేంద్రవరం"), n("Kadiam", "కడియం"),
        n("Korukonda", "కొరుకొండ"), n("Nidadavole", "నిడదవోలు"),
      ]),
      n("Amalapuram", "అమలాపురం", [
        n("Amalapuram", "అమలాపురం"), n("Mummidivaram", "ముమ్మిడివరం"),
        n("Razole", "రాజోలు"), n("Mandapeta", "మండపేట"),
      ]),
      n("Rampachodavaram", "రంపచోడవరం", [
        n("Rampachodavaram", "రంపచోడవరం"), n("Devipatnam", "దేవీపట్నం"),
        n("Gangavaram", "గంగవరం"), n("Addateegala", "అడ్డతీగల"),
      ]),
    ]),
    n("Guntur", "గుంటూరు", [
      n("Guntur", "గుంటూరు", [
        n("Guntur", "గుంటూరు"), n("Mangalagiri", "మంగళగిరి"),
        n("Tadepalle", "తాడేపల్లి"), n("Chebrolu", "చేబ్రోలు"),
        n("Pedanandipadu", "పెదనందిపాడు"),
      ]),
      n("Narasaraopet", "నరసరావుపేట", [
        n("Narasaraopet", "నరసరావుపేట"), n("Chilakaluripet", "చిలకలూరిపేట"),
        n("Vinukonda", "వినుకొండ"), n("Macherla", "మాచర్ల"),
      ]),
      n("Tenali", "తెనాలి", [
        n("Tenali", "తెనాలి"), n("Repalle", "రేపల్లె"),
        n("Bapatla", "బాపట్ల"), n("Duggirala", "దుగ్గిరాల"),
      ]),
      n("Sattenapalli", "సత్తెనపల్లి", [
        n("Sattenapalli", "సత్తెనపల్లి"), n("Piduguralla", "పిడుగురాళ్ల"),
        n("Bollapalli", "బొల్లాపల్లి"), n("Phirangipuram", "ఫిరంగిపురం"),
      ]),
    ]),
    n("Krishna", "కృష్ణా", [
      n("Vijayawada", "విజయవాడ", [
        n("Vijayawada", "విజయవాడ"), n("Kanchikacharla", "కంచికచర్ల"),
        n("Gannavaram", "గన్నవరం"), n("Ibrahimpatnam", "ఇబ్రహీంపట్నం"),
      ]),
      n("Machilipatnam", "మచిలీపట్నం", [
        n("Machilipatnam", "మచిలీపట్నం"), n("Gudivada", "గుడివాడ"),
        n("Pedana", "పెడన"), n("Bantumilli", "బంటుమిల్లి"),
      ]),
      n("Nuzvid", "నూజివీడు", [
        n("Nuzvid", "నూజివీడు"), n("Tiruvuru", "తిరువూరు"),
        n("Gampalagudem", "గంపాలగూడెం"), n("Agiripalli", "అగిరిపల్లి"),
      ]),
    ]),
    n("Kurnool", "కర్నూలు", [
      n("Kurnool", "కర్నూలు", [
        n("Kurnool", "కర్నూలు"), n("Orvakal", "ఓర్వకల్"),
        n("Kallur", "కల్లూరు"), n("Midthur", "మిద్తూరు"),
      ]),
      n("Nandyal", "నంద్యాల", [
        n("Nandyal", "నంద్యాల"), n("Banaganapalle", "బనగానపల్లె"),
        n("Koilakuntla", "కొయిలకుంట్ల"), n("Atmakur", "ఆత్మకూరు"),
      ]),
      n("Adoni", "ఆదోని", [
        n("Adoni", "ఆదోని"), n("Yemmiganur", "ఎమ్మిగనూరు"),
        n("Mantralayam", "మంత్రాలయం"), n("Kosigi", "కోసిగి"),
      ]),
    ]),
    n("Prakasam", "ప్రకాశం", [
      n("Ongole", "ఓంగోలు", [
        n("Ongole", "ఓంగోలు"), n("Chimakurthy", "చీమకుర్తి"),
        n("Kandukur", "కందుకూరు"), n("Darsi", "దర్శి"),
      ]),
      n("Markapur", "మార్కాపురం", [
        n("Markapur", "మార్కాపురం"), n("Giddalur", "గిద్దలూరు"),
        n("Cumbum", "కంభం"), n("Yerragondapalem", "ఎర్రగొండపాలెం"),
      ]),
    ]),
    n("YSR Kadapa", "వైఎస్ఆర్ కడప", [
      n("Kadapa", "కడప", [
        n("Kadapa", "కడప"), n("Vallur", "వల్లూరు"),
        n("Chennur", "చెన్నూరు"), n("Pendlimarri", "పెండ్లిమర్రి"),
      ]),
      n("Proddatur", "ప్రొద్దుటూరు", [
        n("Proddatur", "ప్రొద్దుటూరు"), n("Mydukur", "మైదుకూరు"),
        n("Jammalamadugu", "జమ్మలమడుగు"), n("Muddanur", "ముద్దనూరు"),
      ]),
      n("Rajampet", "రాజంపేట", [
        n("Rajampet", "రాజంపేట"), n("Kodur", "కోడూరు"),
        n("Nandalur", "నందలూరు"), n("Obulavaripalle", "ఓబులవారిపల్లె"),
      ]),
    ]),
    n("Nellore", "నెల్లూరు", [
      n("Nellore", "నెల్లూరు", [
        n("Nellore", "నెల్లూరు"), n("Kovur", "కోవూరు"),
        n("Venkatagiri", "వెంకటగిరి"), n("Gudur", "గూడూరు"),
      ]),
      n("Kavali", "కావలి", [
        n("Kavali", "కావలి"), n("Bogole", "బోగోలు"),
        n("Buchireddipalem", "బుచ్చిరెడ్డిపాలెం"), n("Vidavalur", "విడవలూరు"),
      ]),
    ]),
    n("West Godavari", "పశ్చిమ గోదావరి", [
      n("Eluru", "ఏలూరు", [
        n("Eluru", "ఏలూరు"), n("Denduluru", "దెందులూరు"),
        n("Chintalapudi", "చింతలపూడి"), n("Jangareddygudem", "జంగారెడ్డిగూడెం"),
      ]),
      n("Bhimavaram", "భీమవరం", [
        n("Bhimavaram", "భీమవరం"), n("Tadepalligudem", "తాడేపల్లిగూడెం"),
        n("Narasapuram", "నరసాపురం"), n("Palacole", "పాలకొల్లు"),
        n("Tanuku", "తణుకు"),
      ]),
    ]),
    n("Srikakulam", "శ్రీకాకుళం", [
      n("Srikakulam", "శ్రీకాకుళం", [
        n("Srikakulam", "శ్రీకాకుళం"), n("Gara", "గార"),
        n("Etcherla", "ఎచ్చెర్ల"), n("Amadalavalasa", "అమదాలవలస"),
      ]),
      n("Tekkali", "టెక్కలి", [
        n("Tekkali", "టెక్కలి"), n("Palasa", "పలాస"),
        n("Pathapatnam", "పాతపట్నం"), n("Ichchapuram", "ఇచ్ఛాపురం"),
      ]),
    ]),
    n("Visakhapatnam", "విశాఖపట్నం", [
      n("Visakhapatnam", "విశాఖపట్నం", [
        n("Visakhapatnam", "విశాఖపట్నం"), n("Gajuwaka", "గాజువాక"),
        n("Pendurthi", "పెందుర్తి"), n("Anakapalle", "అనకాపల్లి"),
      ]),
      n("Narsipatnam", "నర్సీపట్నం", [
        n("Narsipatnam", "నర్సీపట్నం"), n("Yelamanchili", "ఏలమంచిలి"),
        n("Chodavaram", "చోడవరం"), n("Madugula", "మాడుగుల"),
      ]),
    ]),
    n("Vizianagaram", "విజయనగరం", [
      n("Vizianagaram", "విజయనగరం", [
        n("Vizianagaram", "విజయనగరం"), n("Nellimarla", "నెల్లిమర్ల"),
        n("Cheepurupalli", "చీపురుపల్లి"), n("Gajapathinagaram", "గజపతినగరం"),
      ]),
      n("Bobbili", "బొబ్బిలి", [
        n("Bobbili", "బొబ్బిలి"), n("Salur", "సాలూరు"),
        n("Parvathipuram", "పార్వతీపురం"), n("Rajam", "రాజాం"),
      ]),
    ]),
  ]),

  // ── Telangana ──
  n("Telangana", "తెలంగాణ", [
    n("Adilabad", "ఆదిలాబాద్", [
      n("Adilabad", "ఆదిలాబాద్", [
        n("Adilabad", "ఆదిలాబాద్"), n("Mavala", "మావల"),
        n("Tamsi", "తామ్సి"), n("Jainad", "జైనాద్"),
      ]),
      n("Utnoor", "ఊట్నూర్", [
        n("Utnoor", "ఊట్నూర్"), n("Narnoor", "నార్నూర్"),
        n("Indervelly", "ఇందిర్‌వెల్లి"), n("Ichoda", "ఇచ్చోడ"),
      ]),
    ]),
    n("Karimnagar", "కరీంనగర్", [
      n("Karimnagar", "కరీంనగర్", [
        n("Karimnagar", "కరీంనగర్"), n("Kothapally", "కొత్తపల్లి"),
        n("Manakondur", "మానకొండూరు"), n("Huzurabad", "హుజూరాబాద్"),
      ]),
      n("Jagtial", "జగిత్యాల", [
        n("Jagtial", "జగిత్యాల"), n("Dharmapuri", "ధర్మపురి"),
        n("Metpally", "మెట్‌పల్లి"), n("Korutla", "కొరట్ల"),
      ]),
      n("Peddapalli", "పెద్దపల్లి", [
        n("Peddapalli", "పెద్దపల్లి"), n("Sultanabad", "సుల్తానాబాద్"),
        n("Manthani", "మంథని"), n("Ramagundam", "రామగుండం"),
      ]),
    ]),
    n("Warangal", "వరంగల్", [
      n("Warangal", "వరంగల్", [
        n("Warangal", "వరంగల్"), n("Hanamkonda", "హన్మకొండ"),
        n("Kazipet", "కాజీపేట"), n("Hasanparthy", "హసన్‌పర్తి"),
      ]),
      n("Jangaon", "జనగాం", [
        n("Jangaon", "జనగాం"), n("Raghunathpally", "రఘునాథపల్లి"),
        n("Zaffergadh", "జాఫర్‌గఢ్"), n("Palakurthy", "పాలకుర్తి"),
      ]),
      n("Mahabubabad", "మహబూబాబాద్", [
        n("Mahabubabad", "మహబూబాబాద్"), n("Thorrur", "తొర్రూర్"),
        n("Dornakal", "దొర్నకల్"), n("Kesamudram", "కేసముద్రం"),
      ]),
    ]),
    n("Khammam", "ఖమ్మం", [
      n("Khammam", "ఖమ్మం", [
        n("Khammam", "ఖమ్మం"), n("Raghunadhapalem", "రఘునాధపాలెం"),
        n("Nelakondapally", "నేలకొండపల్లి"), n("Wyra", "వైరా"),
      ]),
      n("Kothagudem", "కొత్తగూడెం", [
        n("Kothagudem", "కొత్తగూడెం"), n("Paloncha", "పాలొంచ"),
        n("Yellandu", "ఏళ్లందు"), n("Sathupalli", "సత్తుపల్లి"),
      ]),
    ]),
    n("Nalgonda", "నల్గొండ", [
      n("Nalgonda", "నల్గొండ", [
        n("Nalgonda", "నల్గొండ"), n("Nakrekal", "నాకరేకల్"),
        n("Kanagal", "కనగల్"), n("Tipparthi", "తిప్పర్తి"),
      ]),
      n("Suryapet", "సూర్యాపేట", [
        n("Suryapet", "సూర్యాపేట"), n("Kodad", "కోడాడ"),
        n("Huzurnagar", "హుజూర్‌నగర్"), n("Jagudevpally", "జాగుదేవ్‌పల్లి"),
      ]),
      n("Miryalaguda", "మిర్యాలగూడ", [
        n("Miryalaguda", "మిర్యాలగూడ"), n("Dameracherla", "దామరచర్ల"),
        n("Haliya", "హాలియా"), n("Nidamanoor", "నిడమనూరు"),
      ]),
    ]),
    n("Nizamabad", "నిజామాబాద్", [
      n("Nizamabad", "నిజామాబాద్", [
        n("Nizamabad", "నిజామాబాద్"), n("Dichpally", "డిచ్‌పల్లి"),
        n("Armoor", "ఆర్మూర్"), n("Balkonda", "బాల్కొండ"),
      ]),
      n("Kamareddy", "కామారెడ్డి", [
        n("Kamareddy", "కామారెడ్డి"), n("Yellareddy", "ఎల్లారెడ్డి"),
        n("Banswada", "బాన్సువాడ"), n("Domakonda", "దోమకొండ"),
      ]),
      n("Bodhan", "బోధన్", [
        n("Bodhan", "బోధన్"), n("Varni", "వర్ని"),
        n("Renjal", "రెంజల్"), n("Kotgiri", "కోట్‌గిరి"),
      ]),
    ]),
    n("Medak", "మెదక్", [
      n("Medak", "మెదక్", [
        n("Medak", "మెదక్"), n("Tekmal", "టేక్మల్"),
        n("Haveli Ghanapur", "హవేలీ ఘనపూర్"), n("Papannapet", "పాపన్నపేట"),
      ]),
      n("Sangareddy", "సంగారెడ్డి", [
        n("Sangareddy", "సంగారెడ్డి"), n("Narayankhed", "నారాయణఖేడ్"),
        n("Zaheerabad", "జహీరాబాద్"), n("Andole", "అందోల్"),
      ]),
      n("Siddipet", "సిద్దిపేట", [
        n("Siddipet", "సిద్దిపేట"), n("Gajwel", "గజ్వేల్"),
        n("Husnabad", "హుస్నాబాద్"), n("Dubbak", "దుబ్బాక"),
      ]),
    ]),
    n("Mahbubnagar", "మహబూబ్‌నగర్", [
      n("Mahbubnagar", "మహబూబ్‌నగర్", [
        n("Mahbubnagar", "మహబూబ్‌నగర్"), n("Koilkonda", "కోయిల్‌కొండ"),
        n("Addakal", "అద్దకల్"), n("Jadcherla", "జడ్చర్ల"),
      ]),
      n("Nagarkurnool", "నాగర్‌కర్నూల్", [
        n("Nagarkurnool", "నాగర్‌కర్నూల్"), n("Achampet", "అచ్చంపేట"),
        n("Kalwakurthy", "కల్వకుర్తి"), n("Kollapur", "కొల్లాపూర్"),
      ]),
      n("Wanaparthy", "వనపర్తి", [
        n("Wanaparthy", "వనపర్తి"), n("Gadwal", "గద్వాల"),
        n("Alampur", "ఆలంపూర్"), n("Atmakur", "ఆత్మకూర్"),
      ]),
    ]),
    n("Rangareddy", "రంగారెడ్డి", [
      n("Rangareddy", "రంగారెడ్డి", [
        n("Shamshabad", "శంషాబాద్"), n("Chevella", "చేవెళ్ల"),
        n("Ibrahimpatnam", "ఇబ్రహీంపట్నం"), n("Maheshwaram", "మహేశ్వరం"),
      ]),
      n("Vikarabad", "వికారాబాద్", [
        n("Vikarabad", "వికారాబాద్"), n("Tandur", "తాండూర్"),
        n("Pargi", "పర్గి"), n("Kodangal", "కోడంగల్"),
      ]),
    ]),
    n("Hyderabad", "హైదరాబాద్", [
      n("Hyderabad", "హైదరాబాద్", [
        n("Secunderabad", "సికింద్రాబాద్"), n("Amberpet", "అంబర్‌పేట"),
        n("Begumpet", "బేగంపేట"), n("Himayatnagar", "హిమాయత్‌నగర్"),
      ]),
    ]),
  ]),

  // ── Karnataka ──
  n("Karnataka", "కర్ణాటక", [
    n("Bangalore Rural", "బెంగళూరు గ్రామీణ", [
      n("Devanahalli", "దేవనహళ్లి", [
        n("Devanahalli", "దేవనహళ్లి"), n("Vijayapura", "విజయపుర"),
      ]),
      n("Doddaballapur", "దొడ్డబళ్లాపూర్", [
        n("Doddaballapur", "దొడ్డబళ్లాపూర్"), n("Nelamangala", "నెలమంగల"),
      ]),
    ]),
    n("Raichur", "రాయచూర్", [
      n("Raichur", "రాయచూర్", [
        n("Raichur", "రాయచూర్"), n("Manvi", "మాన్వి"),
        n("Devadurga", "దేవదుర్గ"), n("Sindhanur", "సింధనూర్"),
      ]),
    ]),
    n("Bellary", "బళ్లారి", [
      n("Bellary", "బళ్లారి", [
        n("Bellary", "బళ్లారి"), n("Hospet", "హోస్పేట"),
        n("Siruguppa", "సిరుగుప్ప"), n("Sandur", "సందూరు"),
      ]),
    ]),
    n("Gulbarga", "గుల్బర్గా", [
      n("Gulbarga", "గుల్బర్గా", [
        n("Gulbarga", "గుల్బర్గా"), n("Afzalpur", "అఫ్జల్‌పూర్"),
        n("Chincholi", "చించోలి"), n("Jevargi", "జేవర్గి"),
      ]),
    ]),
  ]),

  // ── Tamil Nadu ──
  n("Tamil Nadu", "తమిళనాడు", [
    n("Chennai", "చెన్నై", [
      n("Chennai", "చెన్నై", [
        n("Chennai", "చెన్నై"), n("Tambaram", "తంబరం"),
      ]),
    ]),
    n("Coimbatore", "కోయంబత్తూరు", [
      n("Coimbatore", "కోయంబత్తూరు", [
        n("Coimbatore", "కోయంబత్తూరు"), n("Pollachi", "పొల్లాచి"),
        n("Mettupalayam", "మెట్టుపాలయం"),
      ]),
    ]),
    n("Salem", "సేలం", [
      n("Salem", "సేలం", [
        n("Salem", "సేలం"), n("Attur", "ఆత్తూర్"),
        n("Mettur", "మేట్టూర్"),
      ]),
    ]),
  ]),

  // ── Maharashtra ──
  n("Maharashtra", "మహారాష్ట్ర", [
    n("Nagpur", "నాగ్‌పూర్", [
      n("Nagpur", "నాగ్‌పూర్", [
        n("Nagpur", "నాగ్‌పూర్"), n("Kamptee", "కంప్తీ"),
        n("Hingna", "హింగ్నా"),
      ]),
    ]),
    n("Nanded", "నాందేడ్", [
      n("Nanded", "నాందేడ్", [
        n("Nanded", "నాందేడ్"), n("Mukhed", "ముఖేడ్"),
        n("Deglur", "దేగ్లూర్"),
      ]),
    ]),
    n("Latur", "లాతూర్", [
      n("Latur", "లాతూర్", [
        n("Latur", "లాతూర్"), n("Udgir", "ఉద్గీర్"),
        n("Nilanga", "నిలంగా"),
      ]),
    ]),
  ]),
];

/* ── Helper functions ── */

/** Get all states */
export function getStates(): { value: string; label: string; te: string }[] {
  return areaData.map((s) => ({ value: s.name, label: s.name, te: s.te }));
}

/** Get districts for a given state */
export function getDistricts(state: string): { value: string; label: string; te: string }[] {
  const s = areaData.find((x) => x.name === state);
  return (s?.children || []).map((d) => ({ value: d.name, label: d.name, te: d.te }));
}

/** Get mandals for a given state + district */
export function getMandals(state: string, district: string): { value: string; label: string; te: string }[] {
  const s = areaData.find((x) => x.name === state);
  const d = s?.children?.find((x) => x.name === district);
  return (d?.children || []).map((m) => ({ value: m.name, label: m.name, te: m.te }));
}

/** Get villages for a given state + district + mandal */
export function getVillages(state: string, district: string, mandal: string): { value: string; label: string; te: string }[] {
  const s = areaData.find((x) => x.name === state);
  const d = s?.children?.find((x) => x.name === district);
  const m = d?.children?.find((x) => x.name === mandal);
  return (m?.children || []).map((v) => ({ value: v.name, label: v.name, te: v.te }));
}
