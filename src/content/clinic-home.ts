import { clinic, DEMO_MODE } from '@/config/clinic';
import { clinicCopy } from './clinic-polish';
import { clinicFinal } from './clinic-final';
import { parseLocale, type Locale } from '@/config/site';
import type { MediaSource } from '@/components/ui/Media.astro';
import type { FAQItem } from '@/components/blocks/FAQ.astro';
import type { NavigationItem } from '@/components/ui/navigation';
import type {
  BusinessLocation,
  BusinessSchedule,
  Credential,
  PaymentOption,
  Price,
  PromotionInfo,
  ReviewSource,
} from './business';
import { resolveBusinessAction } from '@/lib/business/actions';
import { formatPrice, type PriceLabels } from '@/lib/business/formatting';
import { getBusinessInfo } from './static';
import { t } from '@/i18n/translations';
import { requiredText, normalizeMedia } from './normalize';
import family from '@/assets/clinic/family-consultation.png';
import reception from '@/assets/clinic/reception.png';
import woman from '@/assets/clinic/specialist-woman.png';
import man from '@/assets/clinic/specialist-man.png';

export interface SpecialistPreview {
  id: string;
  name: string;
  role: string;
  note: string;
  media: MediaSource;
}
/** Publish only with verified provenance and permission to reuse the text. */
export interface SelectedClinicReview {
  verified: true;
  author: string;
  text: string;
  source: string;
  originalUrl: string;
  rating?: number;
}
export type ClinicIconName =
  | 'care'
  | 'hygiene'
  | 'child'
  | 'implants'
  | 'crowns'
  | 'orthodontics'
  | 'extraction'
  | 'consultation'
  | 'chat'
  | 'phone'
  | 'pin'
  | 'check'
  | 'arrow'
  | 'clock'
  | 'license'
  | 'payment'
  | 'whatsapp';
interface Treatment {
  id: ClinicIconName;
  title: string;
  description: string;
  price: Price;
  action: string;
}
interface ClinicHomeSource {
  /** Optional additional authored offers already using the shared display contract. */
  promotions?: readonly PromotionInfo[];
  demo: string;
  skip: string;
  descriptor: string;
  city: string;
  imageLabel: string;
  navigation: readonly NavigationItem[];
  booking: string;
  pricesAction: string;
  hero: {
    title: string;
    description: string;
  };
  urgent: string;
  discoveryTitle: string;
  prices: {
    title: string;
    description: string;
    note: string;
  };
  treatments: readonly Treatment[];
  about: {
    title: string;
    description: string;
    points: readonly string[];
    action: string;
  };
  team: {
    title: string;
    description: string;
    action: string;
    items: readonly SpecialistPreview[];
  };
  trust: {
    credentials?: readonly Credential[];
    review?: ReviewSource;
    selectedReviews?: readonly SelectedClinicReview[];
    linkLabel: string;
    title: string;
    description: string;
    platform: string;
  };
  process: {
    title: string;
    items: readonly { title: string; description: string }[];
  };
  promotion: {
    title: string;
    description: string;
    terms: string;
    action: string;
    price: Price;
  };
  payment: {
    linkLabel: string;
    title: string;
    description: string;
    points: readonly string[];
    options: readonly PaymentOption[];
  };
  faq: { title: string; items: readonly FAQItem[] };
  contact: {
    title: string;
    description: string;
    messenger: string;
    phone: string;
    messengerTitle: string;
    phoneTitle: string;
    locationTitle: string;
    mapLabel: string;
    locationNote: string;
    hoursTitle: string;
    schedule: BusinessSchedule;
    location?: BusinessLocation;
  };
  footer: { description: string; copyright: string; note: string };
  media: { hero: string; about: string };
}

const media = (src: typeof family, alt: string): MediaSource =>
  normalizeMedia(
    { src, alt, width: src.width, height: src.height },
    'clinic media',
  );
