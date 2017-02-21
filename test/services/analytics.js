"use strict";
var _      = require('lodash');
var assert = require('chai').assert;
var expect = require('chai').expect;
var sinon = require('sinon');
var nock = require('nock');
var mockery = require('mockery');
var analytics = require('../../app/services/analytics');

describe('Analytics', function () {


    before(function(){
        this.knex = require('../../config/knex');
        this.mockDb = require('mock-knex');
        this.db = this.knex({
            client: 'sqlite'
        });
        this.mockDb.mock(this.db);
        this.tracker = this.mockDb.getTracker();
        this.tracker.install();
        this.tracker.on('query', function checkResult(query) {
            query.response([
                {
                    viewId : '123'
                }
            ]);
        });
    });

    describe('#getViewIdByClientId', function() {

       it('should get from the database the viewId with the given clientId', function() {
           analytics.getViewIdByClientId(1).then((viewId) => {
               assert.equal(viewId, '123');
           })
       });

    });

});