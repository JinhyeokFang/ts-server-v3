"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_response_1 = require("ts-response");
const BaseController_1 = __importDefault(require("../BaseController"));
class IndexController extends BaseController_1.default {
    constructor() {
        super();
        this.router.get('/', this.index);
    }
    index(req, res) {
        ts_response_1.responseOKWithPage(res, 'index');
    }
}
exports.default = IndexController;
