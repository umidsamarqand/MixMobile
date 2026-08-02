import { Language } from '../types';

export const colorDictionary: Record<string, Record<Language, string>> = {
  'Space Black': { uz: 'Koinot qorasi', ru: 'Космический черный', en: 'Space Black' },
  'Natural Titanium': { uz: 'Tabiiy titan', ru: 'Натуральный титан', en: 'Natural Titanium' },
  'Black Titanium': { uz: 'Qora titan', ru: 'Черный титан', en: 'Black Titanium' },
  'White Titanium': { uz: 'Oq titan', ru: 'Белый титан', en: 'White Titanium' },
  'Blue Titanium': { uz: 'Ko\'k titan', ru: 'Синий титан', en: 'Blue Titanium' },
  'Desert Titanium': { uz: 'Sahro titan', ru: 'Пустынный титан', en: 'Desert Titanium' },
  'Titanium Gray': { uz: 'Kulrang titan', ru: 'Титановый серый', en: 'Titanium Gray' },
  'Poco Yellow': { uz: 'Poco sariq', ru: 'Poco желтый', en: 'Poco Yellow' },
  'Deep Purple': { uz: 'To\'q binafsha', ru: 'Темно-фиолетовый', en: 'Deep Purple' },
  'Dark Purple': { uz: 'To\'q binafsha', ru: 'Темно-фиолетовый', en: 'Dark Purple' },
  'Gold': { uz: 'Tilla', ru: 'Золотой', en: 'Gold' },
  'Silver': { uz: 'Kumush', ru: 'Серебристый', en: 'Silver' },
  'Space Gray': { uz: 'Koinot kulrang', ru: 'Космический серый', en: 'Space Gray' },
  'Midnight': { uz: 'Yarim tun', ru: 'Темная ночь', en: 'Midnight' },
  'Starlight': { uz: 'Yulduzli yog\'du', ru: 'Сияющая звезда', en: 'Starlight' },
  'Graphite': { uz: 'Grafit', ru: 'Графитовый', en: 'Graphite' },
  'Sierra Blue': { uz: 'Sierra ko\'k', ru: 'Небесно-голубой', en: 'Sierra Blue' },
  'Alpine Green': { uz: 'Alp yashili', ru: 'Альпийский зеленый', en: 'Alpine Green' },
  'Phantom Black': { uz: 'Phantom qora', ru: 'Черный фантом', en: 'Phantom Black' },
  'Green': { uz: 'Yashil', ru: 'Зеленый', en: 'Green' },
  'Black': { uz: 'Qora', ru: 'Черный', en: 'Black' },
  'White': { uz: 'Oq', ru: 'Белый', en: 'White' },
  'Blue': { uz: 'Ko\'k', ru: 'Синий', en: 'Blue' },
  'Yellow': { uz: 'Sariq', ru: 'Желтый', en: 'Yellow' },
  'Pink': { uz: 'Pushti', ru: 'Розовый', en: 'Pink' },
  'Purple': { uz: 'Binafsha', ru: 'Фиолетовый', en: 'Purple' },
  'Red': { uz: 'Qizil', ru: 'Красный', en: 'Red' },
};

export const translateColor = (colorName: string, lang: Language): string => {
  if (!colorName) return '';
  const match = colorDictionary[colorName];
  if (match && match[lang]) {
    return match[lang];
  }
  return colorName;
};

export const defectDictionary: Record<string, Record<Language, string>> = {
  'None / Clean device': {
    uz: 'Kamchiliksiz / Ideal qurilma',
    ru: 'Без дефектов / Идеальное состояние',
    en: 'None / Clean device',
  },
  'None': {
    uz: 'Kamchiliksiz',
    ru: 'Без дефектов',
    en: 'None',
  },
  'Micro-scratches on display': {
    uz: 'Ekranda mikrozarbalar',
    ru: 'Микроцарапины на экране',
    en: 'Micro-scratches on display',
  },
  'Body corner hairline scuff': {
    uz: 'Korpus burchagida biroz tirnalish',
    ru: 'Микропотертость на углу корпуса',
    en: 'Body corner hairline scuff',
  },
  'Face ID / Touch ID inactive': {
    uz: 'Face ID / Touch ID ishlamaydi',
    ru: 'Face ID / Touch ID не работает',
    en: 'Face ID / Touch ID inactive',
  },
  'Back glass replaced': {
    uz: 'Orqa shisha almashtirilgan',
    ru: 'Заднее стекло заменено',
    en: 'Back glass replaced',
  },
  'Screen replaced (Original)': {
    uz: 'Ekran almashtirilgan (Original)',
    ru: 'Экран заменен (Оригинал)',
    en: 'Screen replaced (Original)',
  },
  'Camera glass mark': {
    uz: 'Kamera shishasida belgi',
    ru: 'Отметка на стекле камеры',
    en: 'Camera glass mark',
  },
};

export const translateDefect = (defect: string, lang: Language): string => {
  if (!defect) return '';
  const match = defectDictionary[defect];
  if (match && match[lang]) {
    return match[lang];
  }
  return defect;
};

export const accessoryDictionary: Record<string, Record<Language, string>> = {
  'Original Box': {
    uz: 'Original quti',
    ru: 'Оригинальная коробка',
    en: 'Original Box',
  },
  'Original Fast Charger': {
    uz: 'Original tezkor quvvatlagich',
    ru: 'Оригинальная быстрая зарядка',
    en: 'Original Fast Charger',
  },
  'Original Cable': {
    uz: 'Original kabel',
    ru: 'Оригинальный кабель',
    en: 'Original Cable',
  },
  'Protective Case': {
    uz: 'Himoya g\'ilofi',
    ru: 'Защитный чехол',
    en: 'Protective Case',
  },
  'Glass Protector Applied': {
    uz: 'Himoya shishasi yopishtirilgan',
    ru: 'Защитное стекло наклеено',
    en: 'Glass Protector Applied',
  },
};

export const translateAccessory = (item: string, lang: Language): string => {
  if (!item) return '';
  const match = accessoryDictionary[item];
  if (match && match[lang]) {
    return match[lang];
  }
  return item;
};
