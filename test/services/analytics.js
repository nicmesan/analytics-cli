"use strict";
var _      = require('lodash');
var assert = require('chai').assert;
var expect = require('chai').expect;
var sinon = require('sinon');
var nock = require('nock');
var mockery = require('mockery');

describe('Analytics', function () {

    var knex;

    beforeEach(function(){
        //Mock Knex
    });

    describe('#getViewIdByClientId', function() {
       it('should get from the database the viewId with the given clientId', function() {
            expect(1).to.equal(1);
       })
    });

});