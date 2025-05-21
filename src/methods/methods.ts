import { type Steps } from "../models/models.ts";

export async function getMethods(): Promise<Steps> {
    return [
        {
            title: 'Co jest najważniejsze dla Twojego dziecka?',
            subtitle: '(WIELOKROTNY WYBÓR)',
            multiple: true,
            elements: [
                {
                    id: '01JS734VH9CFGBV9AZHP203JMS',
                    type: 'button',
                    name: "Używanie języka w praktyce",
                    icon: 'https://helen-doron-form-backend.emems.workers.dev/icons/vector-1.svg',
                    iconSelected: 'https://helen-doron-form-backend.emems.workers.dev/icons/vector-1-selected.svg',
                    layout: 'half'
                },
                {
                    id: '01JS7350CYZ1VDRKNV89R13FW2',
                    type: 'button',
                    name: "Zdanie egzaminów i szkoła",
                    icon: 'https://helen-doron-form-backend.emems.workers.dev/icons/vector-2.svg',
                    iconSelected: 'https://helen-doron-form-backend.emems.workers.dev/icons/vector-2-selected.svg',
                    layout: 'half'
                },
                {
                    id: '01JS73547A4YCPGXMJ6KSCTQ1T',
                    type: 'button',
                    name: "Dwujęzyczność",
                    icon: 'https://helen-doron-form-backend.emems.workers.dev/icons/vector-3.svg',
                    iconSelected: 'https://helen-doron-form-backend.emems.workers.dev/icons/vector-3-selected.svg',
                    layout: 'half'
                },
                {
                    id: '01JS735ASCGK9Y1EE14QGCSCQP',
                    type: 'button',
                    name: "Rozpoczęcie przygody z angielskim",
                    icon: 'https://helen-doron-form-backend.emems.workers.dev/icons/vector-4.svg',
                    iconSelected: 'https://helen-doron-form-backend.emems.workers.dev/icons/vector-4-selected.svg',
                    layout: 'half'
                },
            ]
        },
        {
            title: 'Czy Twoje dziecko ma już jakieś doświadczenie z angielskim?',
            elements: [
                {
                    id: '01JS735F3NZEA5G7H95MH9WA74',
                    type: 'button',
                    name: "Nie, jeszcze nie miało",
                    icon: 'https://helen-doron-form-backend.emems.workers.dev/icons/progress-0.svg',
                    iconSelected: 'https://helen-doron-form-backend.emems.workers.dev/icons/progress-0-selected.svg',
                    layout: 'half'
                },
                {
                    id: '01JS735K5G70011CRSCYKQERDS',
                    type: 'button',
                    name: "Tak, ale jeszcze nie mówi",
                    icon: 'https://helen-doron-form-backend.emems.workers.dev/icons/progress-1.svg',
                    iconSelected: 'https://helen-doron-form-backend.emems.workers.dev/icons/progress-1-selected.svg',
                    layout: 'half'
                },
                {
                    id: '01JS735PHRT1Z84ERBZ39PYZ97',
                    type: 'button',
                    name: "Tak i radzi sobie nieźle",
                    icon: 'https://helen-doron-form-backend.emems.workers.dev/icons/progress-2.svg',
                    iconSelected: 'https://helen-doron-form-backend.emems.workers.dev/icons/progress-2-selected.svg',
                    layout: 'half'
                },
                {
                    id: '01JS735T0CBG7KGVA41X3C5GB7',
                    type: 'button',
                    name: "Spore i szukamy wyższego poziomu",
                    icon: 'https://helen-doron-form-backend.emems.workers.dev/icons/progress-3.svg',
                    iconSelected: 'https://helen-doron-form-backend.emems.workers.dev/icons/progress-3-selected.svg',
                    layout: 'half'
                },
            ]
        },
        {
            title: 'Na czym Ci zależy?',
            elements: [
                {
                    id: '01JS73604WMYB6M39H8PSTS5AD',
                    type: 'button',
                    name: "Lekcja pokazowa",
                    icon: 'https://helen-doron-form-backend.emems.workers.dev/icons/vector-5.svg',
                    iconSelected: 'https://helen-doron-form-backend.emems.workers.dev/icons/vector-5-selected.svg',
                    layout: 'half'
                },
                {
                    id: '01JS7363X8JC7Y975EAG0SZDJP',
                    type: 'button',
                    name: "Rezerwacja miejsca na kursie",
                    icon: 'https://helen-doron-form-backend.emems.workers.dev/icons/vector-6.svg',
                    iconSelected: 'https://helen-doron-form-backend.emems.workers.dev/icons/vector-6-selected.svg',
                    layout: 'half'
                },
                {
                    id: '01JS7367864SACJSD6PXXXVN5Q',
                    type: 'button',
                    name: "Oba powyższe",
                    layout: 'full',
                },
                {
                    id: '01JS736AK2QZMQZBFYKA75PQ83',
                    type: 'button',
                    name: "Mam pytania, proszę o kontakt",
                    layout: 'full',
                },
            ]
        },
        {
            title: 'Wypełnij formularz',
            elements: [
                {
                    id: 'search',
                    type: 'select',
                    name: "Województwo",
                    placeholder: 'Województwo',
                    values: wojewodztwa.map(el => {
                        el.name = el.name.charAt(0).toUpperCase() + el.name.slice(1)
                        return el;
                    }),
                    layout: 'full',
                },
                {
                    id: '2',
                    type: 'select',
                    isRequired: true,
                    name: "Oddział",
                    placeholder: 'Oddział',
                    getValuesEndpoint: 'https://helen-doron-form-backend.emems.workers.dev/api/form/department/get',
                    layout: 'full',
                },
                {
                    id: '3',
                    type: 'text',
                    name: "Twoje imię",
                    placeholder: 'Twoje imię',
                    layout: 'full',
                },
                {
                    id: '4',
                    type: 'text',
                    name: "Rok urodzenia dziecka",
                    placeholder: 'Rok urodzenia dziecka',
                    layout: 'full',
                },
                {
                    id: '5',
                    type: 'phone',
                    isRequired: true,
                    name: "Telefon",
                    placeholder: 'Telefon',
                },
                {
                    id: '6',
                    type: 'email',
                    isRequired: true,
                    name: "Email",
                    placeholder: 'Email',
                },
                {
                    id: '7',
                    type: 'checkbox',
                    name: "Akceptuję <a href='https://helendoron.pl/polityka-prywatnosci/'>Politykę prywatności</a>",
                    isRequired: true,
                    layout: 'full',
                },
            ]
        }

    ];
}

