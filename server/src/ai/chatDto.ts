
interface Message {
    text: string;
}

export interface ChatDto{
    role : string,
    parts : Message[]
}