const content: Record<Locale, ClinicHomeSource> = {
  ru: {
    demo: 'Демо семейной клиники',
    skip: 'Перейти к содержанию',
    descriptor: 'Семейная стоматология',
    city: 'Алматы, Казахстан',
    imageLabel: 'ИИ-изображение вымышленной клиники',
    navigation: [
      { label: 'Услуги и цены', href: '#prices' },
      { label: 'Специалисты', href: '#team' },
      { label: 'О клинике', href: '#clinic' },
      { label: 'Отзывы', href: '#reviews' },
      { label: 'Акции', href: '#promotions' },
      { label: 'Контакты', href: '#contact' },
    ],
    booking: 'Способы связи',
    pricesAction: 'Услуги и цены',
    hero: {
      title: 'Стоматология для всей семьи',
      description:
        'Лечение, профилактика и восстановление зубов для взрослых и детей. Понятный план и ориентиры по стоимости.',
    },
    urgent: 'Болит зуб? Посмотреть способы связи',
    discoveryTitle: 'Что вас интересует?',
    prices: {
      title: 'Услуги и понятный ориентир по стоимости',
      description:
        'Все суммы ниже иллюстративные. Это примеры оформления, а не действующий прайс клиники.',
      note: 'В реальной клинике итоговая стоимость зависит от осмотра, плана, материалов и объёма лечения. Уточняйте, что входит в смету, до начала работы.',
    },
    treatments: [
      {
        id: 'hygiene',
        title: 'Профессиональная гигиена',
        description: 'Профилактика и рекомендации по домашнему уходу.',
        price: clinic.prices.hygiene,
        action: 'Уточнить стоимость гигиены',
      },
      {
        id: 'child',
        title: 'Детская стоматология',
        description:
          'Знакомство с врачом, осмотр и обсуждение ухода с родителями.',
        price: clinic.prices.child,
        action: 'Спросить о детском приёме',
      },
      {
        id: 'care',
        title: 'Лечение зубов',
        description: 'Осмотр и индивидуальный план лечения.',
        price: clinic.prices.care,
        action: 'Спросить о лечении',
      },
      {
        id: 'crowns',
        title: 'Коронки и протезирование',
        description: 'Восстановление формы и функции зубов.',
        price: clinic.prices.crowns,
        action: 'Уточнить варианты протезирования',
      },
      {
        id: 'implants',
        title: 'Имплантация',
        description: 'Обсуждение возможных вариантов восстановления зубов.',
        price: clinic.prices.implants,
        action: 'Спросить об имплантации',
      },
      {
        id: 'orthodontics',
        title: 'Ортодонтия',
        description: 'Консультация по вопросам прикуса.',
        price: clinic.prices.orthodontics,
        action: 'Спросить об ортодонтии',
      },
      {
        id: 'extraction',
        title: 'Удаление зубов',
        description: 'Тактика определяется врачом после осмотра.',
        price: clinic.prices.extraction,
        action: 'Спросить об удалении',
      },
      {
        id: 'consultation',
        title: 'Первичная консультация',
        description: 'Вопросы, осмотр и обсуждение следующих шагов.',
        price: clinic.prices.consultation,
        action: 'Узнать о консультации',
      },
    ],
    about: {
      title: 'Понятно на каждом этапе',
      description:
        'SAYA QAM — концепция семейной клиники, где удобно начать с простого вопроса. В основе — спокойное общение, объяснение вариантов и план, который можно обсудить до лечения.',
      points: [
        'Время на вопросы и объяснения',
        'Обсуждение этапов и сметы заранее',
        'Возможность договориться о паузе',
      ],
      action: 'Как мы работаем',
    },
    team: {
      title: 'Познакомьтесь со специалистами',
      description: 'Имена и портреты специалистов вымышлены.',
      action: 'Этапы первого визита',
      items: [
        {
          id: 'aida',
          name: 'Аида Сейтова',
          role: 'Врач-стоматолог',
          note: 'Осмотр, профилактика и лечение зубов.',
          media: media(
            woman,
            'Сгенерированный портрет вымышленного специалиста Аиды',
          ),
        },
        {
          id: 'daniel',
          name: 'Данияр Омаров',
          role: 'Стоматолог-ортопед',
          note: 'Восстановление зубов и протезирование.',
          media: media(
            man,
            'Сгенерированный портрет вымышленного специалиста Данияра',
          ),
        },
      ],
    },
    trust: {
      linkLabel: '2ГИС и лицензия',
      title: 'Доверие начинается с проверяемой информации',
      description:
        'Перед записью в реальную клинику стоит проверить сведения о врачах, лицензии и отзывы в независимом источнике. У вымышленной SAYA QAM нет подтверждённых лицензий, рейтинга или карточки в 2ГИС. Мы их не публикуем.',
      platform: '2ГИС: сайт платформы, не карточка клиники',
    },
    process: {
      title: 'Первый визит без лишней неопределённости',
      items: [
        {
          title: 'Расскажите о вопросе',
          description:
            'В реальной клинике администратор уточнит повод обращения и предложит время. В демо заявки не принимаются.',
        },
        {
          title: 'Познакомьтесь с врачом',
          description:
            'На консультации можно обсудить, что беспокоит, и задать вопросы. Объём осмотра определяет врач.',
        },
        {
          title: 'Обсудите план и стоимость',
          description:
            'Уточните варианты, этапы и состав сметы. Решение о лечении принимается после обсуждения.',
        },
      ],
    },
    promotion: {
      title: 'Семейный день профилактики',
      description:
        'Пример предложения: знакомство с врачом и профессиональная гигиена для взрослого.',
      terms:
        'Иллюстративный пакет, не действующая акция. Условия и сумма вымышлены; воспользоваться предложением нельзя.',
      action: 'Сравнить с ценой гигиены',
      price: {
        kind: 'exact',
        amount: clinic.promo.amount,
        currency: clinic.promo.currency,
      },
    },
    payment: {
      linkLabel: 'О рассрочке',
      title: 'Оплата без неожиданных условий',
      description:
        'В настоящей клинике способы оплаты и условия рассрочки должны быть подтверждены. В этом проекте они не настроены.',
      points: [
        'Уточните полную сумму и состав сметы',
        'Попросите условия поэтапной оплаты, если она предусмотрена',
      ],
      options: [],
    },
    faq: {
      title: 'Вопросы перед записью',
      items: [
        {
          id: 'cost',
          question: 'Почему указана цена «от»?',
          answer:
            'Это нижний ориентир для примера оформления. Реальная стоимость зависит от ситуации и состава лечения. Перед началом работы уточняйте итоговую сумму и включённые услуги.',
        },
        {
          id: 'first',
          question: 'Зачем нужна первичная консультация?',
          answer:
            'Она помогает обсудить жалобы и возможные следующие шаги. Необходимость обследований и лечения определяет врач после осмотра.',
        },
        {
          id: 'payment',
          question: 'Есть ли рассрочка или оплата через Kaspi?',
          answer:
            'Условия оплаты и партнёрства в этом демонстрационном проекте не подтверждены. Не считайте сайт предложением рассрочки или финансовой услуги.',
        },
        {
          id: 'booking',
          question: 'Как записаться или написать в мессенджер?',
          answer:
            'У вымышленной клиники нет рабочего телефона или аккаунта мессенджера. Данные не собираются и не отправляются.',
        },
      ],
    },
    contact: {
      title: 'Выберите удобный способ связи',
      description: 'В этом демо звонки и сообщения недоступны.',
      messenger: 'WhatsApp · демо',
      phone: 'Звонок · демо',
      messengerTitle: 'Сообщение в мессенджер',
      phoneTitle: 'Прямой звонок',
      mapLabel: '2ГИС · пример карты',
      locationTitle: 'Где нас найти',
      locationNote:
        'Алматы выбран как условный город проекта. Улица, номер дома и маршрут не заданы. Карта появится только после проверки адреса настоящей клиники.',
      hoursTitle: 'График · пример',
      schedule: {
        timezone: 'Asia/Almaty',
        timezoneLabel: 'Алматы · местное время (пример)',
        closedLabel: 'Выходной',
        rows: [
          {
            label: 'Понедельник–пятница',
            intervals: [{ start: clinic.hours[1][0], end: clinic.hours[1][1] }],
          },
          {
            label: 'Суббота',
            intervals: [{ start: clinic.hours[6][0], end: clinic.hours[6][1] }],
          },
          { label: 'Воскресенье', intervals: [] },
        ],
      },
    },
    footer: {
      description:
        'SAYA QAM — вымышленная семейная стоматология в Казахстане. Пример того, как клиника может рассказывать об услугах и помогать подготовиться к визиту.',
      copyright: '© 2026 SAYA QAM · демонстрационный проект',
      note: 'Медицинские услуги не оказываются. Цены, предложение, график, специалисты и все изображения — иллюстративные примеры. Записи и отправки данных нет.',
    },
    media: {
      hero: 'Сгенерированная сцена знакомства вымышленного стоматолога с матерью и ребёнком',
      about: 'ИИ-визуализация светлой приёмной вымышленной клиники',
    },
  },
  kk: {
    demo: 'Отбасылық клиника үлгісі',
    skip: 'Негізгі мазмұнға өту',
    descriptor: 'Отбасылық стоматология',
    city: 'Алматы, Қазақстан',
    imageLabel: 'Ойдан шығарылған клиниканың ЖИ кескіні',
    navigation: [
      { label: 'Қызметтер мен бағалар', href: '#prices' },
      { label: 'Мамандар', href: '#team' },
      { label: 'Клиника туралы', href: '#clinic' },
      { label: 'Пікірлер', href: '#reviews' },
      { label: 'Акциялар', href: '#promotions' },
      { label: 'Байланыс', href: '#contact' },
    ],
    booking: 'Байланысу',
    pricesAction: 'Қызметтер мен бағалар',
    hero: {
      title: 'Бүкіл отбасыға арналған стоматология',
      description:
        'Ересектер мен балаларға емдеу, алдын алу және тістерді қалпына келтіру. Қызметтер мен құн туралы түсінікті ақпарат.',
    },
    urgent: 'Тісіңіз ауыра ма? Байланыс тәсілдерін қарау',
    discoveryTitle: 'Сізді не қызықтырады?',
    prices: {
      title: 'Қызметтер және құн бағдары',
      description:
        'Төмендегі барлық сома үлгі ретінде берілген. Бұл клиниканың нақты прейскуранты емес, безендіру мысалдары.',
      note: 'Нақты клиникада соңғы баға тексеруге, жоспарға, материалдарға және ем көлеміне байланысты. Жұмыс басталғанға дейін сметаға не кіретінін анықтаңыз.',
    },
    treatments: [
      {
        id: 'hygiene',
        title: 'Кәсіби гигиена',
        description: 'Алдын алу және үйдегі күтім бойынша кеңестер.',
        price: clinic.prices.hygiene,
        action: 'Гигиена құнын нақтылау',
      },
      {
        id: 'child',
        title: 'Балалар стоматологиясы',
        description:
          'Дәрігермен танысу, тексеру және ата-анамен күтімді талқылау.',
        price: clinic.prices.child,
        action: 'Баланы қабылдау туралы сұрау',
      },
      {
        id: 'care',
        title: 'Тісті емдеу',
        description: 'Тексеру және жеке ем жоспары.',
        price: clinic.prices.care,
        action: 'Емдеу туралы сұрау',
      },
      {
        id: 'crowns',
        title: 'Сауыттар және протездеу',
        description: 'Тістің пішіні мен қызметін қалпына келтіру.',
        price: clinic.prices.crowns,
        action: 'Протездеу нұсқаларын нақтылау',
      },
      {
        id: 'implants',
        title: 'Имплантация',
        description: 'Тістерді қалпына келтірудің ықтимал нұсқаларын талқылау.',
        price: clinic.prices.implants,
        action: 'Имплантация туралы сұрау',
      },
      {
        id: 'orthodontics',
        title: 'Ортодонтия',
        description: 'Тістем мәселелері бойынша кеңес алу.',
        price: clinic.prices.orthodontics,
        action: 'Ортодонтия туралы сұрау',
      },
      {
        id: 'extraction',
        title: 'Тісті жұлу',
        description: 'Тәсілді дәрігер тексеруден кейін анықтайды.',
        price: clinic.prices.extraction,
        action: 'Тісті жұлу туралы сұрау',
      },
      {
        id: 'consultation',
        title: 'Алғашқы кеңес',
        description: 'Сұрақтар, тексеру және келесі қадамдарды талқылау.',
        price: clinic.prices.consultation,
        action: 'Кеңес туралы білу',
      },
    ],
    about: {
      title: 'Әр кезеңі түсінікті',
      description:
        'SAYA QAM — қарапайым сұрақтан бастауға ыңғайлы отбасылық клиника тұжырымдамасы. Негізі — сабырлы әңгіме, нұсқаларды түсіндіру және емге дейін талқылауға болатын жоспар.',
      points: [
        'Сұрақтар мен түсіндіруге уақыт',
        'Кезеңдер мен сметаны алдын ала талқылау',
        'Үзіліс туралы келісу мүмкіндігі',
      ],
      action: 'Біз қалай жұмыс істейміз',
    },
    team: {
      title: 'Мамандармен танысыңыз',
      description: 'Мамандардың есімдері мен портреттері ойдан шығарылған.',
      action: 'Алғашқы қабылдау кезеңдері',
      items: [
        {
          id: 'aida',
          name: 'Аида Сейтова',
          role: 'Стоматолог дәрігер',
          note: 'Тексеру, алдын алу және тісті емдеу.',
          media: media(
            woman,
            'Ойдан шығарылған Аиданың ЖИ арқылы жасалған портреті',
          ),
        },
        {
          id: 'daniel',
          name: 'Данияр Омаров',
          role: 'Ортопед-стоматолог',
          note: 'Тістерді қалпына келтіру және протездеу.',
          media: media(
            man,
            'Ойдан шығарылған Даниярдың ЖИ арқылы жасалған портреті',
          ),
        },
      ],
    },
    trust: {
      linkLabel: '2ГИС және лицензия',
      title: 'Сенім тексерілетін ақпараттан басталады',
      description:
        'Нақты клиникаға жазылмас бұрын дәрігерлер, лицензия және тәуелсіз дереккөздегі пікірлер туралы мәліметті тексерген жөн. Ойдан шығарылған SAYA QAM клиникасының расталған лицензиясы, рейтингі немесе 2ГИС карточкасы жоқ. Біз оларды жарияламаймыз.',
      platform: '2ГИС: клиника карточкасы емес, платформаның сайты',
    },
    process: {
      title: 'Алғашқы қабылдауды алдын ала түсініңіз',
      items: [
        {
          title: 'Сұрағыңызды айтыңыз',
          description:
            'Нақты клиникада әкімші келу себебін анықтап, уақыт ұсынады. Бұл үлгіде өтінім қабылданбайды.',
        },
        {
          title: 'Дәрігермен танысыңыз',
          description:
            'Кеңес кезінде мазалаған мәселені талқылап, сұрақ қоюға болады. Тексеру көлемін дәрігер анықтайды.',
        },
        {
          title: 'Жоспар мен құнын талқылаңыз',
          description:
            'Нұсқаларды, кезеңдер мен смета құрамын нақтылаңыз. Емдеу туралы шешім талқылаудан кейін қабылданады.',
        },
      ],
    },
    promotion: {
      title: 'Отбасылық алдын алу күні',
      description:
        'Ұсыныс үлгісі: дәрігермен танысу және ересек адамға кәсіби гигиена.',
      terms:
        'Үлгі пакет, нақты акция емес. Шарттар мен сома ойдан шығарылған; ұсынысты пайдалану мүмкін емес.',
      action: 'Гигиена бағасымен салыстыру',
      price: {
        kind: 'exact',
        amount: clinic.promo.amount,
        currency: clinic.promo.currency,
      },
    },
    payment: {
      linkLabel: 'Бөліп төлеу туралы',
      title: 'Күтпеген шарттарсыз төлем',
      description:
        'Нақты клиникада төлем тәсілдері мен бөліп төлеу шарттары расталуы тиіс. Бұл жобада олар бапталмаған.',
      points: [
        'Толық сома мен смета құрамын нақтылаңыз',
        'Кезең-кезеңімен төлеу қарастырылса, шарттарын сұраңыз',
      ],
      options: [],
    },
    faq: {
      title: 'Жазылар алдындағы сұрақтар',
      items: [
        {
          id: 'cost',
          question: 'Неліктен баға «бастап» деп көрсетілген?',
          answer:
            'Бұл — безендіру үлгісіндегі төменгі бағдар. Нақты құн жағдайға және ем құрамына байланысты. Жұмыс басталғанға дейін соңғы сома мен кіретін қызметтерді нақтылаңыз.',
        },
        {
          id: 'first',
          question: 'Алғашқы кеңес не үшін қажет?',
          answer:
            'Ол шағымдар мен ықтимал келесі қадамдарды талқылауға көмектеседі. Зерттеу мен ем қажеттілігін дәрігер тексеруден кейін анықтайды.',
        },
        {
          id: 'payment',
          question: 'Бөліп төлеу немесе Kaspi арқылы төлеу бар ма?',
          answer:
            'Бұл үлгі жобада төлем шарттары мен серіктестіктер расталмаған. Сайтты бөліп төлеу немесе қаржы қызметінің ұсынысы деп қабылдамаңыз.',
        },
        {
          id: 'booking',
          question: 'Қалай жазылуға немесе мессенджерге хабарласуға болады?',
          answer:
            'Ойдан шығарылған клиниканың жұмыс телефоны немесе мессенджер аккаунты жоқ. Деректер жиналмайды және жіберілмейді.',
        },
      ],
    },
    contact: {
      title: 'Ыңғайлы байланыс тәсілін таңдаңыз',
      description: 'Бұл үлгіде қоңырау шалу және хабарлама жіберу қолжетімсіз.',
      messenger: 'WhatsApp · үлгі',
      phone: 'Телефон · үлгі',
      messengerTitle: 'Мессенджердегі хабарлама',
      phoneTitle: 'Тікелей қоңырау',
      mapLabel: '2ГИС · карта үлгісі',
      locationTitle: 'Бізді қайдан табуға болады',
      locationNote:
        'Алматы жобаның шартты қаласы ретінде таңдалған. Көше, үй нөмірі және бағыт көрсетілмеген. Карта нақты клиниканың мекенжайы тексерілгеннен кейін ғана пайда болады.',
      hoursTitle: 'Кесте · үлгі',
      schedule: {
        timezone: 'Asia/Almaty',
        timezoneLabel: 'Алматы · жергілікті уақыт (үлгі)',
        closedLabel: 'Демалыс',
        rows: [
          {
            label: 'Дүйсенбі–жұма',
            intervals: [{ start: clinic.hours[1][0], end: clinic.hours[1][1] }],
          },
          {
            label: 'Сенбі',
            intervals: [{ start: clinic.hours[6][0], end: clinic.hours[6][1] }],
          },
          { label: 'Жексенбі', intervals: [] },
        ],
      },
    },
    footer: {
      description:
        'SAYA QAM — Қазақстандағы ойдан шығарылған отбасылық стоматология. Клиниканың қызметтерін таныстырып, қабылдауға дайындалуға көмектесетін сайт үлгісі.',
      copyright: '© 2026 SAYA QAM · үлгі жоба',
      note: 'Медициналық қызмет көрсетілмейді. Бағалар, ұсыныс, кесте, мамандар және барлық кескіндер — үлгі. Жазылу және дерек жіберу жоқ.',
    },
    media: {
      hero: 'Ойдан шығарылған стоматологтың ана мен баламен танысуының ЖИ көрінісі',
      about:
        'Ойдан шығарылған клиниканың жарық қабылдау бөлмесінің ЖИ көрінісі',
    },
  },
};

