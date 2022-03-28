"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mustache_express_1 = __importDefault(require("mustache-express"));
var dayjs_1 = __importDefault(require("dayjs"));
require("dayjs/locale/de");
var customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
dayjs_1.default.locale('de');
dayjs_1.default.extend(customParseFormat_1.default);
var lodash_1 = __importDefault(require("lodash"));
var calendar_1 = require("./calendar");
function run() {
    calendar_1.loadCalendars();
    var app = express_1.default();
    app.set('views', __dirname + "/views");
    app.set('view engine', 'mustache');
    app.engine('mustache', mustache_express_1.default());
    app.get('/:locale/:month', function (req, res, next) {
        var currentMonth = dayjs_1.default("2020-" + lodash_1.default.capitalize(req.params.month.replace('ae', 'ä')) + "-01", 'YYYY-MMMM-DD');
        var previousMonth = currentMonth.subtract(1, 'month').format('MMMM');
        var nextMonth = currentMonth.add(1, 'month').format('MMMM');
        var fruits = calendar_1.getByMonth(currentMonth.get('month'));
        res.render('month', {
            month: lodash_1.default.capitalize(req.params.month),
            fruits: calendar_1.markCurrentMonth(fruits.sort(calendar_1.sortRegionalToImport)),
            previousMonth: previousMonth,
            nextMonth: nextMonth,
        });
    });
    app.get('/about', function (req, res, next) {
        res.render('about');
    });
    app.get('/', function (req, res, next) {
        res.redirect("/de/" + dayjs_1.default().format('MMMM').toLowerCase().replace('ä', 'ae'));
    });
    app.get('*', function (req, res) {
        res.status(404).render('404');
    });
    app.listen(3000, function () {
        console.log('server is running');
    });
}
run();
