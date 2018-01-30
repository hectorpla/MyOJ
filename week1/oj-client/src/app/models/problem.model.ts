export class Problem {
    id: number;
    name: string;
    desc: string;
    difficulty: string;

    constructor(id:number, name:string, desc:string, difficulty:string) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.difficulty = difficulty;
    }
}