'use strict';

// Libraries
import async from 'async';
import http from 'superagent';
import {Promise} from 'es6-promise';
import validator from 'validator';

// Base API class
import Base from './Base';

class User extends Base {
    static get(id) {
        return () => {
            return new Promise((resolve, reject) => {
                async.waterfall([
                    callback => {
                        // TODO Refactor this out to a DAO layer.
                        http
                            .get('/user/' + id)
                            .withCredentials()
                            .use(this.constants.BASE_URL)
                            .timeout(this.constants.TIMEOUT_MS)
                            .end(callback);
                    },

                    (result, callback) => {
                        // TODO: Transform the data if necessary.
                        // TODO: Otherwise, pass it back to the caller.
                        callback(null, result.body);
                    }
                ], (error, data) => {
                    if (!error) {
                        resolve(data);
                    } else {
                        reject(error);
                    }
                });
            });
        };
    }

    static getPage(page, perPageCount) {
        return () => {
            return new Promise((resolve, reject) => {
                async.waterfall([
                    callback => {
                        http
                            .get('/users')
                            .withCredentials()
                            .query({
                                page: page,
                                'per_page_count': perPageCount
                            })
                            .use(this.constants.BASE_URL)
                            .timeout(this.constants.TIMEOUT_MS)
                            .end(callback);
                    },

                    (result, callback) => {
                        // TODO: Transform the data if necessary.
                        // TODO: Otherwise, pass it back to the caller.
                        let response = result.body;

                        if (response.page === page && response.perPageCount === perPageCount && response.data != null) {
                            callback(null, response.data);
                        } else {
                            callback(new Error('Invalid response!'));
                        }
                    }
                ], (error, data) => {
                    if (!error) {
                        resolve(data);
                    } else {
                        reject(error);
                    }
                });
            });
        };
    }

    static register(email, name) {
        return () => {
            return new Promise((resolve, reject) => {
                async.waterfall([
                    function (callback) {
                        http
                            .post('/register')
                            .withCredentials()
                            .query({
                                email,
                                name
                            })
                            .use(this.constants.BASE_URL)
                            .timeout(this.constants.TIMEOUT_MS)
                            .end(callback);
                    },

                    function (result, callback) {
                        // TODO: Transform the data if necessary.
                        // TODO: Otherwise, pass it back to the caller.
                        callback(null, result.body);
                    }
                ], (error, data) => {
                    if (!error) {
                        resolve(data);
                    } else {
                        reject(error);
                    }
                });
            });
        };
    }
}

export default User;
