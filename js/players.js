/**
 * players.js — All player data with base price tiers.
 * Base prices in Lakhs: STAR=200, MID=150, STD=100, BUDGET=80
 */

const PlayersData = (() => {

  // ---- Tier definitions (names in lowercase for lookup) ----
  const STAR_PLAYERS = new Set([
    'virat kohli','rohit sharma','ms dhoni','jasprit bumrah',
    'hardik pandya','ben stokes','babar azam','pat cummins',
    'rashid khan','ravindra jadeja','jos buttler','rishabh pant',
    'kl rahul','david warner','steve smith','joe root',
    'kane williamson','suryakumar yadav','yashasvi jaiswal',
    'mitchell starc','kagiso rabada','andre russell',
    'glenn maxwell','shubman gill','travis head',
  ]);

  const MID_PLAYERS = new Set([
    'mohammed shami','kuldeep yadav','yuzvendra chahal',
    'trent boult','shaheen afridi','wanindu hasaranga',
    'sanju samson','quinton de kock','faf du plessis',
    'ishan kishan','ruturaj gaikwad','devdutt padikkal',
    'mitchell marsh','cameron green','sam curran',
    'axar patel','marcus stoinis','moeen ali',
    'shakib al hasan','liam livingstone','josh hazlewood',
    'lockie ferguson','anrich nortje','bhuvneshwar kumar',
    'deepak chahar','arshdeep singh',
  ]);

  // Everyone else gets STD (100L) or BUDGET (80L)
  const BUDGET_PLAYERS = new Set([
    'umran malik','prithvi shaw','manish pandey','ajinkya rahane',
    'mayank agarwal','umesh yadav','ishant sharma','avesh khan',
    'prasidh krishna','t natarajan','reece topley',
    'mustafizur rahman','maheesh theekshana','adam zampa',
    'daniel sams','odean smith','colin de grandhomme',
    'vijay shankar','romario shepherd','azmatullah omarzai',
    'marco jansen',
  ]);

  function getBasePrice(name) {
    const n = name.toLowerCase();
    if (STAR_PLAYERS.has(n)) return 200;    // 2 Cr
    if (MID_PLAYERS.has(n))  return 150;    // 1.5 Cr
    if (BUDGET_PLAYERS.has(n)) return 80;   // 0.8 Cr
    return 100;                              // 1 Cr (standard)
  }

  function getTier(name) {
    const n = name.toLowerCase();
    if (STAR_PLAYERS.has(n)) return 'STAR';
    if (MID_PLAYERS.has(n))  return 'PREMIER';
    if (BUDGET_PLAYERS.has(n)) return 'BUDGET';
    return 'STANDARD';
  }

  // ---- Raw data ----
  const rawBatsmen = [
    'Virat Kohli','Rohit Sharma','Babar Azam','Steve Smith','Joe Root',
    'Kane Williamson','David Warner','Shubman Gill','KL Rahul','Faf du Plessis',
    'Jos Buttler','Travis Head','Ruturaj Gaikwad','Yashasvi Jaiswal','Devdutt Padikkal',
    'Ishan Kishan','Prithvi Shaw','Suryakumar Yadav','Tilak Varma','Nicholas Pooran',
    'Glenn Phillips','Rahmanullah Gurbaz','Harry Brook','Dawid Malan','Jason Roy',
    'Quinton de Kock','Mayank Agarwal','Ajinkya Rahane','Manish Pandey','Shreyas Iyer',
  ];

  const rawBowlers = [
    'Jasprit Bumrah','Mitchell Starc','Pat Cummins','Trent Boult','Kagiso Rabada',
    'Shaheen Afridi','Mohammed Shami','Mohammed Siraj','Josh Hazlewood','Lockie Ferguson',
    'Anrich Nortje','Bhuvneshwar Kumar','Deepak Chahar','Arshdeep Singh','Yuzvendra Chahal',
    'Rashid Khan','Kuldeep Yadav','Adam Zampa','Ravichandran Ashwin','Wanindu Hasaranga',
    'Maheesh Theekshana','Mustafizur Rahman','Reece Topley','T Natarajan','Avesh Khan',
    'Umran Malik','Prasidh Krishna','Shardul Thakur','Umesh Yadav','Ishant Sharma',
  ];

  const rawAllrounders = [
    'Hardik Pandya','Ben Stokes','Ravindra Jadeja','Glenn Maxwell','Andre Russell',
    'Mitchell Marsh','Cameron Green','Sam Curran','Axar Patel','Marcus Stoinis',
    'Moeen Ali','Shakib Al Hasan','Jason Holder','Dwayne Bravo','Washington Sundar',
    'Krunal Pandya','Rahul Tewatia','Shivam Dube','Deepak Hooda','Riyan Parag',
    'Daniel Sams','Odean Smith','Chris Woakes','Colin de Grandhomme','Mitchell Santner',
    'Liam Livingstone','Romario Shepherd','Azmatullah Omarzai','Marco Jansen','Vijay Shankar',
  ];

  const rawWicketkeepers = [
    'MS Dhoni','Rishabh Pant','Sanju Samson','KL Rahul','Jos Buttler',
    'Quinton de Kock','Ishan Kishan','Nicholas Pooran','Rahmanullah Gurbaz','Phil Salt',
  ];

  function buildPlayerList(names, role) {
    return names.map(name => ({
      name,
      role,
      basePrice: getBasePrice(name),
      tier: getTier(name),
      imageSlug: name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
    }));
  }

  // Build full queue in auction order
  function buildQueue() {
    // De-duplicate: KL Rahul & Jos Buttler appear in WK too
    const seen = new Set();
    const dedup = (arr) => arr.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });

    return [
      ...dedup(buildPlayerList(rawBatsmen,       'Batsman')),
      ...dedup(buildPlayerList(rawBowlers,        'Bowler')),
      ...dedup(buildPlayerList(rawAllrounders,    'All-Rounder')),
      ...dedup(buildPlayerList(rawWicketkeepers,  'Wicket-Keeper')),
    ];
  }

  function getImageUrl(player) {
    return `images/players/${player.imageSlug}.jpg`;
  }

  return { buildQueue, getImageUrl, getBasePrice, getTier };
})();
