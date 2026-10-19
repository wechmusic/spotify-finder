/**
 * Distributor detection database
 *
 * Detection priority:
 * 1. ISRC prefix (most reliable)
 * 2. UPC prefix
 * 3. Label name keywords
 *
 * ISRC format: CC-XXX-YY-NNNNN
 *   CC  = 2-char country code
 *   XXX = 3-char registrant code
 *   YY  = 2-digit year
 *   NNNNN = 5-digit designation
 *
 * We match on CC+XXX (5 chars) for specificity.
 * Some distributors use many registrant codes — we cover all known ones.
 */

// ---------------------------------------------------------------------------
// ISRC PREFIXES  (5-char: country + registrant)
// ---------------------------------------------------------------------------
const ISRC_PREFIXES = {

  // ── DistroKid ──────────────────────────────────────────────────────────────
  // DistroKid uses QZ** (CISAC-assigned for US indie) and TC** blocks
  "QZDA": "DistroKid",
  "QZFM": "DistroKid",
  "QZGN": "DistroKid",
  "QZHM": "DistroKid",
  "QZHN": "DistroKid",
  "QZJN": "DistroKid",
  "QZKN": "DistroKid",
  "QZLN": "DistroKid",
  "QZMN": "DistroKid",
  "QZNN": "DistroKid",
  "QZON": "DistroKid",
  "QZPN": "DistroKid",
  "QZQN": "DistroKid",
  "QZRN": "DistroKid",
  "QZSN": "DistroKid",
  "QZTN": "DistroKid",
  "QZUN": "DistroKid",
  "QZVN": "DistroKid",
  "QZWN": "DistroKid",
  "QZXN": "DistroKid",
  "QZYN": "DistroKid",
  "QZZN": "DistroKid",
  "QZES": "DistroKid",
  "TCABN": "DistroKid",  // 5-char match takes priority
  "TCABQ": "DistroKid",

  // ── TuneCore ───────────────────────────────────────────────────────────────
  "TCAB": "TuneCore",   // 4-char fallback (after 5-char TCABN/TCABQ checked)
  "QMFME": "TuneCore",
  "QMFMF": "TuneCore",
  "USRC1": "TuneCore",

  // ── CD Baby ────────────────────────────────────────────────────────────────
  "QM2PX": "CD Baby",
  "QMVRQ": "CD Baby",
  "QM6P4": "CD Baby",
  "QMFMG": "CD Baby",
  "USCA2": "CD Baby",

  // ── Amuse ──────────────────────────────────────────────────────────────────
  "SEAM1": "Amuse",
  "SEAME": "Amuse",
  "SEAM2": "Amuse",

  // ── UnitedMasters ──────────────────────────────────────────────────────────
  "QZUM1": "UnitedMasters",
  "TCUM1": "UnitedMasters",
  "USUM1": "UnitedMasters",

  // ── Believe Distribution ───────────────────────────────────────────────────
  // Believe is French (FR) but operates globally with many country registrants
  // French registrants
  "FRDG1": "Believe Distribution",
  "FRDG2": "Believe Distribution",
  "FRDG3": "Believe Distribution",
  "FRDG4": "Believe Distribution",
  "FRDG5": "Believe Distribution",
  "FRDG6": "Believe Distribution",
  "FRDG7": "Believe Distribution",
  "FRDG8": "Believe Distribution",
  "FRDG9": "Believe Distribution",
  "FRDGA": "Believe Distribution",
  "FRDGB": "Believe Distribution",
  "FRDGC": "Believe Distribution",
  "FRDGD": "Believe Distribution",
  "FRDGE": "Believe Distribution",
  "FRDGF": "Believe Distribution",
  "FRDGG": "Believe Distribution",
  "FRDGH": "Believe Distribution",
  "FRDGI": "Believe Distribution",
  "FRDGJ": "Believe Distribution",
  "FRDGK": "Believe Distribution",
  "FRDGL": "Believe Distribution",
  "FRDGM": "Believe Distribution",
  "FRDGN": "Believe Distribution",
  "FRDGO": "Believe Distribution",
  "FRDGP": "Believe Distribution",
  "FRDGQ": "Believe Distribution",
  "FRDGR": "Believe Distribution",
  "FRDGS": "Believe Distribution",
  "FRDGT": "Believe Distribution",
  "FRDGU": "Believe Distribution",
  "FRDGV": "Believe Distribution",
  "FRDGW": "Believe Distribution",
  "FRDGX": "Believe Distribution",
  "FRDGY": "Believe Distribution",
  "FRDGZ": "Believe Distribution",
  // German registrants (Believe DE)
  "DEDG1": "Believe Distribution",
  "DEDG2": "Believe Distribution",
  "DEDG3": "Believe Distribution",
  "DEDGA": "Believe Distribution",
  "DEDGB": "Believe Distribution",
  // UAE/Middle East registrants (AE = United Arab Emirates)
  // AEA3A = Believe's UAE/Turkey registrant (confirmed from real data)
  "AEA3A": "Believe Distribution",
  "AEA3B": "Believe Distribution",
  "AEA3C": "Believe Distribution",
  "AEA3D": "Believe Distribution",
  "AEA3E": "Believe Distribution",
  "AEA3F": "Believe Distribution",
  "AEA3G": "Believe Distribution",
  "AEA3H": "Believe Distribution",
  "AEA3I": "Believe Distribution",
  "AEA3J": "Believe Distribution",
  "AEA3K": "Believe Distribution",
  "AEA3L": "Believe Distribution",
  "AEA3M": "Believe Distribution",
  "AEA3N": "Believe Distribution",
  "AEA3O": "Believe Distribution",
  "AEA3P": "Believe Distribution",
  "AEA3Q": "Believe Distribution",
  "AEA3R": "Believe Distribution",
  "AEA3S": "Believe Distribution",
  "AEA3T": "Believe Distribution",
  "AEA3U": "Believe Distribution",
  "AEA3V": "Believe Distribution",
  "AEA3W": "Believe Distribution",
  "AEA3X": "Believe Distribution",
  "AEA3Y": "Believe Distribution",
  "AEA3Z": "Believe Distribution",
  // Other AE registrants used by Believe
  "AEA1A": "Believe Distribution",
  "AEA1B": "Believe Distribution",
  "AEA2A": "Believe Distribution",
  "AEA4A": "Believe Distribution",
  "AEA5A": "Believe Distribution",
  // Turkish registrants (TR)
  "TRA3A": "Believe Distribution",
  "TRA3B": "Believe Distribution",
  "TRA1A": "Believe Distribution",
  // Brazilian registrants (BR) - Believe BR
  "BRDG1": "Believe Distribution",
  "BRDG2": "Believe Distribution",
  "BRDGA": "Believe Distribution",
  // Indian registrants (IN) - Believe IN
  "INDG1": "Believe Distribution",
  "INDGA": "Believe Distribution",
  // Generic DGA prefix (used in older Believe releases)
  "DGA05": "Believe Distribution",
  "DGA06": "Believe Distribution",
  "DGA07": "Believe Distribution",
  "DGA08": "Believe Distribution",
  "DGA09": "Believe Distribution",

  // ── ONErpm ─────────────────────────────────────────────────────────────────
  "QMONE": "ONErpm",
  "BRONE": "ONErpm",
  "USONE": "ONErpm",
  "QZONE": "ONErpm",
  "US7VG": "ONErpm",
  "US7VH": "ONErpm",
  "US7VI": "ONErpm",
  "US7VJ": "ONErpm",
  "US7VK": "ONErpm",
  "US7VL": "ONErpm",
  "US7VM": "ONErpm",
  "US7VN": "ONErpm",
  "US7VO": "ONErpm",
  "US7VP": "ONErpm",
  "US7VQ": "ONErpm",
  "US7VR": "ONErpm",
  "US7VS": "ONErpm",
  "US7VT": "ONErpm",
  "US7VU": "ONErpm",
  "US7VV": "ONErpm",
  "US7VW": "ONErpm",
  "US7VX": "ONErpm",
  "US7VY": "ONErpm",
  "US7VZ": "ONErpm",

  // ── AWAL (Sony subsidiary) ─────────────────────────────────────────────────
  "GBARL": "AWAL",
  "TCARL": "AWAL",
  "USARL": "AWAL",

  // ── Stem ───────────────────────────────────────────────────────────────────
  "QZSTE": "Stem",
  "USSTE": "Stem",

  // ── Ditto Music ────────────────────────────────────────────────────────────
  "GBDTO": "Ditto Music",
  "GBDIT": "Ditto Music",
  "IEDTO": "Ditto Music",

  // ── RouteNote ──────────────────────────────────────────────────────────────
  "GBRTN": "RouteNote",
  "GBROU": "RouteNote",

  // ── Spinnup (Universal) ────────────────────────────────────────────────────
  "SESPI": "Spinnup",
  "GBSPI": "Spinnup",
  "DESPI": "Spinnup",

  // ── Kontor New Media ───────────────────────────────────────────────────────
  "DEKON": "Kontor New Media",
  "DEKN1": "Kontor New Media",

  // ── iGroove ────────────────────────────────────────────────────────────────
  "CHIGR": "iGroove",
  "CHIG1": "iGroove",

  // ── Feiyr ──────────────────────────────────────────────────────────────────
  "DEFEI": "Feiyr",
  "DEFY1": "Feiyr",

  // ── Soundrop ───────────────────────────────────────────────────────────────
  "QZSDR": "Soundrop",
  "USSDR": "Soundrop",

  // ── Caster / Audiosalad ────────────────────────────────────────────────────
  // Audiosalad is a Swedish distributor, SE = Sweden registrant block
  // SE57V confirmed from real data
  "SE57V": "Caster (Audiosalad)",
  "SE57W": "Caster (Audiosalad)",
  "SE57X": "Caster (Audiosalad)",
  "SE57Y": "Caster (Audiosalad)",
  "SE57Z": "Caster (Audiosalad)",
  "SE57A": "Caster (Audiosalad)",
  "SE57B": "Caster (Audiosalad)",
  "SE57C": "Caster (Audiosalad)",
  "SE57D": "Caster (Audiosalad)",
  "SE57E": "Caster (Audiosalad)",
  "SE57F": "Caster (Audiosalad)",
  "SE57G": "Caster (Audiosalad)",
  "SE57H": "Caster (Audiosalad)",
  "SE57I": "Caster (Audiosalad)",
  "SE57J": "Caster (Audiosalad)",
  "SE57K": "Caster (Audiosalad)",
  "SE57L": "Caster (Audiosalad)",
  "SE57M": "Caster (Audiosalad)",
  "SE57N": "Caster (Audiosalad)",
  "SE57O": "Caster (Audiosalad)",
  "SE57P": "Caster (Audiosalad)",
  "SE57Q": "Caster (Audiosalad)",
  "SE57R": "Caster (Audiosalad)",
  "SE57S": "Caster (Audiosalad)",
  "SE57T": "Caster (Audiosalad)",
  "SE57U": "Caster (Audiosalad)",
  "SEAUD": "Caster (Audiosalad)",
  "SEASL": "Caster (Audiosalad)",

  // ── SoundOn (TikTok) / Audiosalad ─────────────────────────────────────────
  // SoundOn is TikTok's distribution arm, uses QT** ISRC block
  // Confirmed prefixes: QT8BT, QT82V, QT5M5, QT5M6, QT5M2
  "QT8BT": "SoundOn (TikTok)",
  "QT82V": "SoundOn (TikTok)",
  "QT5M5": "SoundOn (TikTok)",
  "QT5M6": "SoundOn (TikTok)",
  "QT5M2": "SoundOn (TikTok)",
  "QT5M1": "SoundOn (TikTok)",
  "QT5M3": "SoundOn (TikTok)",
  "QT5M4": "SoundOn (TikTok)",
  "QT5M7": "SoundOn (TikTok)",
  "QT5M8": "SoundOn (TikTok)",
  "QT5M9": "SoundOn (TikTok)",
  "QT5MA": "SoundOn (TikTok)",
  "QT5MB": "SoundOn (TikTok)",
  "QT5MC": "SoundOn (TikTok)",
  "QT5MD": "SoundOn (TikTok)",
  "QT5ME": "SoundOn (TikTok)",
  "QT5MF": "SoundOn (TikTok)",
  "QT5MG": "SoundOn (TikTok)",
  "QT5MH": "SoundOn (TikTok)",
  "QT5MI": "SoundOn (TikTok)",
  "QT5MJ": "SoundOn (TikTok)",
  "QT5MK": "SoundOn (TikTok)",
  "QT5ML": "SoundOn (TikTok)",
  "QT5MM": "SoundOn (TikTok)",
  "QT5MN": "SoundOn (TikTok)",
  "QT5MO": "SoundOn (TikTok)",
  "QT5MP": "SoundOn (TikTok)",
  "QT5MQ": "SoundOn (TikTok)",
  "QT5MR": "SoundOn (TikTok)",
  "QT5MS": "SoundOn (TikTok)",
  "QT5MT": "SoundOn (TikTok)",
  "QT5MU": "SoundOn (TikTok)",
  "QT5MV": "SoundOn (TikTok)",
  "QT5MW": "SoundOn (TikTok)",
  "QT5MX": "SoundOn (TikTok)",
  "QT5MY": "SoundOn (TikTok)",
  "QT5MZ": "SoundOn (TikTok)",
  "QT82A": "SoundOn (TikTok)",
  "QT82B": "SoundOn (TikTok)",
  "QT82C": "SoundOn (TikTok)",
  "QT82D": "SoundOn (TikTok)",
  "QT82E": "SoundOn (TikTok)",
  "QT82F": "SoundOn (TikTok)",
  "QT82G": "SoundOn (TikTok)",
  "QT82H": "SoundOn (TikTok)",
  "QT82I": "SoundOn (TikTok)",
  "QT82J": "SoundOn (TikTok)",
  "QT82K": "SoundOn (TikTok)",
  "QT82L": "SoundOn (TikTok)",
  "QT82M": "SoundOn (TikTok)",
  "QT82N": "SoundOn (TikTok)",
  "QT82O": "SoundOn (TikTok)",
  "QT82P": "SoundOn (TikTok)",
  "QT82Q": "SoundOn (TikTok)",
  "QT82R": "SoundOn (TikTok)",
  "QT82S": "SoundOn (TikTok)",
  "QT82T": "SoundOn (TikTok)",
  "QT82U": "SoundOn (TikTok)",
  "QT82W": "SoundOn (TikTok)",
  "QT82X": "SoundOn (TikTok)",
  "QT82Y": "SoundOn (TikTok)",
  "QT82Z": "SoundOn (TikTok)",
  "QT8BA": "SoundOn (TikTok)",
  "QT8BB": "SoundOn (TikTok)",
  "QT8BC": "SoundOn (TikTok)",
  "QT8BD": "SoundOn (TikTok)",
  "QT8BE": "SoundOn (TikTok)",
  "QT8BF": "SoundOn (TikTok)",
  "QT8BG": "SoundOn (TikTok)",
  "QT8BH": "SoundOn (TikTok)",
  "QT8BI": "SoundOn (TikTok)",
  "QT8BJ": "SoundOn (TikTok)",
  "QT8BK": "SoundOn (TikTok)",
  "QT8BL": "SoundOn (TikTok)",
  "QT8BM": "SoundOn (TikTok)",
  "QT8BN": "SoundOn (TikTok)",
  "QT8BO": "SoundOn (TikTok)",
  "QT8BP": "SoundOn (TikTok)",
  "QT8BQ": "SoundOn (TikTok)",
  "QT8BR": "SoundOn (TikTok)",
  "QT8BS": "SoundOn (TikTok)",
  "QT8BU": "SoundOn (TikTok)",
  "QT8BV": "SoundOn (TikTok)",
  "QT8BW": "SoundOn (TikTok)",
  "QT8BX": "SoundOn (TikTok)",
  "QT8BY": "SoundOn (TikTok)",
  "QT8BZ": "SoundOn (TikTok)",

  // ── Horus Music ────────────────────────────────────────────────────────────
  "GBHOR": "Horus Music",
  "GBHM1": "Horus Music",

  // ── Symphonic Distribution ─────────────────────────────────────────────────
  "USSYM": "Symphonic Distribution",
  "QZSYM": "Symphonic Distribution",

  // ── Empire Distribution ────────────────────────────────────────────────────
  "USEMP": "Empire Distribution",
  "QZEMP": "Empire Distribution",

  // ── Vydia ──────────────────────────────────────────────────────────────────
  "USVYD": "Vydia",

  // ── Repost by SoundCloud ───────────────────────────────────────────────────
  "QZREP": "Repost by SoundCloud",
  "USREP": "Repost by SoundCloud",

  // ── Distro.fm / Fresh Tunes ────────────────────────────────────────────────
  "QZFRS": "Fresh Tunes",

  // ── Octiive ────────────────────────────────────────────────────────────────
  "QZOCT": "Octiive",

  // ── Indiefy ────────────────────────────────────────────────────────────────
  "QZIND": "Indiefy",

  // ── Record Union ───────────────────────────────────────────────────────────
  "SERUN": "Record Union",
  "SERU1": "Record Union",

  // ── Landr ──────────────────────────────────────────────────────────────────
  "CALDN": "Landr",
  "QZLDN": "Landr",

  // ── Musicinfo ──────────────────────────────────────────────────────────────
  "FIMIN": "Musicinfo",

  // ── Orchard (Sony) ─────────────────────────────────────────────────────────
  "USOR1": "The Orchard (Sony)",
  "GBORG": "The Orchard (Sony)",

  // ── Major Labels ───────────────────────────────────────────────────────────
  // Universal Music Group
  "USUG1": "Universal Music Group",
  "GBUM1": "Universal Music Group",
  "DEUM1": "Universal Music Group",
  "FRUM1": "Universal Music Group",
  "NLUM1": "Universal Music Group",
  // Sony Music
  "USSM1": "Sony Music",
  "GBSM1": "Sony Music",
  "DESM1": "Sony Music",
  "USSM2": "Sony Music",
  // Warner Music Group
  "USAT1": "Warner Music Group",
  "GBAT1": "Warner Music Group",
  "USWB1": "Warner Music Group",
  "GBWB1": "Warner Music Group",
  "DEWB1": "Warner Music Group",
  "GBBBN": "Warner Music Group",
};

