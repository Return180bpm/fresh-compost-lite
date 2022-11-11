declare module '@tarekraafat/autocomplete.js' {
    export function autoComplete(config: AutoComplete): AutoComplete;
    export default autoComplete;

    interface AutoComplete {
        selector: string;
        placeHolder: string;
        data: object;
        resultsList: object;
        resultItem: object;
    }
}