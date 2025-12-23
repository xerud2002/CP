// Major cities by region/judet for all European countries
// Contains 20-30 major cities per region (no villages or communes)

export const oraseByCountryAndRegion: Record<string, Record<string, string[]>> = {
  // România - orașe majore per județ
  RO: {
    "Alba": ["Alba Iulia", "Sebeș", "Blaj", "Aiud", "Cugir", "Ocna Mureș", "Abrud", "Câmpeni", "Zlatna"],
    "Arad": ["Arad", "Chișineu-Criș", "Ineu", "Curtici", "Pâncota", "Lipova", "Nădlac", "Sântana"],
    "Argeș": ["Pitești", "Curtea de Argeș", "Câmpulung", "Mioveni", "Costești", "Ștefănești", "Topoloveni"],
    "Bacău": ["Bacău", "Onești", "Moinești", "Comănești", "Buhuși", "Târgu Ocna", "Slănic Moldova", "Dărmănești"],
    "Bihor": ["Oradea", "Salonta", "Marghita", "Beiuș", "Aleșd", "Nucet", "Vașcău", "Săcueni"],
    "Bistrița-Năsăud": ["Bistrița", "Beclean", "Năsăud", "Sângeorz-Băi", "Ilva Mică"],
    "Botoșani": ["Botoșani", "Dorohoi", "Darabani", "Săveni", "Bucecea", "Flămânzi", "Ștefănești"],
    "Brașov": ["Brașov", "Săcele", "Făgăraș", "Codlea", "Zărnești", "Râșnov", "Predeal", "Ghimbav", "Rupea", "Victoria"],
    "Brăila": ["Brăila", "Ianca", "Însurăței", "Faurei"],
    "București": ["București", "Sectorul 1", "Sectorul 2", "Sectorul 3", "Sectorul 4", "Sectorul 5", "Sectorul 6"],
    "Buzău": ["Buzău", "Râmnicu Sărat", "Nehoiu", "Pogoanele", "Pătârlagele"],
    "Călărași": ["Călărași", "Oltenița", "Budești", "Fundulea", "Lehliu Gară"],
    "Caraș-Severin": ["Reșița", "Caransebeș", "Bocșa", "Oravița", "Moldova Nouă", "Anina", "Oțelu Roșu", "Băile Herculane"],
    "Cluj": ["Cluj-Napoca", "Turda", "Dej", "Gherla", "Câmpia Turzii", "Huedin"],
    "Constanța": ["Constanța", "Mangalia", "Medgidia", "Năvodari", "Cernavodă", "Eforie Nord", "Eforie Sud", "Techirghiol", "Murfatlar", "Ovidiu"],
    "Covasna": ["Sfântu Gheorghe", "Târgu Secuiesc", "Covasna", "Întorsura Buzăului", "Baraolt"],
    "Dâmbovița": ["Târgoviște", "Moreni", "Pucioasa", "Găești", "Titu", "Fieni", "Răcari"],
    "Dolj": ["Craiova", "Băilești", "Calafat", "Filiași", "Segarcea", "Dăbuleni"],
    "Galați": ["Galați", "Tecuci", "Târgu Bujor", "Berești"],
    "Giurgiu": ["Giurgiu", "Bolintin-Vale", "Mihăilești"],
    "Gorj": ["Târgu Jiu", "Motru", "Rovinari", "Novaci", "Bumbe?ti-Jiu", "Țicleni", "Târgu Cărbunești"],
    "Harghita": ["Miercurea Ciuc", "Odorheiu Secuiesc", "Gheorgheni", "Toplița", "Cristuru Secuiesc", "Bălan", "Borsec"],
    "Hunedoara": ["Deva", "Hunedoara", "Petroșani", "Lupeni", "Vulcan", "Orăștie", "Brad", "Simeria", "Petrila", "Aninoasa"],
    "Ialomița": ["Slobozia", "Fetești", "Urziceni", "Țăndărei", "Fierbinți-Târg"],
    "Iași": ["Iași", "Pașcani", "Hârlău", "Târgu Frumos", "Podu Iloaiei"],
    "Ilfov": ["Voluntari", "Pantelimon", "Popești-Leordeni", "Buftea", "Chitila", "Bragadiru", "Otopeni", "Măgurele", "Snagov"],
    "Maramureș": ["Baia Mare", "Sighetu Marmației", "Borșa", "Vișeu de Sus", "Târgu Lăpuș", "Seini", "Săliștea de Sus"],
    "Mehedinți": ["Drobeta-Turnu Severin", "Orșova", "Strehaia", "Vânju Mare", "Baia de Aramă"],
    "Mureș": ["Târgu Mureș", "Reghin", "Sighișoara", "Târnăveni", "Luduș", "Iernut", "Sovata", "Miercurea Nirajului"],
    "Neamț": ["Piatra Neamț", "Roman", "Târgu Neamț", "Roznov"],
    "Olt": ["Slatina", "Caracal", "Balș", "Corabia", "Scornicești", "Drăgănești-Olt", "Potcoava"],
    "Prahova": ["Ploiești", "Câmpina", "Băicoi", "Sinaia", "Bușteni", "Azuga", "Breaza", "Mizil", "Urlați", "Vălenii de Munte", "Boldești-Scăeni"],
    "Sălaj": ["Zalău", "Șimleu Silvaniei", "Jibou", "Cehu Silvaniei"],
    "Satu Mare": ["Satu Mare", "Carei", "Negrești-Oaș", "Tășnad", "Livada", "Ardud"],
    "Sibiu": ["Sibiu", "Mediaș", "Cisnădie", "Agnita", "Avrig", "Copșa Mică", "Dumbrăveni", "Tălmaciu", "Miercurea Sibiului"],
    "Suceava": ["Suceava", "Fălticeni", "Rădăuți", "Câmpulung Moldovenesc", "Vatra Dornei", "Gura Humorului", "Siret", "Vicovu de Sus", "Dolhasca"],
    "Teleorman": ["Alexandria", "Roșiorii de Vede", "Turnu Măgurele", "Zimnicea", "Videle"],
    "Timiș": ["Timișoara", "Lugoj", "Sânnicolau Mare", "Jimbolia", "Făget", "Deta", "Buziaș", "Recaș"],
    "Tulcea": ["Tulcea", "Babadag", "Măcin", "Isaccea", "Sulina"],
    "Vaslui": ["Vaslui", "Bârlad", "Huși", "Negrești", "Murgeni"],
    "Vâlcea": ["Râmnicu Vâlcea", "Drăgășani", "Băile Olănești", "Băile Govora", "Horezu", "Călimănești", "Brezoi", "Ocnele Mari"],
    "Vrancea": ["Focșani", "Adjud", "Mărășești", "Odobești", "Panciu"]
  },

  // Anglia (UK) - orașe majore per județ
  GB: {
    "Greater London": ["London", "Westminster", "Camden", "Islington", "Hackney", "Tower Hamlets", "Greenwich", "Lewisham", "Southwark", "Lambeth", "Wandsworth", "Hammersmith", "Kensington", "Chelsea", "Richmond", "Kingston", "Croydon", "Bromley", "Bexley", "Barnet", "Harrow", "Hillingdon", "Ealing", "Hounslow", "Brent"],
    "Greater Manchester": ["Manchester", "Bolton", "Bury", "Oldham", "Rochdale", "Salford", "Stockport", "Tameside", "Trafford", "Wigan"],
    "West Midlands": ["Birmingham", "Coventry", "Wolverhampton", "Dudley", "Walsall", "Solihull", "West Bromwich"],
    "West Yorkshire": ["Leeds", "Bradford", "Wakefield", "Huddersfield", "Halifax", "Dewsbury", "Batley", "Keighley", "Pudsey"],
    "South Yorkshire": ["Sheffield", "Rotherham", "Doncaster", "Barnsley"],
    "Merseyside": ["Liverpool", "Birkenhead", "St Helens", "Southport", "Bootle", "Wallasey"],
    "Tyne and Wear": ["Newcastle upon Tyne", "Sunderland", "Gateshead", "South Shields", "North Shields", "Jarrow", "Wallsend"],
    "Londra": ["London", "Westminster", "City of London"],
    "Kent": ["Maidstone", "Canterbury", "Rochester", "Gillingham", "Chatham", "Dartford", "Gravesend", "Tonbridge", "Tunbridge Wells", "Folkestone", "Dover", "Margate", "Ramsgate", "Ashford"],
    "Essex": ["Chelmsford", "Colchester", "Southend-on-Sea", "Basildon", "Harlow", "Brentwood", "Grays", "Clacton-on-Sea", "Braintree"],
    "Hampshire": ["Winchester", "Southampton", "Portsmouth", "Basingstoke", "Andover", "Eastleigh", "Fareham", "Gosport", "Havant", "Aldershot", "Farnborough"],
    "Surrey": ["Guildford", "Woking", "Reigate", "Redhill", "Epsom", "Staines", "Camberley", "Farnham"],
    "Hertfordshire": ["Hertford", "St Albans", "Watford", "Hemel Hempstead", "Stevenage", "Hatfield", "Welwyn Garden City", "Bishops Stortford"],
    "Lancashire": ["Preston", "Lancaster", "Blackpool", "Blackburn", "Burnley", "Accrington", "Morecambe", "Chorley", "Leyland"],
    "Staffordshire": ["Stafford", "Stoke-on-Trent", "Tamworth", "Burton upon Trent", "Cannock", "Lichfield", "Newcastle-under-Lyme"],
    "Nottinghamshire": ["Nottingham", "Mansfield", "Worksop", "Newark-on-Trent", "Sutton-in-Ashfield", "Beeston"],
    "Leicestershire": ["Leicester", "Loughborough", "Hinckley", "Market Harborough", "Coalville", "Melton Mowbray"],
    "Derbyshire": ["Derby", "Chesterfield", "Ilkeston", "Swadlincote", "Buxton", "Glossop", "Long Eaton"],
    "Lincolnshire": ["Lincoln", "Grimsby", "Scunthorpe", "Boston", "Spalding", "Grantham", "Skegness", "Sleaford"],
    "Norfolk": ["Norwich", "Great Yarmouth", "King's Lynn", "Thetford", "Dereham"],
    "Suffolk": ["Ipswich", "Bury St Edmunds", "Lowestoft", "Felixstowe", "Newmarket", "Stowmarket"],
    "Cambridgeshire": ["Cambridge", "Peterborough", "Huntingdon", "Ely", "Wisbech", "St Neots"],
    "Devon": ["Exeter", "Plymouth", "Torquay", "Paignton", "Barnstaple", "Newton Abbot", "Exmouth", "Tiverton"],
    "Cornwall": ["Truro", "Falmouth", "Penzance", "Newquay", "St Austell", "Bodmin", "Camborne", "Redruth"],
    "Somerset": ["Taunton", "Bath", "Weston-super-Mare", "Yeovil", "Bridgwater", "Frome"],
    "Gloucestershire": ["Gloucester", "Cheltenham", "Stroud", "Cirencester", "Tewkesbury"],
    "Berkshire": ["Reading", "Slough", "Maidenhead", "Bracknell", "Windsor", "Newbury", "Wokingham"],
    "Oxfordshire": ["Oxford", "Banbury", "Abingdon", "Witney", "Bicester", "Didcot"],
    "Buckinghamshire": ["Aylesbury", "Milton Keynes", "High Wycombe", "Amersham", "Marlow", "Beaconsfield"],
    "Bedfordshire": ["Bedford", "Luton", "Dunstable", "Leighton Buzzard", "Biggleswade"],
    "Northamptonshire": ["Northampton", "Kettering", "Corby", "Wellingborough", "Rushden", "Daventry"],
    "Warwickshire": ["Warwick", "Leamington Spa", "Rugby", "Nuneaton", "Bedworth", "Stratford-upon-Avon"],
    "Worcestershire": ["Worcester", "Redditch", "Kidderminster", "Bromsgrove", "Evesham", "Droitwich"],
    "Herefordshire": ["Hereford", "Leominster", "Ross-on-Wye", "Ledbury"],
    "Shropshire": ["Shrewsbury", "Telford", "Oswestry", "Bridgnorth", "Ludlow", "Market Drayton"],
    "Cheshire": ["Chester", "Warrington", "Crewe", "Macclesfield", "Ellesmere Port", "Runcorn", "Northwich", "Widnes"],
    "Cumbria": ["Carlisle", "Barrow-in-Furness", "Kendal", "Whitehaven", "Workington", "Penrith"],
    "Northumberland": ["Morpeth", "Alnwick", "Berwick-upon-Tweed", "Hexham", "Ashington", "Blyth"],
    "County Durham": ["Durham", "Darlington", "Hartlepool", "Stockton-on-Tees", "Bishop Auckland", "Chester-le-Street"],
    "North Yorkshire": ["York", "Harrogate", "Scarborough", "Middlesbrough", "Whitby", "Northallerton", "Ripon", "Selby"],
    "East Riding of Yorkshire": ["Beverley", "Bridlington", "Goole", "Driffield"],
    "East Sussex": ["Brighton", "Hove", "Eastbourne", "Hastings", "Bexhill", "Lewes", "Seaford"],
    "West Sussex": ["Chichester", "Crawley", "Worthing", "Horsham", "Littlehampton", "Bognor Regis"],
    "Dorset": ["Dorchester", "Bournemouth", "Poole", "Weymouth", "Christchurch", "Bridport"],
    "Wiltshire": ["Salisbury", "Swindon", "Chippenham", "Trowbridge", "Devizes", "Warminster"],
    "Bristol": ["Bristol"],
    "Rutland": ["Oakham", "Uppingham"],
    "Isle of Wight": ["Newport", "Ryde", "Cowes", "Sandown", "Shanklin"]
  },

  // Italia - orașe majore per regiune
  IT: {
    "Lazio": ["Roma", "Latina", "Frosinone", "Viterbo", "Rieti", "Anzio", "Civitavecchia", "Velletri", "Cassino", "Tivoli", "Guidonia", "Pomezia", "Aprilia", "Nettuno"],
    "Lombardia": ["Milano", "Bergamo", "Brescia", "Como", "Cremona", "Lecco", "Lodi", "Mantova", "Monza", "Pavia", "Sondrio", "Varese", "Busto Arsizio", "Legnano", "Rho", "Desio", "Seregno"],
    "Campania": ["Napoli", "Salerno", "Caserta", "Avellino", "Benevento", "Torre del Greco", "Castellammare di Stabia", "Pozzuoli", "Giugliano", "Acerra", "Aversa", "Cava de' Tirreni"],
    "Sicilia": ["Palermo", "Catania", "Messina", "Siracusa", "Agrigento", "Trapani", "Ragusa", "Caltanissetta", "Enna", "Marsala", "Gela", "Vittoria", "Modica"],
    "Veneto": ["Venezia", "Verona", "Padova", "Vicenza", "Treviso", "Rovigo", "Belluno", "Chioggia", "Bassano del Grappa", "Mestre"],
    "Piemonte": ["Torino", "Alessandria", "Asti", "Biella", "Cuneo", "Novara", "Verbania", "Vercelli", "Moncalieri", "Rivoli", "Collegno", "Nichelino"],
    "Emilia-Romagna": ["Bologna", "Modena", "Parma", "Reggio Emilia", "Ravenna", "Ferrara", "Rimini", "Piacenza", "Forlì", "Cesena", "Imola", "Faenza"],
    "Puglia": ["Bari", "Taranto", "Foggia", "Lecce", "Brindisi", "Andria", "Barletta", "Trani", "Altamura", "Molfetta", "Cerignola"],
    "Toscana": ["Firenze", "Prato", "Livorno", "Arezzo", "Pisa", "Pistoia", "Lucca", "Grosseto", "Siena", "Massa", "Carrara", "Viareggio", "Empoli"],
    "Calabria": ["Catanzaro", "Reggio Calabria", "Cosenza", "Crotone", "Vibo Valentia", "Lamezia Terme", "Corigliano"],
    "Sardegna": ["Cagliari", "Sassari", "Quartu Sant'Elena", "Olbia", "Alghero", "Nuoro", "Oristano", "Carbonia", "Iglesias"],
    "Liguria": ["Genova", "La Spezia", "Savona", "Imperia", "Sanremo", "Rapallo", "Chiavari"],
    "Marche": ["Ancona", "Pesaro", "Ascoli Piceno", "Macerata", "Fermo", "Urbino", "Fano", "Jesi", "San Benedetto del Tronto"],
    "Friuli-Venezia Giulia": ["Trieste", "Udine", "Pordenone", "Gorizia", "Monfalcone"],
    "Trentino-Alto Adige": ["Trento", "Bolzano", "Rovereto", "Merano", "Bressanone", "Brunico"],
    "Abruzzo": ["L'Aquila", "Pescara", "Chieti", "Teramo", "Avezzano", "Vasto", "Lanciano"],
    "Umbria": ["Perugia", "Terni", "Foligno", "Città di Castello", "Spoleto", "Assisi", "Gubbio"],
    "Basilicata": ["Potenza", "Matera", "Melfi", "Policoro", "Lauria"],
    "Molise": ["Campobasso", "Isernia", "Termoli", "Venafro"],
    "Valle d'Aosta": ["Aosta", "Courmayeur", "Saint-Vincent", "Châtillon"]
  },

  // Spania - orașe majore per regiune
  ES: {
    "Madrid": ["Madrid", "Móstoles", "Alcalá de Henares", "Fuenlabrada", "Leganés", "Getafe", "Alcorcón", "Torrejón de Ardoz", "Parla", "Alcobendas", "Coslada", "Pozuelo de Alarcón", "Las Rozas", "San Sebastián de los Reyes"],
    "Catalonia": ["Barcelona", "Hospitalet de Llobregat", "Badalona", "Terrassa", "Sabadell", "Lleida", "Tarragona", "Mataró", "Santa Coloma de Gramenet", "Reus", "Girona", "Cornellà de Llobregat", "Sant Cugat del Vallès"],
    "Valencia": ["Valencia", "Alicante", "Elche", "Castellón de la Plana", "Torrevieja", "Orihuela", "Gandía", "Paterna", "Sagunto", "Alcoy", "Benidorm", "Denia"],
    "Andalusia": ["Sevilla", "Málaga", "Córdoba", "Granada", "Jerez de la Frontera", "Almería", "Huelva", "Marbella", "Dos Hermanas", "Algeciras", "Cádiz", "Jaén", "Mijas", "Vélez-Málaga"],
    "Galicia": ["Vigo", "A Coruña", "Ourense", "Lugo", "Santiago de Compostela", "Pontevedra", "Ferrol"],
    "Basque Country": ["Bilbao", "Vitoria-Gasteiz", "Donostia-San Sebastián", "Barakaldo", "Getxo", "Irun", "Portugalete"],
    "Castile and León": ["Valladolid", "Burgos", "Salamanca", "León", "Palencia", "Zamora", "Ávila", "Segovia", "Soria", "Ponferrada"],
    "Castilla-La Mancha": ["Albacete", "Toledo", "Guadalajara", "Ciudad Real", "Cuenca", "Talavera de la Reina", "Puertollano"],
    "Canary Islands": ["Las Palmas de Gran Canaria", "Santa Cruz de Tenerife", "San Cristóbal de La Laguna", "Telde", "Arona", "Santa Lucía de Tirajana"],
    "Aragon": ["Zaragoza", "Huesca", "Teruel", "Calatayud", "Utebo", "Monzón"],
    "Asturias": ["Oviedo", "Gijón", "Avilés", "Siero", "Langreo", "Mieres"],
    "Murcia": ["Murcia", "Cartagena", "Lorca", "Molina de Segura", "Alcantarilla", "Mazarrón"],
    "Balearic Islands": ["Palma", "Calvià", "Manacor", "Ibiza", "Ciutadella", "Mahón"],
    "Extremadura": ["Badajoz", "Cáceres", "Mérida", "Plasencia", "Don Benito", "Almendralejo"],
    "Cantabria": ["Santander", "Torrelavega", "Castro-Urdiales", "Camargo", "Piélagos"],
    "La Rioja": ["Logroño", "Calahorra", "Arnedo", "Haro"],
    "Navarre": ["Pamplona", "Tudela", "Barañáin", "Burlada", "Estella"]
  },

  // Germania - orașe majore per land
  DE: {
    "Bavaria": ["München", "Nürnberg", "Augsburg", "Regensburg", "Ingolstadt", "Würzburg", "Fürth", "Erlangen", "Bayreuth", "Bamberg", "Aschaffenburg", "Landshut", "Kempten", "Rosenheim", "Neu-Ulm", "Schweinfurt"],
    "North Rhine-Westphalia": ["Köln", "Düsseldorf", "Dortmund", "Essen", "Duisburg", "Bochum", "Wuppertal", "Bielefeld", "Bonn", "Münster", "Mönchengladbach", "Gelsenkirchen", "Aachen", "Krefeld", "Oberhausen", "Hagen", "Hamm", "Mülheim", "Leverkusen", "Solingen"],
    "Baden-Württemberg": ["Stuttgart", "Mannheim", "Karlsruhe", "Freiburg", "Heidelberg", "Ulm", "Heilbronn", "Pforzheim", "Reutlingen", "Esslingen", "Ludwigsburg", "Tübingen", "Villingen-Schwenningen", "Konstanz"],
    "Lower Saxony": ["Hannover", "Braunschweig", "Osnabrück", "Oldenburg", "Wolfsburg", "Göttingen", "Salzgitter", "Hildesheim", "Delmenhorst", "Wilhelmshaven", "Lüneburg", "Celle", "Emden"],
    "Hesse": ["Frankfurt am Main", "Wiesbaden", "Kassel", "Darmstadt", "Offenbach", "Hanau", "Gießen", "Marburg", "Fulda", "Wetzlar", "Rüsselsheim"],
    "Berlin": ["Berlin", "Charlottenburg", "Spandau", "Steglitz", "Tempelhof", "Neukölln", "Friedrichshain", "Kreuzberg", "Prenzlauer Berg", "Mitte"],
    "Hamburg": ["Hamburg", "Altona", "Eimsbüttel", "Wandsbek", "Bergedorf", "Harburg"],
    "Saxony": ["Leipzig", "Dresden", "Chemnitz", "Zwickau", "Plauen", "Görlitz", "Freiberg", "Bautzen"],
    "Rhineland-Palatinate": ["Mainz", "Ludwigshafen", "Koblenz", "Trier", "Kaiserslautern", "Worms", "Neuwied", "Speyer", "Landau"],
    "Saxony-Anhalt": ["Magdeburg", "Halle", "Dessau-Roßlau", "Wittenberg", "Stendal", "Quedlinburg"],
    "Thuringia": ["Erfurt", "Jena", "Gera", "Weimar", "Gotha", "Nordhausen", "Eisenach", "Suhl"],
    "Brandenburg": ["Potsdam", "Cottbus", "Brandenburg an der Havel", "Frankfurt (Oder)", "Oranienburg", "Falkensee"],
    "Schleswig-Holstein": ["Kiel", "Lübeck", "Flensburg", "Neumünster", "Norderstedt", "Elmshorn", "Pinneberg"],
    "Mecklenburg-Vorpommern": ["Rostock", "Schwerin", "Neubrandenburg", "Stralsund", "Greifswald", "Wismar"],
    "Saarland": ["Saarbrücken", "Neunkirchen", "Homburg", "Völklingen", "St. Wendel"],
    "Bremen": ["Bremen", "Bremerhaven"]
  },

  // Franța - orașe majore per regiune
  FR: {
    "Île-de-France": ["Paris", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil", "Montreuil", "Créteil", "Nanterre", "Versailles", "Courbevoie", "Vitry-sur-Seine", "Colombes", "Aulnay-sous-Bois", "Asnières-sur-Seine", "Rueil-Malmaison", "Aubervilliers"],
    "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Toulon", "Aix-en-Provence", "Avignon", "Antibes", "Cannes", "La Seyne-sur-Mer", "Hyères", "Fréjus", "Arles", "Grasse", "Cagnes-sur-Mer", "Aubagne"],
    "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble", "Saint-Étienne", "Villeurbanne", "Clermont-Ferrand", "Vénissieux", "Valence", "Chambéry", "Annecy", "Bourg-en-Bresse", "Montélimar", "Annemasse"],
    "Occitanie": ["Toulouse", "Montpellier", "Nîmes", "Perpignan", "Béziers", "Narbonne", "Carcassonne", "Albi", "Tarbes", "Sète", "Castres", "Rodez"],
    "Nouvelle-Aquitaine": ["Bordeaux", "Limoges", "Poitiers", "Pau", "La Rochelle", "Mérignac", "Pessac", "Bayonne", "Angoulême", "Niort", "Brive-la-Gaillarde", "Agen"],
    "Hauts-de-France": ["Lille", "Amiens", "Roubaix", "Tourcoing", "Dunkerque", "Calais", "Villeneuve-d'Ascq", "Valenciennes", "Douai", "Lens", "Arras", "Beauvais", "Compiègne"],
    "Grand Est": ["Strasbourg", "Reims", "Metz", "Mulhouse", "Nancy", "Colmar", "Troyes", "Épernay", "Charleville-Mézières", "Thionville", "Verdun"],
    "Normandie": ["Rouen", "Le Havre", "Caen", "Cherbourg-en-Cotentin", "Évreux", "Dieppe", "Lisieux", "Alençon"],
    "Bretagne": ["Rennes", "Brest", "Quimper", "Lorient", "Vannes", "Saint-Malo", "Saint-Brieuc", "Lanester", "Fougères"],
    "Pays de la Loire": ["Nantes", "Angers", "Le Mans", "Saint-Nazaire", "La Roche-sur-Yon", "Cholet", "Laval", "Rezé"],
    "Bourgogne-Franche-Comté": ["Dijon", "Besançon", "Belfort", "Chalon-sur-Saône", "Nevers", "Auxerre", "Mâcon", "Montbéliard"],
    "Centre-Val de Loire": ["Tours", "Orléans", "Bourges", "Blois", "Châteauroux", "Chartres", "Joué-lès-Tours", "Dreux"],
    "Corse": ["Ajaccio", "Bastia", "Porto-Vecchio", "Bonifacio", "Calvi", "Corte"]
  },

  // Austria - orașe majore per land
  AT: {
    "Vienna": ["Wien", "Vienna"],
    "Lower Austria": ["St. Pölten", "Wiener Neustadt", "Baden", "Klosterneuburg", "Amstetten", "Tulln", "Krems", "Mödling"],
    "Upper Austria": ["Linz", "Wels", "Steyr", "Leonding", "Traun", "Ansfelden", "Vöcklabruck"],
    "Styria": ["Graz", "Leoben", "Kapfenberg", "Bruck an der Mur", "Knittelfeld", "Weiz"],
    "Tyrol": ["Innsbruck", "Kufstein", "Schwaz", "Hall in Tirol", "Wörgl", "Telfs", "Imst"],
    "Salzburg": ["Salzburg", "Hallein", "Saalfelden", "Zell am See", "St. Johann im Pongau"],
    "Carinthia": ["Klagenfurt", "Villach", "Wolfsberg", "Spittal an der Drau", "Feldkirchen"],
    "Vorarlberg": ["Bregenz", "Dornbirn", "Feldkirch", "Hohenems", "Lustenau", "Bludenz"],
    "Burgenland": ["Eisenstadt", "Neusiedl am See", "Oberwart", "Mattersburg", "Pinkafeld"]
  },

  // Belgia - orașe majore per regiune
  BE: {
    "Brussels": ["Brussels", "Bruxelles", "Brussel"],
    "Antwerp": ["Antwerp", "Mechelen", "Turnhout", "Heist-op-den-Berg", "Mol", "Geel", "Lier"],
    "East Flanders": ["Ghent", "Aalst", "Sint-Niklaas", "Dendermonde", "Eeklo", "Lokeren", "Oudenaarde"],
    "West Flanders": ["Bruges", "Kortrijk", "Ostend", "Roeselare", "Ypres", "Waregem", "Izegem"],
    "Flemish Brabant": ["Leuven", "Aarschot", "Diest", "Tienen", "Halle", "Vilvoorde"],
    "Limburg": ["Hasselt", "Genk", "Tongeren", "Sint-Truiden", "Beringen", "Bilzen"],
    "Liège": ["Liège", "Verviers", "Seraing", "Herstal", "Spa", "Waremme", "Huy"],
    "Namur": ["Namur", "Dinant", "Gembloux", "Ciney", "Andenne"],
    "Hainaut": ["Charleroi", "Mons", "La Louvière", "Tournai", "Mouscron", "Binche", "Soignies"],
    "Walloon Brabant": ["Wavre", "Braine-l'Alleud", "Waterloo", "Nivelles", "Ottignies-Louvain-la-Neuve"],
    "Luxembourg": ["Arlon", "Bastogne", "Marche-en-Famenne", "Virton", "Libramont"]
  },

  // Olanda - orașe majore per provincie
  NL: {
    "North Holland": ["Amsterdam", "Haarlem", "Zaandam", "Alkmaar", "Hoorn", "Purmerend", "Heerhugowaard", "Amstelveen", "Hilversum"],
    "South Holland": ["Rotterdam", "The Hague", "Leiden", "Dordrecht", "Zoetermeer", "Delft", "Alphen aan den Rijn", "Gouda", "Schiedam"],
    "Utrecht": ["Utrecht", "Amersfoort", "Veenendaal", "Nieuwegein", "Zeist", "Woerden"],
    "North Brabant": ["Eindhoven", "'s-Hertogenbosch", "Tilburg", "Breda", "Helmond", "Oss", "Bergen op Zoom"],
    "Gelderland": ["Nijmegen", "Arnhem", "Apeldoorn", "Ede", "Harderwijk", "Wageningen", "Doetinchem"],
    "Limburg": ["Maastricht", "Heerlen", "Venlo", "Sittard", "Roermond", "Weert"],
    "Overijssel": ["Enschede", "Zwolle", "Almelo", "Hengelo", "Deventer", "Kampen"],
    "Groningen": ["Groningen", "Hoogezand", "Veendam", "Stadskanaal", "Winschoten"],
    "Friesland": ["Leeuwarden", "Sneek", "Heerenveen", "Drachten"],
    "Drenthe": ["Assen", "Emmen", "Hoogeveen", "Meppel"],
    "Flevoland": ["Almere", "Lelystad", "Dronten"],
    "Zeeland": ["Middelburg", "Vlissingen", "Terneuzen", "Goes"]
  },

  // Grecia - orașe majore per regiune
  GR: {
    "Attica": ["Athens", "Piraeus", "Peristeri", "Kallithea", "Nikaia", "Glyfada", "Voula", "Kifisia", "Marousi", "Nea Smyrni"],
    "Central Macedonia": ["Thessaloniki", "Serres", "Katerini", "Veria", "Giannitsa", "Kilkis"],
    "Crete": ["Heraklion", "Chania", "Rethymno", "Agios Nikolaos", "Ierapetra", "Sitia"],
    "Western Greece": ["Patras", "Agrinio", "Pyrgos", "Messolonghi"],
    "Peloponnese": ["Kalamata", "Tripoli", "Corinth", "Argos", "Sparta", "Nafplio"],
    "Thessaly": ["Larissa", "Volos", "Trikala", "Karditsa"],
    "Epirus": ["Ioannina", "Preveza", "Arta", "Igoumenitsa"],
    "Central Greece": ["Lamia", "Chalkida", "Livadeia", "Thebes"],
    "East Macedonia and Thrace": ["Kavala", "Alexandroupoli", "Komotini", "Xanthi", "Drama"],
    "North Aegean": ["Mytilene", "Chios", "Samos", "Lemnos"],
    "South Aegean": ["Rhodes", "Kos", "Mykonos", "Santorini", "Naxos", "Paros"],
    "Ionian Islands": ["Corfu", "Zakynthos", "Kefalonia", "Lefkada"],
    "Western Macedonia": ["Kozani", "Kastoria", "Florina", "Grevena"]
  },

  // Portugalia - orașe majore per district
  PT: {
    "Lisbon": ["Lisboa", "Amadora", "Sintra", "Cascais", "Loures", "Odivelas", "Oeiras", "Almada", "Barreiro"],
    "Porto": ["Porto", "Vila Nova de Gaia", "Matosinhos", "Gondomar", "Maia", "Valongo", "Póvoa de Varzim", "Vila do Conde"],
    "Braga": ["Braga", "Guimarães", "Barcelos", "Famalicão", "Esposende"],
    "Aveiro": ["Aveiro", "Ílhavo", "Ovar", "Águeda", "Estarreja"],
    "Faro": ["Faro", "Portimão", "Loulé", "Albufeira", "Olhão", "Lagos", "Tavira"],
    "Setúbal": ["Setúbal", "Seixal", "Montijo", "Sesimbra", "Palmela"],
    "Coimbra": ["Coimbra", "Figueira da Foz", "Cantanhede", "Lousã"],
    "Leiria": ["Leiria", "Marinha Grande", "Pombal", "Alcobaça", "Nazaré"],
    "Santarém": ["Santarém", "Entroncamento", "Tomar", "Torres Novas", "Abrantes"],
    "Viana do Castelo": ["Viana do Castelo", "Ponte de Lima", "Valença"],
    "Vila Real": ["Vila Real", "Chaves", "Peso da Régua", "Lamego"],
    "Viseu": ["Viseu", "Lamego", "Tondela", "São Pedro do Sul"],
    "Bragança": ["Bragança", "Mirandela", "Macedo de Cavaleiros"],
    "Guarda": ["Guarda", "Seia", "Gouveia"],
    "Castelo Branco": ["Castelo Branco", "Fundão", "Covilhã"],
    "Portalegre": ["Portalegre", "Elvas", "Ponte de Sor"],
    "Évora": ["Évora", "Estremoz", "Montemor-o-Novo"],
    "Beja": ["Beja", "Moura", "Ferreira do Alentejo"],
    "Azores": ["Ponta Delgada", "Angra do Heroísmo", "Horta", "Ribeira Grande"],
    "Madeira": ["Funchal", "Câmara de Lobos", "Machico", "Santa Cruz"]
  },

  // Norvegia - orașe majore per fylke
  NO: {
    "Oslo": ["Oslo"],
    "Viken": ["Drammen", "Sandvika", "Fredrikstad", "Sarpsborg", "Moss", "Lillestrøm", "Tønsberg", "Sandefjord", "Larvik", "Halden"],
    "Vestland": ["Bergen", "Haugesund", "Voss", "Odda"],
    "Trøndelag": ["Trondheim", "Steinkjer", "Levanger", "Namsos"],
    "Rogaland": ["Stavanger", "Sandnes", "Haugesund", "Egersund", "Bryne"],
    "Agder": ["Kristiansand", "Arendal", "Grimstad", "Mandal", "Flekkefjord"],
    "Innlandet": ["Lillehammer", "Gjøvik", "Hamar", "Elverum", "Kongsvinger"],
    "Møre og Romsdal": ["Ålesund", "Molde", "Kristiansund"],
    "Nordland": ["Bodø", "Narvik", "Mo i Rana", "Fauske"],
    "Troms og Finnmark": ["Tromsø", "Harstad", "Alta", "Hammerfest", "Kirkenes"],
    "Vestfold og Telemark": ["Skien", "Porsgrunn", "Tønsberg", "Sandefjord", "Larvik", "Notodden"]
  },

  // Suedia - orașe majore per län
  SE: {
    "Stockholm": ["Stockholm", "Solna", "Sundbyberg", "Nacka", "Huddinge", "Täby", "Lidingö"],
    "Västra Götaland": ["Göteborg", "Borås", "Mölndal", "Trollhättan", "Uddevalla", "Skövde", "Lidköping"],
    "Skåne": ["Malmö", "Helsingborg", "Lund", "Kristianstad", "Trelleborg", "Ystad", "Landskrona", "Ängelholm"],
    "Uppsala": ["Uppsala", "Enköping", "Östhammar"],
    "Östergötland": ["Linköping", "Norrköping", "Motala", "Mjölby"],
    "Jönköping": ["Jönköping", "Värnamo", "Huskvarna", "Nässjö"],
    "Örebro": ["Örebro", "Karlskoga", "Lindesberg"],
    "Halland": ["Halmstad", "Varberg", "Kungsbacka", "Falkenberg"],
    "Kronoberg": ["Växjö", "Ljungby", "Älmhult"],
    "Kalmar": ["Kalmar", "Västervik", "Oskarshamn", "Nybro"],
    "Gävleborg": ["Gävle", "Sandviken", "Hudiksvall", "Söderhamn", "Bollnäs"],
    "Dalarna": ["Falun", "Borlänge", "Avesta", "Ludvika", "Mora"],
    "Södermanland": ["Eskilstuna", "Nyköping", "Katrineholm", "Strängnäs"],
    "Värmland": ["Karlstad", "Arvika", "Kristinehamn", "Säffle"],
    "Västmanland": ["Västerås", "Köping", "Sala", "Fagersta"],
    "Västernorrland": ["Sundsvall", "Örnsköldsvik", "Härnösand", "Sollefteå"],
    "Västerbotten": ["Umeå", "Skellefteå", "Lycksele"],
    "Norrbotten": ["Luleå", "Piteå", "Boden", "Kiruna"],
    "Jämtland": ["Östersund", "Strömsund"],
    "Blekinge": ["Karlskrona", "Karlshamn", "Ronneby", "Sölvesborg"],
    "Gotland": ["Visby"]
  },

  // Danemarca - orașe majore per regiune
  DK: {
    "Capital Region": ["Copenhagen", "Frederiksberg", "Helsingør", "Hillerød", "Hørsholm", "Lyngby-Taarbæk", "Roskilde"],
    "Region Zealand": ["Roskilde", "Køge", "Næstved", "Holbæk", "Slagelse", "Ringsted"],
    "Central Denmark Region": ["Aarhus", "Randers", "Horsens", "Viborg", "Silkeborg", "Herning", "Holstebro"],
    "Region of Southern Denmark": ["Odense", "Esbjerg", "Kolding", "Vejle", "Fredericia", "Sønderborg", "Aabenraa"],
    "North Denmark Region": ["Aalborg", "Hjørring", "Frederikshavn", "Thisted", "Brønderslev"]
  },

  // Finlanda - orașe majore per regiune
  FI: {
    "Uusimaa": ["Helsinki", "Espoo", "Vantaa", "Kauniainen", "Kerava", "Järvenpää", "Kirkkonummi", "Hyvinkää", "Porvoo"],
    "Pirkanmaa": ["Tampere", "Nokia", "Valkeakoski", "Kangasala", "Ylöjärvi"],
    "Varsinais-Suomi": ["Turku", "Salo", "Raisio", "Naantali", "Kaarina"],
    "Kanta-Häme": ["Hämeenlinna", "Forssa", "Riihimäki"],
    "Päijät-Häme": ["Lahti", "Heinola", "Hollola"],
    "Kymenlaakso": ["Kotka", "Kouvola", "Hamina"],
    "South Karelia": ["Lappeenranta", "Imatra"],
    "North Karelia": ["Joensuu", "Lieksa", "Nurmes"],
    "North Savo": ["Kuopio", "Iisalmi", "Varkaus"],
    "Etelä-Savo": ["Mikkeli", "Savonlinna", "Pieksämäki"],
    "Ostrobothnia": ["Vaasa", "Seinäjoki", "Kokkola", "Pietarsaari"],
    "Central Ostrobothnia": ["Kokkola", "Karleby"],
    "South Ostrobothnia": ["Seinäjoki", "Lapua", "Kurikka"],
    "North Ostrobothnia": ["Oulu", "Raahe", "Ylivieska", "Kajaani"],
    "Kainuu": ["Kajaani", "Sotkamo"],
    "Lapland": ["Rovaniemi", "Kemi", "Tornio", "Kemijärvi"],
    "Satakunta": ["Pori", "Rauma", "Huittinen", "Ulvila"],
    "Central Finland": ["Jyväskylä", "Äänekoski", "Jämsä"],
    "Åland": ["Mariehamn"]
  },

  // Irlanda - orașe majore per county
  IE: {
    "Dublin": ["Dublin", "Dún Laoghaire", "Swords", "Blanchardstown", "Tallaght", "Clondalkin", "Lucan"],
    "Cork": ["Cork", "Ballincollig", "Carrigaline", "Cobh", "Midleton", "Mallow", "Youghal"],
    "Galway": ["Galway", "Tuam", "Ballinasloe", "Loughrea"],
    "Limerick": ["Limerick", "Newcastle West"],
    "Waterford": ["Waterford", "Tramore", "Dungarvan"],
    "Kerry": ["Tralee", "Killarney", "Listowel", "Dingle"],
    "Kildare": ["Naas", "Newbridge", "Leixlip", "Celbridge", "Athy", "Maynooth"],
    "Meath": ["Navan", "Ashbourne", "Trim", "Kells", "Dunshaughlin"],
    "Wicklow": ["Bray", "Greystones", "Wicklow", "Arklow", "Blessington"],
    "Louth": ["Drogheda", "Dundalk", "Ardee"],
    "Wexford": ["Wexford", "Enniscorthy", "New Ross", "Gorey"],
    "Kilkenny": ["Kilkenny", "Thomastown", "Callan"],
    "Carlow": ["Carlow", "Tullow", "Muine Bheag"],
    "Tipperary": ["Clonmel", "Nenagh", "Thurles", "Cahir"],
    "Clare": ["Ennis", "Shannon", "Kilrush"],
    "Donegal": ["Letterkenny", "Buncrana", "Donegal Town", "Ballyshannon"],
    "Sligo": ["Sligo", "Ballymote", "Tubbercurry"],
    "Mayo": ["Castlebar", "Ballina", "Westport"],
    "Roscommon": ["Roscommon", "Boyle", "Castlerea"],
    "Cavan": ["Cavan", "Bailieborough"],
    "Monaghan": ["Monaghan", "Carrickmacross", "Clones"],
    "Leitrim": ["Carrick-on-Shannon", "Manorhamilton"],
    "Longford": ["Longford", "Edgeworthstown"],
    "Westmeath": ["Mullingar", "Athlone"],
    "Offaly": ["Tullamore", "Birr", "Edenderry"],
    "Laois": ["Portlaoise", "Mountmellick", "Portarlington"]
  }
};

// Helper function to get cities for a specific country and region
export function getOraseForRegion(countryCode: string, regionName: string): string[] {
  return oraseByCountryAndRegion[countryCode]?.[regionName] || [];
}

// Helper function to get all cities for a country
export function getAllOraseForCountry(countryCode: string): string[] {
  const regions = oraseByCountryAndRegion[countryCode] || {};
  return Object.values(regions).flat();
}