// ---------------------------------------------------------------------------
// UPC PREFIXES  (match longest first)
// ---------------------------------------------------------------------------
const UPC_PREFIXES = {

  // ── DistroKid ──────────────────────────────────────────────────────────────
  // DistroKid uses 198xxxxxxxx UPCs (assigned block)
  "1980": "DistroKid",
  "1981": "DistroKid",
  "1982": "DistroKid",
  "1983": "DistroKid",
  "1984": "DistroKid",
  "1985": "DistroKid",
  "1986": "DistroKid",
  "1987": "DistroKid",
  "1988": "DistroKid",
  "1989": "DistroKid",

  // ── TuneCore ───────────────────────────────────────────────────────────────
  "1930": "TuneCore",
  "1931": "TuneCore",
  "1932": "TuneCore",
  "1933": "TuneCore",
  "1934": "TuneCore",
  "1935": "TuneCore",
  "1936": "TuneCore",
  "1937": "TuneCore",
  "1938": "TuneCore",
  "1939": "TuneCore",

  // ── CD Baby ────────────────────────────────────────────────────────────────
  "8880": "CD Baby",
  "8881": "CD Baby",
  "8882": "CD Baby",
  "8883": "CD Baby",
  "8884": "CD Baby",
  "8885": "CD Baby",
  "8886": "CD Baby",
  "8887": "CD Baby",
  "8888": "CD Baby",
  "8889": "CD Baby",
  "7065": "CD Baby",
  "7066": "CD Baby",

  // ── Believe Distribution ───────────────────────────────────────────────────
  // Believe's main UPC block: 3618xxxxxxx (French GS1 prefix)
  "3618": "Believe Distribution",
  "36180": "Believe Distribution",
  "36181": "Believe Distribution",
  "36182": "Believe Distribution",
  "36183": "Believe Distribution",
  "36184": "Believe Distribution",
  "36185": "Believe Distribution",
  "36186": "Believe Distribution",
  "36187": "Believe Distribution",
  "36188": "Believe Distribution",
  "36189": "Believe Distribution",
  // Additional Believe UPC blocks
  "3700551": "Believe Distribution",
  "3700187": "Believe Distribution",
  "5021732": "Believe Distribution",

  // ── ONErpm ─────────────────────────────────────────────────────────────────
  "7045": "ONErpm",
  "70450": "ONErpm",
  "70451": "ONErpm",
  "70452": "ONErpm",
  "70453": "ONErpm",
  "70454": "ONErpm",
  "70455": "ONErpm",
  "70456": "ONErpm",
  "70457": "ONErpm",
  "70458": "ONErpm",
  "70459": "ONErpm",

  // ── UnitedMasters ──────────────────────────────────────────────────────────
  "1960": "UnitedMasters",
  "1961": "UnitedMasters",
  "1962": "UnitedMasters",
  "1963": "UnitedMasters",
  "1964": "UnitedMasters",
  "1965": "UnitedMasters",
  "1966": "UnitedMasters",
  "1967": "UnitedMasters",
  "1968": "UnitedMasters",
  "1969": "UnitedMasters",

  // ── AWAL ───────────────────────────────────────────────────────────────────
  "5054": "AWAL",
  "50540": "AWAL",
  "50541": "AWAL",
  "50542": "AWAL",

  // ── Ditto Music ────────────────────────────────────────────────────────────
  "5055": "Ditto Music",
  "5060": "Ditto Music",
  "50550": "Ditto Music",
  "50551": "Ditto Music",

  // ── RouteNote ──────────────────────────────────────────────────────────────
  "5065": "RouteNote",
  "50650": "RouteNote",
  "50651": "RouteNote",

  // ── Caster / Audiosalad ────────────────────────────────────────────────────
  // 7333 confirmed from real data (SE GS1 prefix)
  "7333": "Caster (Audiosalad)",
  "73334": "Caster (Audiosalad)",
  "73335": "Caster (Audiosalad)",
  "73336": "Caster (Audiosalad)",
  "73337": "Caster (Audiosalad)",
  "73338": "Caster (Audiosalad)",
  "73339": "Caster (Audiosalad)",

  // ── Horus Music ────────────────────────────────────────────────────────────
  "5056": "Horus Music",
  "50560": "Horus Music",

  // ── Symphonic Distribution ─────────────────────────────────────────────────
  "19640": "Symphonic Distribution",
  "19641": "Symphonic Distribution",
  "19642": "Symphonic Distribution",

  // ── Major Labels ───────────────────────────────────────────────────────────
  // Universal Music Group
  "00602": "Universal Music Group",
  "00028": "Universal Music Group",
  "00044": "Universal Music Group",
  "00050": "Universal Music Group",
  "00060": "Universal Music Group",
  "00073": "Universal Music Group",
  "00600": "Universal Music Group",
  "00602": "Universal Music Group",
  "190": "Universal Music Group",
  "1900": "Universal Music Group",
  "1901": "Universal Music Group",
  "1902": "Universal Music Group",
  "1903": "Universal Music Group",
  "602": "Universal Music Group",
  // Sony Music
  "886": "Sony Music",
  "8860": "Sony Music",
  "8861": "Sony Music",
  "8862": "Sony Music",
  "8863": "Sony Music",
  "8864": "Sony Music",
  "8865": "Sony Music",
  "8866": "Sony Music",
  "8867": "Sony Music",
  "8868": "Sony Music",
  "8869": "Sony Music",
  "887": "Sony Music",
  "8870": "Sony Music",
  "8871": "Sony Music",
  "8872": "Sony Music",
  "8873": "Sony Music",
  "8874": "Sony Music",
  "8875": "Sony Music",
  "8876": "Sony Music",
  "8877": "Sony Music",
  "8878": "Sony Music",
  "8879": "Sony Music",
  "509": "Sony Music",
  "5099": "Sony Music",
  // Warner Music Group
  "075": "Warner Music Group",
  "0750": "Warner Music Group",
  "0751": "Warner Music Group",
  "0752": "Warner Music Group",
  "0753": "Warner Music Group",
  "0754": "Warner Music Group",
  "0755": "Warner Music Group",
  "0756": "Warner Music Group",
  "0757": "Warner Music Group",
  "0758": "Warner Music Group",
  "0759": "Warner Music Group",
  "093": "Warner Music Group",
  "0930": "Warner Music Group",
  "0931": "Warner Music Group",
  "0932": "Warner Music Group",
  "0933": "Warner Music Group",
  "0934": "Warner Music Group",
  "0935": "Warner Music Group",
  "0936": "Warner Music Group",
  "0937": "Warner Music Group",
  "0938": "Warner Music Group",
  "0939": "Warner Music Group",
};

