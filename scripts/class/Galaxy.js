class Galaxy {
  constructor() {
    this.systems = [];
    this.planets = [];
    this.factions = {};
    this.inhabitedPlanets = [];
  }

  async loadGalaxy() {
    let response = await fetch('/systems.json');
    this.systems = await response.json();
    response = await fetch('/planets.json');
    this.planets = await response.json();
  }

  process1Month() {
    this.inhabitedPlanets.forEach(planet => planet.process1Month());

  }

  process1Years() {
    this.inhabitedPlanets.forEach(planet => planet.process1Years());
  }

  process5Years() {
    this.inhabitedPlanets.forEach(planet => planet.process5Years());
  }
}

const theGalaxy = new Galaxy();
(async () => {
  await theGalaxy.loadGalaxy();

  theTime.call1month.push(() => theGalaxy.process1Month());
  theTime.call1years.push(() => theGalaxy.process1Years());
  theTime.call5years.push(() => theGalaxy.process5Years());

  const theEarth = theGalaxy.planets.filter(p => p.name == 'Earth')[0];
  window.theEarth = theEarth;
  theEarth.cls = new Planet(theEarth.id);
  theGalaxy.inhabitedPlanets.push(theEarth.cls);

  // ID: 0
  const usaEthics = new Ethics();
  usaEthics.increaseEthic('individual');
  usaEthics.increaseEthic('individual');
  usaEthics.increaseEthic('militarist');
  const usaFaction = new Faction(theEarth.id, 'USA', 220200, 3000000, usaEthics, {
    'formal': 100, 'natural': 100, 'social': 100, 'applied': 100
  }, {
    'alliance': [4, 6], 'rival': [1], 'rivaledBy': [1], 'war': [], 'protects': [], 'protectedBy': [], 'threatens': [], 'threatenedBy': []
  });
  usaFaction.baseNames = ['USA', 'United States', 'America', 'US', 'North America'];
  usaFaction.baseNamesAdjectives = ['American', 'US', 'North American'];
  usaFaction.partNames = ['America', 'North America', 'Texas', 'California', 'New York', 'Florida', 'Washington', 'Oregon', 'Alaska', 'Hawaii', 'Arizona', 'Nevada', 'Colorado', 'Utah', 'New Mexico', 'Idaho', 'Montana', 'Wyoming', 'North Dakota', 'South Dakota', 'Nebraska', 'Kansas', 'Oklahoma', 'Minnesota', 'Iowa', 'Missouri', 'Arkansas', 'Louisiana', 'Wisconsin', 'Illinois', 'Michigan', 'Indiana', 'Ohio', 'Kentucky', 'Tennessee', 'Mississippi', 'Alabama', 'Georgia', 'South Carolina', 'North Carolina', 'Virginia', 'West Virginia', 'Maryland', 'Delaware', 'Pennsylvania', 'New Jersey', 'Connecticut', 'Rhode Island', 'Massachusetts', 'Vermont', 'New Hampshire', 'Maine', 'Britain', 'England', 'Australia'];
  usaFaction.partNamesAdjectives = ['American', 'North American', 'Texan', 'Californian', 'New Yorker', 'Floridian', 'Washingtonian', 'Oregonian', 'Alaskan', 'Hawaiian', 'Arizonan', 'Nevadan', 'Coloradan', 'Utahn', 'New Mexican', 'Idahoan', 'Montanan', 'Wyomingite', 'North Dakotan', 'South Dakotan', 'Nebraskan', 'Kansan', 'Oklahoman', 'Minnesotan', 'Iowan', 'Missourian', 'Arkansan', 'Louisianan', 'Wisconsinite', 'Illinoisan', 'Michigander', 'Indianan', 'Ohioan', 'Kentuckian', 'Tennessean', 'Mississippian', 'Alabaman', 'Georgian', 'South Carolinian', 'North Carolinian', 'Virginian', 'West Virginian', 'Marylander', 'Delawarean', 'Pennsylvanian', 'New Jerseyan', 'Connecticuter', 'Rhode Islander', 'Massachusettsan', 'Vermonter', 'New Hampshirite', 'Mainer', 'British', 'English', 'Australian'];
  theEarth.cls.factions.push(usaFaction);

  // ID: 1
  const ussrEthics = new Ethics();
  ussrEthics.increaseEthic('authoritarian');
  ussrEthics.increaseEthic('communal');
  ussrEthics.increaseEthic('communal');
  const ussrFaction = new Faction(theEarth.id, 'USSR', 257800, 22400000, ussrEthics, {
    'formal': 80, 'natural': 80, 'social': 80, 'applied': 80
  }, {
    'alliance': [], 'rival': [0], 'rivaledBy': [0], 'war': [], 'protects': [], 'protectedBy': [], 'threatens': [], 'threatenedBy': []
  });
  ussrFaction.baseNames = ['Soviet Union', 'Russia', 'Soviet', 'Slavs'];
  ussrFaction.baseNamesAdjectives = ['Soviet', 'Russian', 'Slavic'];
  ussrFaction.partNames = ['Russia', 'Siberia', 'Far East', 'Ural', 'Volga', 'Caucasus', 'Central Asia', 'Northwest', 'Central', 'South', 'North', 'Far North', 'Far East', 'Karelia', 'Kola', 'Kamchatka', 'Sakhalin', 'Amur', 'Khabarovsk', 'Chukotka', 'Yakutia', 'Buryatia', 'Tuva', 'Altai', 'Khakassia', 'Krasnoyarsk', 'Irkutsk', 'Novosibirsk', 'Tomsk', 'Omsk', 'Altai', 'Kemerovo', 'Tyumen', 'Sverdlovsk', 'Chelyabinsk', 'Bashkortostan', 'Tatarstan', 'Mari El', 'Mordovia', 'Udmurtia', 'Perm', 'Komi', 'Arkhangelsk', 'Nenets', 'Komi-Permyak', 'Karelia', 'Vologda', 'Kirov', 'Nizhny Novgorod', 'Penza', 'Samara', 'Orenburg', 'Saratov', 'Volgograd', 'Astrakhan', 'Kalmykia', 'Dagestan', 'Chechnya', 'Ingushetia', 'Kabardino-Balkaria', 'North Ossetia', 'Karachay-Cherkessia', 'Adygea', 'Stavropol', 'Kaliningrad', 'Leningrad', 'Pskov', 'Novgorod', 'Tver', 'Moscow', 'Ryazan', 'Tula', 'Lipetsk', 'Tambov', 'Voronezh', 'Belgorod', 'Kursk', 'Bryansk', 'Kaluga', 'Smolensk', 'Oryol', 'Kostroma', 'Ivanovo', 'Yaroslavl', 'Vladimir', 'Nizhny Novgorod', 'Kirov', 'Ulyanovsk', 'Penza', 'Saratov', 'Samara', 'Orenburg', 'Bashkortostan'];
  ussrFaction.partNamesAdjectives = ['Russian', 'Siberian', 'Far Eastern', 'Ural', 'Volga', 'Caucasian', 'Central Asian', 'Northwestern', 'Central', 'Southern', 'Northern', 'Far Northern', 'Far Eastern', 'Karelian', 'Kola', 'Kamchatkan', 'Sakhalin', 'Amur', 'Khabarovsk', 'Chukotka', 'Yakut', 'Buryat', 'Tuva', 'Altai', 'Khakass', 'Krasnoyarsk', 'Irkutsk', 'Novosibirsk', 'Tomsk', 'Omsk', 'Altai', 'Kemerovo', 'Tyumen', 'Sverdlovsk', 'Chelyabinsk', 'Bashkir', 'Tatar', 'Mari', 'Mordovian', 'Udmurt', 'Perm', 'Komi', 'Arkhangelsk', 'Nenets', 'Komi-Permyak', 'Karelian', 'Vologda', 'Kirov', 'Nizhny Novgorod', 'Penza', 'Samara', 'Orenburg', 'Saratov', 'Volgograd', 'Astrakhan', 'Kalmyk', 'Dagestani', 'Chechen', 'Ingush', 'Kabardino-Balkarian', 'North Ossetian', 'Karachay-Cherkessian', 'Adyghe', 'Stavropol', 'Kaliningrad', 'Leningrad', 'Pskov', 'Novgorod', 'Tver', 'Moscow', 'Ryazan', 'Tula', 'Lipetsk', 'Tambov', 'Voronezh', 'Belgorod', 'Kursk', 'Bryansk', 'Kaluga', 'Smolensk', 'Oryol', 'Kostroma', 'Ivanovo', 'Yaroslavl', 'Vladimir', 'Nizhny Novgorod', 'Kirov', 'Ulyanovsk', 'Penza', 'Saratov', 'Samara', 'Orenburg', 'Bashkortostan'];
  theEarth.cls.factions.push(ussrFaction);

  // ID: 2
  const chinaEthics = new Ethics();
  chinaEthics.increaseEthic('communal');
  chinaEthics.increaseEthic('communal');
  chinaEthics.increaseEthic('xenophobe');
  const chinaFaction = new Faction(theEarth.id, 'China', 916400, 9600000, chinaEthics, {
    'formal': 0, 'natural': 0, 'social': 0, 'applied': 0
  }, {
    'alliance': [], 'rival': [], 'rivaledBy': [], 'war': [], 'protects': [], 'protectedBy': [], 'threatens': [], 'threatenedBy': []
  });
  chinaFaction.baseNames = ['China', 'Han', 'Zhongguo'];
  chinaFaction.baseNamesAdjectives = ['Chinese', 'Han'];
  chinaFaction.partNames = ['China', 'Beijing', 'Tianjin', 'Hebei', 'Shanxi', 'Inner Mongolia', 'Liaoning', 'Jilin', 'Heilongjiang', 'Shanghai', 'Jiangsu', 'Zhejiang', 'Anhui', 'Fujian', 'Jiangxi', 'Shandong', 'Henan', 'Hubei', 'Hunan', 'Guangdong', 'Guangxi', 'Hainan', 'Chongqing', 'Sichuan', 'Guizhou', 'Yunnan', 'Tibet', 'Shaanxi', 'Gansu', 'Qinghai', 'Ningxia', 'Xinjiang'];
  chinaFaction.partNamesAdjectives = ['Chinese', 'Beijing', 'Tianjin', 'Hebei', 'Shanxi', 'Inner Mongolian', 'Liaoning', 'Jilin', 'Heilongjiang', 'Shanghai', 'Jiangsu', 'Zhejiang', 'Anhui', 'Fujian', 'Jiangxi', 'Shandong', 'Henan', 'Hubei', 'Hunan', 'Guangdong', 'Guangxi', 'Hainan', 'Chongqing', 'Sichuan', 'Guizhou', 'Yunnan', 'Tibetan', 'Shaanxi', 'Gansu', 'Qinghai', 'Ningxia', 'Xinjiang'];
  theEarth.cls.factions.push(chinaFaction);

  // ID: 3
  const indiaEthics = new Ethics();
  indiaEthics.increaseEthic('authoritarian');
  indiaEthics.increaseEthic('communal');
  indiaEthics.increaseEthic('spiritualist');
  const indiaFaction = new Faction(theEarth.id, 'India', 623500, 3287000, indiaEthics, {
    'formal': 0, 'natural': 0, 'social': 0, 'applied': 0
  }, {
    'alliance': [], 'rival': [], 'rivaledBy': [], 'war': [], 'protects': [], 'protectedBy': [], 'threatens': [], 'threatenedBy': []
  });
  indiaFaction.baseNames = ['India', 'Hindustan', 'Bharat', 'Hindu'];
  indiaFaction.baseNamesAdjectives = ['Indian', 'Hindu', 'Bharati'];
  indiaFaction.partNames = ['India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh'];
  indiaFaction.partNamesAdjectives = ['Indian', 'Andhra', 'Arunachal', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya'];
  theEarth.cls.factions.push(indiaFaction);

  // ID: 4
  const eecEthics = new Ethics();
  eecEthics.increaseEthic('individual');
  eecEthics.increaseEthic('pacifist');
  eecEthics.increaseEthic('xenophile');
  const eecFaction = new Faction(theEarth.id, 'European Economic Community', 676770, 4233000, eecEthics, {
    'formal': 20, 'natural': 20, 'social': 20, 'applied': 20
  }, {
    'alliance': [0], 'rival': [], 'rivaledBy': [], 'war': [], 'protects': [], 'protectedBy': [], 'threatens': [], 'threatenedBy': []
  });
  eecFaction.baseNames = ['European Community', 'European Union', 'Europe', 'France', 'Germany', 'Spain'];
  eecFaction.baseNamesAdjectives = ['European', 'French', 'German', 'Spanish'];
  eecFaction.partNames = ['Europe', 'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Sweden', 'France', 'Germany', 'Spain'];
  eecFaction.partNamesAdjectives = ['European', 'Austrian', 'Belgian', 'Bulgarian', 'Croatian', 'Cypriot', 'Czech', 'Danish', 'Estonian', 'Finnish', 'Greek', 'Hungarian', 'Irish', 'Italian', 'Latvian', 'Lithuanian', 'Luxembourgish', 'Maltese', 'Dutch', 'Polish', 'Portuguese', 'Romanian', 'Slovak', 'Slovenian', 'Swedish', 'French', 'German', 'Spanish'];
  theEarth.cls.factions.push(eecFaction);

  // ID: 5
  const arabEthics = new Ethics();
  arabEthics.increaseEthic('authoritarian');
  arabEthics.increaseEthic('spiritualist');
  arabEthics.increaseEthic('militarist');
  const arabFaction = new Faction(theEarth.id, 'Arab Nations', 160000, 13000000, arabEthics, {
    'formal': 0, 'natural': 0, 'social': 0, 'applied': 0
  }, {
    'alliance': [], 'rival': [], 'rivaledBy': [], 'war': [], 'protects': [], 'protectedBy': [], 'threatens': [], 'threatenedBy': []
  });
  arabFaction.baseNames = ['Arab Nations', 'Arab League', 'Arab', 'North Africa'];
  arabFaction.baseNamesAdjectives = ['Arab', 'North African', 'Arabic'];
  arabFaction.partNames = ['Algeria', 'Bahrain', 'Comoros', 'Djibouti', 'Egypt', 'Iraq', 'Jordan', 'Kuwait', 'Lebanon', 'Libya', 'Mauritania', 'Morocco', 'Oman'];
  arabFaction.partNamesAdjectives = ['Algerian', 'Bahraini', 'Comorian', 'Djiboutian', 'Egyptian', 'Iraqi', 'Jordanian', 'Kuwaiti', 'Lebanese', 'Libyan', 'Mauritanian', 'Moroccan', 'Omani'];
  theEarth.cls.factions.push(arabFaction);

  // ID: 6
  const japanEthics = new Ethics();
  japanEthics.increaseEthic('individual');
  japanEthics.increaseEthic('materialist');
  japanEthics.increaseEthic('pacifist');
  const japanFaction = new Faction(theEarth.id, 'Japan', 111600, 377973, japanEthics, {
    'formal': 95, 'natural': 95, 'social': 95, 'applied': 95
  }, {
    'alliance': [0], 'rival': [], 'rivaledBy': [], 'war': [], 'protects': [], 'protectedBy': [], 'threatens': [], 'threatenedBy': []
  });
  japanFaction.baseNames = ['Japan', 'Nippon', 'Nihon'];
  japanFaction.baseNamesAdjectives = ['Japanese', 'Nipponese', 'Nihonese'];
  japanFaction.partNames = ['Japan', 'Hokkaido', 'Honshu', 'Shikoku', 'Kyushu'];
  japanFaction.partNamesAdjectives = ['Japanese', 'Hokkaido', 'Honshu', 'Shikoku', 'Kyushu'];
  theEarth.cls.factions.push(japanFaction);

  // ID: 7
  const southAmericaEthics = new Ethics();
  southAmericaEthics.increaseEthic('militarist');
  southAmericaEthics.increaseEthic('authoritarian');
  southAmericaEthics.increaseEthic('communal');
  const southAmericaFaction = new Faction(theEarth.id, 'South America', 202000, 6878000, southAmericaEthics, {
    'formal': 0, 'natural': 0, 'social': 0, 'applied': 0
  }, {
    'alliance': [], 'rival': [], 'rivaledBy': [], 'war': [], 'protects': [], 'protectedBy': [], 'threatens': [], 'threatenedBy': []
  });
  southAmericaFaction.baseNames = ['South America', 'Latin America', 'Brazil', 'Argentina'];
  southAmericaFaction.baseNamesAdjectives = ['South American', 'Latin American', 'Brazilian', 'Argentinian'];
  southAmericaFaction.partNames = ['South America', 'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'];
  southAmericaFaction.partNamesAdjectives = ['South American', 'Argentinian', 'Bolivian', 'Brazilian', 'Chilean', 'Colombian', 'Ecuadorian', 'Guyanese', 'Paraguayan', 'Peruvian', 'Surinamese', 'Uruguayan', 'Venezuelan'];
  theEarth.cls.factions.push(southAmericaFaction);

  // ID: 8
  const africaEthics = new Ethics();
  africaEthics.increaseEthic('spiritualist');
  africaEthics.increaseEthic('authoritarian');
  africaEthics.increaseEthic('militarist');
  const africaFaction = new Faction(theEarth.id, 'Africa', 250000, 17000000, africaEthics, {
    'formal': 0, 'natural': 0, 'social': 0, 'applied': 0
  }, {
    'alliance': [], 'rival': [], 'rivaledBy': [], 'war': [], 'protects': [], 'protectedBy': [], 'threatens': [], 'threatenedBy': []
  });
  africaFaction.baseNames = ['Africa', 'South Africa', 'Turkey', 'Egypt', 'Ethiopia', 'Nigeria'];
  africaFaction.baseNamesAdjectives = ['African', 'South African', 'Turkish', 'Egyptian', 'Ethiopian', 'Nigerian'];
  africaFaction.partNames = ['Africa', 'South Africa', 'Turkey', 'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Swaziland', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'];
  africaFaction.partNamesAdjectives = ['African', 'South African', 'Turkish', 'Algerian', 'Angolan', 'Beninese', 'Botswanan', 'Burkinabe', 'Burundian', 'Cameroonian', 'Cape Verdean', 'Central African', 'Chadian', 'Comorian', 'Congolese', 'Congolese', 'Djiboutian', 'Egyptian', 'Equatorial Guinean', 'Eritrean', 'Ethiopian', 'Gabonese', 'Gambian', 'Ghanaian', 'Guinean', 'Guinea-Bissauan', 'Ivorian', 'Kenyan', 'Lesothoan', 'Liberian', 'Libyan', 'Malagasy', 'Malawian', 'Malian', 'Mauritanian', 'Mauritian', 'Moroccan', 'Mozambican', 'Namibian', 'Nigerien', 'Nigerian', 'Rwandan', 'Sao Tomean', 'Senegalese', 'Seychellois', 'Sierra Leonean', 'Somali', 'South African', 'South Sudanese', 'Sudanese', 'Swazi', 'Tanzanian', 'Togolese', 'Tunisian', 'Ugandan', 'Zambian', 'Zimbabwean'];
  theEarth.cls.factions.push(africaFaction);

  theEarth.cls.calculatePlanetaryTechLvl();
  theEarth.cls.calculateTechBleedThrough();
  theEarth.cls.recalculateFactionStrengths();
})();
