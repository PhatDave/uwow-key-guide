import type {IconDefinition} from '@fortawesome/fontawesome-svg-core';

export const themes = ['dark', 'light'] as const;
export type Theme = (typeof themes)[number];

export type NavLink = {
    target: {
        href: string;
        newTab?: boolean;
    };
    content: {
        text?: string;
        icon?: IconDefinition;
    };
};

export type Document = {
    id: string,
    collectionId: string,
    created: Date,
    updated: Date,
    title: string,
    content: string,
    thumbnail: string,
    images: string[],
}
