export type CardType = 'normal' | 'elimination' | 'winner';

export interface CardData {
    id: string;
    type: CardType;
    content: string;
}

export interface EliminatedItem {
    content: string;
    type: 'winner' | 'elimination';
}
