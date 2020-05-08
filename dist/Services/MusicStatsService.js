"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MusicStatsService {
    //#endregion
    //#region Constructors 
    constructor(jsonFile, year) {
        //#region Properties
        this.sortedData = new Array();
        this.uniqueTitles = [];
        this.uniqueArtists = [];
        this.totalTitles = '';
        this.totalArtists = '';
        this.titleCount = {};
        this.artistCount = {};
        this.artistsSorted = [];
        this.titlesSorted = [];
        try {
            this.sortRawData(jsonFile, year);
            this.initSort();
        }
        catch (error) {
            console.log("Error Sorting Data");
        }
    }
    //#endregion
    //#region Methods
    initSort() {
        this.sortInfo();
        this.countArtists();
        this.sortArtists();
        this.countTitles();
        this.sortTitles();
    }
    static createObj(data) {
        let file;
        try {
            file = JSON.parse(data.file);
        }
        catch (error) {
            console.log('Error Creating Object');
        }
        const statsObj = new MusicStatsService(file, data.year);
        const activity = {
            totalTitles: statsObj.uniqueTitles.length.toString(),
            totalArtists: statsObj.uniqueArtists.length.toString(),
            titleCount: statsObj.titleCount,
            artistCount: statsObj.artistCount,
            artistsSorted: statsObj.artistsSorted,
            titlesSorted: statsObj.titlesSorted
        };
        // if there are no titles, there will be no data to display. return null
        if (activity.totalTitles === "0") {
            return null;
        }
        else {
            return activity;
        }
    }
    sortRawData(jsonFile, year) {
        const yearVar = year.toString();
        jsonFile.forEach(element => {
            if (element.hasOwnProperty('title')) {
                //@ts-ignore
                if (JSON.stringify(element).includes(yearVar)
                    //@ts-ignore
                    && JSON.stringify(element).includes('Listened to')) {
                    this.sortedData.push({ title: JSON.stringify(element.title).slice(13, -1),
                        artist: element.description });
                }
            }
        });
    }
    sortInfo() {
        this.sortedData.forEach(item => {
            //@ts-ignore
            if (!this.uniqueArtists.includes(item.artist)) {
                this.uniqueArtists.push(item.artist);
            }
            //@ts-ignore
            if (!this.uniqueTitles.find(({ title }) => title === item.title)) {
                this.uniqueTitles.push({ title: item.title, artist: item.artist });
            }
        });
    }
    /// Counts the number of times a song shows up in the list
    // If it isn't already in the list it will add the item.
    countTitles() {
        this.sortedData.forEach(item => {
            if (!this.titleCount.hasOwnProperty(`${item.title} `)) {
                this.titleCount[`${item.title} `] = [`${item.artist} `, 1];
            }
            else {
                this.titleCount[`${item.title} `][1] += 1;
            }
        });
    }
    /// Counts the number of times a artist shows up in the list
    // If it isn't already in the list it will add the item.
    countArtists() {
        this.sortedData.forEach(item => {
            this.artistCount[`${item.artist} `] = !this.artistCount.hasOwnProperty(`${item.artist} `)
                ? 1
                : this.artistCount[`${item.artist} `] + 1;
        });
    }
    sortArtists() {
        let sortable = [];
        for (let item in this.artistCount) {
            sortable.push([item, this.artistCount[item]]);
        }
        sortable.sort((a, b) => {
            return b[1] - a[1];
        });
        sortable.length = sortable.length > 25 ? 25 : sortable.length;
        this.artistsSorted = sortable;
    }
    sortTitles() {
        let sortable = [];
        for (let item in this.titleCount) {
            sortable.push([item, this.titleCount[item][0], this.titleCount[item][1]]);
        }
        sortable.sort((a, b) => {
            return b[2] - a[2];
        });
        sortable.length = sortable.length > 25 ? 25 : sortable.length;
        this.titlesSorted = sortable;
    }
}
exports.default = MusicStatsService;
//# sourceMappingURL=MusicStatsService.js.map