export function getClinicHome(locale: Locale) {
  const c = content[parseLocale(locale)];
  const business = getBusinessInfo(locale);
  const ui = clinicCopy[locale];
  const labels: PriceLabels = {
    from: t(locale, 'price.from'),
    request: t(locale, 'price.request'),
    free: t(locale, 'price.free'),
    range: t(locale, 'price.range'),
  };
  const priceOptions = {
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  } as const;
  const action = (label: string, href: string, primary = false) =>
    resolveBusinessAction(
      href.startsWith('tel:')
        ? { kind: 'phone', label, emphasis: primary ? 'primary' : 'secondary' }
        : {
            kind: href.startsWith('https:') ? 'external' : 'internal',
            label,
            href,
            emphasis: primary ? 'primary' : 'secondary',
          },
      { phone: { number: clinic.number, text: clinic.phone } },
    )!;
  const contactActions = [
    action(
      'WhatsApp',
      DEMO_MODE
        ? '#messenger-demo'
        : resolveBusinessAction(
            {
              kind: 'whatsapp',
              label: 'WhatsApp',
              message: ui.greeting + ' ' + ui.heroBook,
            },
            { messengers: { whatsapp: clinic.number } },
          )!.href,
      true,
    ),
    action(ui.call, DEMO_MODE ? '#phone-demo' : 'tel:' + clinic.number),
  ];
  const liveContacts = contactActions;
  const items = c.treatments.map((item, index) => ({
    ...item,
    name: requiredText(item.title, `treatment/${item.id}/${locale}`),
    price: formatPrice(item.price, locale, labels, priceOptions)!,
    action: action(ui.actions[index], '#contact'),
  }));
  const promotion: PromotionInfo = {
    ...c.promotion,
    price: formatPrice(c.promotion.price, locale, labels, priceOptions),
    action: action(clinicFinal[locale].offerAction, '#offer-terms', true),
    endsAt: clinic.promo.validUntil + 'T23:59:59+05:00',
    terms: c.promotion.terms,
    validityLabel:
      ui.validity +
      ' ' +
      new Intl.DateTimeFormat(locale, {
        dateStyle: 'long',
        timeZone: 'UTC',
      }).format(new Date(clinic.promo.validUntil)),
  };
  const reviewSource: ReviewSource = c.trust.review ?? {
    link: resolveBusinessAction({
      kind: 'external',
      label: c.trust.platform,
      href: 'https://2gis.kz/',
    })!,
  };
  return {
    ...c,
    ui,
    final: clinicFinal[locale],
    locale,
    demo: ui.demo,
    urgent: ui.urgent,
    faq: {
      ...c.faq,
      items: [
        ...c.faq.items,
        {
          id: 'insurance',
          question: ui.insuranceQuestion,
          answer: ui.insuranceAnswer,
        },
      ],
    },
    name: business.name,
    heroMedia: media(family, c.media.hero),
    aboutMedia: media(reception, c.media.about),
    treatments: items,
    promotion,
    promotions: c.promotions ?? [promotion],
    reviewSource,
    selectedReviews: (c.trust.selectedReviews ?? []).flatMap((review) => {
      const original = resolveBusinessAction({
        kind: 'external',
        label: review.source,
        href: review.originalUrl,
      });
      if (
        !review.verified ||
        !original ||
        !review.author.trim() ||
        !review.text.trim()
      )
        return [];
      return [
        {
          ...review,
          original,
          rating:
            review.rating !== undefined &&
            review.rating >= 0 &&
            review.rating <= 5
              ? review.rating
              : undefined,
        },
      ];
    }),
    social: business.details?.social ?? [],
    liveContacts,
    contactActions,
    contactIcons: contactActions.map((resolved) =>
      resolved.href.startsWith('tel:') || resolved.href === '#phone-demo'
        ? ('phone' as const)
        : ('whatsapp' as const),
    ),
    bookingAction: action(ui.book, '#contact', true),
    heroAction: action(ui.heroBook, '#contact', true),
    pricesLink: action(c.pricesAction, '#prices'),
  };
}
export type ClinicHomeContent = ReturnType<typeof getClinicHome>;