// ---------------------------------------------------------------------------
// LABEL NAME KEYWORDS
// ---------------------------------------------------------------------------
const LABEL_KEYWORDS = [
  { keywords: ["distrokid", "dk music"], distributor: "DistroKid" },
  { keywords: ["tunecore", "tune core"], distributor: "TuneCore" },
  { keywords: ["cd baby", "cdbaby"], distributor: "CD Baby" },
  { keywords: ["amuse"], distributor: "Amuse" },
  { keywords: ["unitedmasters", "united masters"], distributor: "UnitedMasters" },
  { keywords: ["believe distribution", "believe digital", "believe music", "believe"], distributor: "Believe Distribution" },
  { keywords: ["onerpm", "one rpm"], distributor: "ONErpm" },
  { keywords: ["awal"], distributor: "AWAL" },
  { keywords: ["stem dist", "stem."], distributor: "Stem" },
  { keywords: ["ditto music", "ditto"], distributor: "Ditto Music" },
  { keywords: ["routenote", "route note"], distributor: "RouteNote" },
  { keywords: ["spinnup"], distributor: "Spinnup" },
  { keywords: ["kontor"], distributor: "Kontor New Media" },
  { keywords: ["igroove", "i-groove"], distributor: "iGroove" },
  { keywords: ["symphonic"], distributor: "Symphonic Distribution" },
  { keywords: ["empire distribution", "empire dist"], distributor: "Empire Distribution" },
  { keywords: ["repost", "soundcloud"], distributor: "Repost by SoundCloud" },
  { keywords: ["orchard"], distributor: "The Orchard (Sony)" },
  { keywords: ["landr"], distributor: "Landr" },
  { keywords: ["record union"], distributor: "Record Union" },
  { keywords: ["horus music", "horus"], distributor: "Horus Music" },
  { keywords: ["caster", "audiosalad"], distributor: "Caster (Audiosalad)" },
  { keywords: ["soundon", "sound on", "tiktok music"], distributor: "SoundOn (TikTok)" },  { keywords: ["feiyr"], distributor: "Feiyr" },
  { keywords: ["soundrop"], distributor: "Soundrop" },
  { keywords: ["musicinfo"], distributor: "Musicinfo" },
  { keywords: ["octiive"], distributor: "Octiive" },
  { keywords: ["indiefy"], distributor: "Indiefy" },
  { keywords: ["universal music", "umg", "interscope", "republic records", "def jam", "island records", "polydor", "virgin music", "capitol records", "geffen", "motown"], distributor: "Universal Music Group" },
  { keywords: ["sony music", "columbia records", "rca records", "epic records", "arista", "the orchard"], distributor: "Sony Music" },
  { keywords: ["warner music", "atlantic records", "elektra", "asylum", "nonesuch", "rhino", "parlophone", "wea"], distributor: "Warner Music Group" },
];