const wojewodztwa = [
    {
        "id": "dolnoslaskie",
        "name": "dolnośląskie"
    },
    {
        "id": "kujawskopomorskie",
        "name": "kujawsko-pomorskie"
    },
    {
        "id": "lubelskie",
        "name": "lubelskie"
    },
    {
        "id": "lubuskie",
        "name": "lubuskie"
    },
    {
        "id": "lodzkie",
        "name": "łódzkie"
    },
    {
        "id": "malopolskie",
        "name": "małopolskie"
    },
    {
        "id": "mazowieckie",
        "name": "mazowieckie"
    },
    {
        "id": "opolskie",
        "name": "opolskie"
    },
    {
        "id": "podkarpackie",
        "name": "podkarpackie"
    },
    {
        "id": "podlaskie",
        "name": "podlaskie"
    },
    {
        "id": "pomorskie",
        "name": "pomorskie"
    },
    {
        "id": "slaskie",
        "name": "śląskie"
    },
    {
        "id": "swietokrzyskie",
        "name": "świętokrzyskie"
    },
    {
        "id": "warminskomazurskie",
        "name": "warmińsko-mazurskie"
    },
    {
        "id": "wielkopolskie",
        "name": "wielkopolskie"
    },
    {
        "id": "zachodniopomorskie",
        "name": "zachodniopomorskie"
    }
]
