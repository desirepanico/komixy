/** Fascia di volumi: i manga partono da 1–5, i fumetti hanno anche il volume unico. */
export type VolumeBucket = 'single' | 'oneToFive' | 'twoToFive' | 'sixToTwenty' | 'overTwenty';

/** Periodo di uscita; `all` non filtra. */
export type YearEra = 'all' | 'before1990' | 'nineties' | 'noughties' | 'tens' | 'since2020';
