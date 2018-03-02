var assert = require('assert');
var should = require('should');
var Rectangle = require('../rectangle');

describe('Rectangle', function(){
    var r1;
    var r2;

    before(function(){
        r1 = new Rectangle(10, 20);
        r2 = new Rectangle(20, 20);
    });

    it('isSquare', function(){
        console.log( 'r1.isSquare : ', r1.isSquare());
        assert.equal(r1.isSquare(), false, 'Rectangle(10, 20)');
        assert.equal(r2.isSquare(), true, 'Rectangle(20, 20)');
    });

    it('size', function(){
        r1.size().should.equals(10 * 20, 'Rectangle(10, 20)');
        r2.size().should.equals(20 * 20, 'Rectangle(20, 20)');
    });
})