// ---------------------------------------------------------------------------
// DETECTION FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Detect distributor from ISRC code
 * Tries longest prefix match first for specificity
 */
function detectFromISRC(isrc) {
  if (!isrc) return null;
  const normalized = isrc.replace(/-/g, "").toUpperCase();

  // Sort by prefix length descending (longest match wins)
  const sorted = Object.keys(ISRC_PREFIXES).sort((a, b) => b.length - a.length);
  for (const prefix of sorted) {
    if (normalized.startsWith(prefix)) {
      return ISRC_PREFIXES[prefix];
    }
  }
  return null;
}

/**
 * Detect distributor from UPC code
 * Tries longest prefix match first
 */
function detectFromUPC(upc) {
  if (!upc) return null;
  const normalized = upc.toString().trim().replace(/^0+/, ""); // strip leading zeros

  // Also try with leading zeros preserved
  const raw = upc.toString().trim();

  const sorted = Object.keys(UPC_PREFIXES).sort((a, b) => b.length - a.length);
  for (const prefix of sorted) {
    if (normalized.startsWith(prefix) || raw.startsWith(prefix)) {
      return UPC_PREFIXES[prefix];
    }
  }
  return null;
}

/**
 * Detect distributor from label name
 */
function detectFromLabel(label) {
  if (!label) return null;
  const normalized = label.toLowerCase();

  for (const entry of LABEL_KEYWORDS) {
    for (const keyword of entry.keywords) {
      if (normalized.includes(keyword)) {
        return entry.distributor;
      }
    }
  }
  return null;
}

