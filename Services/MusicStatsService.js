"use strict";
exports.__esModule = true;
var MusicStatsService = /** @class */ (function () {
    //#endregion
    //#region Constructors 
    function MusicStatsService(jsonFile, year) {
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
    MusicStatsService.prototype.initSort = function () {
        this.sortInfo();
        this.countArtists();
        this.sortArtists();
        this.countTitles();
        this.sortTitles();
    };
    MusicStatsService.createObj = function (data) {
        var file;
        try {
            file = JSON.parse(data.file);
        }
        catch (error) {
            console.log('Error Creating Object');
        }
        var statsObj = new MusicStatsService(file, data.year);
        var activity = {
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
    };
    MusicStatsService.prototype.sortRawData = function (jsonFile, year) {
        var _this = this;
        var yearVar = year.toString();
        jsonFile.forEach(function (element) {
            if (element.hasOwnProperty('title')) {
                if (JSON.stringify(element).includes(yearVar)
                    && JSON.stringify(element).includes('Listened to')) {
                    _this.sortedData.push({ title: JSON.stringify(element.title).slice(13, -1),
                        artist: element.description });
                }
            }
        });
    };
    MusicStatsService.prototype.sortInfo = function () {
        var _this = this;
        this.sortedData.forEach(function (item) {
            if (!_this.uniqueArtists.includes(item.artist)) {
                _this.uniqueArtists.push(item.artist);
            }
            if (!_this.uniqueTitles.find(function (_a) {
                var title = _a.title;
                return title === item.title;
            })) {
                _this.uniqueTitles.push({ title: item.title, artist: item.artist });
            }
        });
    };
    /// Counts the number of times a song shows up in the list
    // If it isn't already in the list it will add the item.
    MusicStatsService.prototype.countTitles = function () {
        var _this = this;
        this.sortedData.forEach(function (item) {
            if (!_this.titleCount.hasOwnProperty(item.title + " ")) {
                _this.titleCount[item.title + " "] = [item.artist + " ", 1];
            }
            else {
                _this.titleCount[item.title + " "][1] += 1;
            }
        });
    };
    /// Counts the number of times a artist shows up in the list
    // If it isn't already in the list it will add the item.
    MusicStatsService.prototype.countArtists = function () {
        var _this = this;
        this.sortedData.forEach(function (item) {
            _this.artistCount[item.artist + " "] = !_this.artistCount.hasOwnProperty(item.artist + " ")
                ? 1
                : _this.artistCount[item.artist + " "] + 1;
        });
    };
    MusicStatsService.prototype.sortArtists = function () {
        var sortable = [];
        for (var item in this.artistCount) {
            sortable.push([item, this.artistCount[item]]);
        }
        sortable.sort(function (a, b) {
            return b[1] - a[1];
        });
        sortable.length = sortable.length > 25 ? 25 : sortable.length;
        this.artistsSorted = sortable;
    };
    MusicStatsService.prototype.sortTitles = function () {
        var sortable = [];
        for (var item in this.titleCount) {
            sortable.push([item, this.titleCount[item][0], this.titleCount[item][1]]);
        }
        sortable.sort(function (a, b) {
            return b[2] - a[2];
        });
        sortable.length = sortable.length > 25 ? 25 : sortable.length;
        this.titlesSorted = sortable;
    };
    return MusicStatsService;
}());
exports["default"] = MusicStatsService;
