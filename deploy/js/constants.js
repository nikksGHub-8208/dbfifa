export const TEAM_FLAG_CODES = {
  "South Africa": "za",
  "Canada": "ca",
  "Brazil": "br",
  "Japan": "jp",
  "Germany": "de",
  "Paraguay": "py",
  "Netherlands": "nl",
  "Morocco": "ma",
  "Ivory Coast": "ci",
  "Norway": "no",
  "France": "fr",
  "Sweden": "se",
  "Mexico": "mx",
  "Ecuador": "ec",
  "England": "gb-eng",
  "DR Congo": "cd",
  "Belgium": "be",
  "Senegal": "sn",
  "United States": "us",
  "Bosnia and Herzegovina": "ba",
  "Spain": "es",
  "Austria": "at",
  "Portugal": "pt",
  "Croatia": "hr",
  "Switzerland": "ch",
  "Algeria": "dz",
  "Australia": "au",
  "Egypt": "eg",
  "Argentina": "ar",
  "Cape Verde": "cv",
  "Colombia": "co",
  "Ghana": "gh"
};

export const DEFAULT_FIXTURES = [
  { id: 78, timeIST: "30 Jun, 10:30 PM IST", home: "Ivory Coast", away: "Norway" },
  { id: 77, timeIST: "1 Jul, 2:30 AM IST", home: "France", away: "Sweden" },
  { id: 79, timeIST: "1 Jul, 6:30 AM IST", home: "Mexico", away: "Ecuador" },
  { id: 80, timeIST: "1 Jul, 9:30 PM IST", home: "England", away: "DR Congo" },
  { id: 82, timeIST: "2 Jul, 1:30 AM IST", home: "Belgium", away: "Senegal" },
  { id: 81, timeIST: "2 Jul, 5:30 AM IST", home: "United States", away: "Bosnia and Herzegovina" },
  { id: 84, timeIST: "3 Jul, 12:30 AM IST", home: "Spain", away: "Austria" },
  { id: 83, timeIST: "3 Jul, 4:30 AM IST", home: "Portugal", away: "Croatia" },
  { id: 85, timeIST: "3 Jul, 8:30 AM IST", home: "Switzerland", away: "Algeria" },
  { id: 88, timeIST: "3 Jul, 11:30 PM IST", home: "Australia", away: "Egypt" },
  { id: 86, timeIST: "4 Jul, 3:30 AM IST", home: "Argentina", away: "Cape Verde" },
  { id: 87, timeIST: "4 Jul, 7:00 AM IST", home: "Colombia", away: "Ghana" }
];

export const DEFAULT_PARTICIPANT_META = {
  "Nikhil Sobharaj": {
    photo: "https://drive.google.com/file/d/1rivrMQMdAVD45LNCOf6r3PzliDKlavAt/view?usp=drivesdk",
    fanCountry: "Portugal"
  },
  "Praveen Raj S": {
    photo: "https://drive.google.com/file/d/12gYsxupbsWUk3V08emdsg5wdz3DRfNIJ/view?usp=drivesdk",
    fanCountry: "England"
  },
  "Anupkumar": {
    photo: "https://drive.google.com/file/d/1dJ-DYewd2nJTewPmdiFWWB2XYV2FYwrf/view?usp=drivesdk",
    fanCountry: "Argentina"
  },
  "Mrudush Cholayil": {
    photo: "https://drive.google.com/file/d/1U4nHoejQho0GlX2OhZoJjqzRZIv1arhx/view?usp=drivesdk",
    fanCountry: "Argentina"
  },
  "Rajesh Kumar KP": {
    photo: "https://drive.google.com/file/d/1lsTn_fVO_7UUNHrLYy2vBH6k0yfyB7Lr/view?usp=drivesdk",
    fanCountry: "Brazil"
  },
  "Renjith NP": {
    photo: "https://drive.google.com/file/d/1LStL1rQRUr0U0TPrTemeK9G4OSgtSZoe/view?usp=drivesdk",
    fanCountry: "Brazil"
  },
  "Saji": {
    photo: "https://drive.google.com/file/d/1wNYCAhR6ZZ1cvelUVJ3Txrw5BSO5PMBj/view?usp=drivesdk",
    fanCountry: "Argentina"
  },
  "Sreejith": {
    photo: "https://drive.google.com/file/d/19Xi9tEIPjS5wGaBuKXrZkgMEhaemSnsL/view?usp=drivesdk",
    fanCountry: "Argentina",
    photoFocus: "center 18%"
  },
  "Navavi": {
    fanCountry: "Spain"
  }
};

export const DEFAULT_PARTICIPANTS = Object.keys(DEFAULT_PARTICIPANT_META);