/**
 * Main distributor detection — returns result with confidence + method
 * 
 * Priority:
 * 1. Licensor UUID (spclient — most accurate, 100+ distributors mapped)
 * 2. ISRC prefix
 * 3. UPC prefix
 * 4. Label name keywords
 * 
 * @param {{ isrc: string, upc: string, label: string, licensorUuid?: string }} trackData
 * @returns {{ distributor: string|null, confidence: string, method: string }}
 */
function detectDistributor(trackData) {
  const { isrc, upc, label, licensorUuid } = trackData;

  // Priority 1: Licensor UUID from spclient (most accurate)
  if (licensorUuid) {
    const { detectFromLicensorUUID } = require("./licensors");
    const fromUUID = detectFromLicensorUUID(licensorUuid);
    if (fromUUID) return { distributor: fromUUID, confidence: "High", method: "Licensor UUID" };
  }

  // Priority 2: ISRC prefix
  const fromISRC = detectFromISRC(isrc);
  if (fromISRC) return { distributor: fromISRC, confidence: "High", method: "ISRC" };

  // Priority 3: UPC prefix
  const fromUPC = detectFromUPC(upc);
  if (fromUPC) return { distributor: fromUPC, confidence: "Medium", method: "UPC" };

  // Priority 4: Label name keywords
  const fromLabel = detectFromLabel(label);
  if (fromLabel) return { distributor: fromLabel, confidence: "Low", method: "Label Name" };

  return { distributor: null, confidence: "None", method: "Unknown" };
}

module.exports = { detectDistributor, detectFromISRC, detectFromUPC, detectFromLabel };
