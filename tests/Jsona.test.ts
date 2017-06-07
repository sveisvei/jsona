/// <reference path="../typings/globals/mocha/index.d.ts" />
import * as chai from 'chai';
import {expect} from 'chai';
import Jsona from '../src';

import {
    town1,
    town2,
    user1,
    user2,
    specialty1,
    specialty2,
    country2,
    reduxObject1
} from './mocks';

chai.config.showDiff = true;
chai.config.truncateThreshold = 0;

describe('Jsona', () => {
    let jsona;

    it('should instantiate with fallback property mappers', () => {
        jsona = new Jsona();
    });

    describe('serialize', () => {
        it('should throw Error if stuff is not passed', () => {
            expect(jsona.serialize.bind(jsona, {stuff: null})).to.throw(Error);
        });

        it('should build json with item, without included', () => {
            const jsonBody = jsona.serialize({stuff: town1.model});
            expect(jsonBody.data).to.be.deep.equal(town1.json);
            expect(jsonBody.included).to.be.equal(undefined);
        });

        it('should build json with collection, with included', () => {
            const jsonBody = jsona.serialize({stuff: user2.model, includeNames: ['specialty', 'town.country']});
            expect(jsonBody.data).to.be.deep.equal(user2.json);
            expect(jsonBody.included).to.be.deep.equal([country2.json, specialty1.json, specialty2.json, town2.json]);
        });
    });

    describe('denormalizeReduxObject', () => {

        it('should throw Error if reduxObject is not passed', () => {
            const denormalizeReduxObject = jsona.denormalizeReduxObject.bind(jsona, {
                reduxObject: null,
            });
            expect(denormalizeReduxObject).to.throw(Error, 'reduxObject');
        });

        it('should throw Error if entityType is not passed', () => {
            const denormalizeReduxObject = jsona.denormalizeReduxObject.bind(jsona, {
                reduxObject: {},
            });
            expect(denormalizeReduxObject).to.throw(Error, 'entityType');
        });

        it('should return null if no such entityType in reduxObject', () => {
            const model = jsona.denormalizeReduxObject({
                reduxObject: {},
                entityType: 'myEntity'
            });
            expect(model).to.be.equal(null);
        });

        it('should return null if no such entityId in reduxObject', () => {
            const model = jsona.denormalizeReduxObject({
                reduxObject: reduxObject1,
                entityType: 'article',
                entityIds: '1029'
            });
            expect(model).to.be.equal(null);
        });

        it('should return collection of models if entityIds is Array', () => {
            const models = jsona.denormalizeReduxObject({
                reduxObject: reduxObject1,
                returnBuilderInRelations: false,
                entityType: 'town',
                entityIds: ['21', '80']
            });
            expect(models).to.be.an('array');
            expect(models).to.be.deep.equal([town1.model, town2.model]);
        });

        it('should return collection of models if entityIds is not passed', () => {
            const models = jsona.denormalizeReduxObject({
                reduxObject: reduxObject1,
                returnBuilderInRelations: false,
                entityType: 'user',
            });
            expect(models).to.be.an('array');
            expect(models).to.be.deep.equal([user1.model, user2.model]);
        });

    });

});