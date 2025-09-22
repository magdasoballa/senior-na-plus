export const adminMenu = [
    {
        title: 'Ustawienia',
        base: '/admin/settings',
        items: [
            { label: 'Strony', path: '/admin/settings/pages' },
            { label: 'Linki społecznościowe', path: '/admin/settings/social-links' },
            { label: 'Banery', path: '/admin/settings/banners' },
            { label: 'Ustawienia portalu', path: '/admin/settings/portal' },
            { label: 'Popup', path: '/admin/settings/popup' },
        ],
    },
    {
        title: 'Słowniki',
        base: '/admin/dictionaries',
        items: [
            { label: 'Umiejętności', path: '/admin/dictionaries/skills' },
            { label: 'Osoby do opieki', path: '/admin/dictionaries/care-targets' },
            // ...
        ],
    },
    // ...
]
