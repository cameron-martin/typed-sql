import { ParseSuccess, ParseFail, ParseSingleWhitespace, ParseManyWhitespace, ParseMany1Whitespace, ParseStringLiteral } from './parser-library';
import { expectType, TypeOf, TypeEqual } from "ts-expect";

describe('ParseSingleWhitespace', () => {
    it('parses a single space from the front', () => {
        type Result = ParseSingleWhitespace<"   ">;
        type Expected = ParseSuccess<" ", "  ">;
    
        expectType<TypeEqual<Result, Expected>>(true);
    });

    it('fails when string contains no whitespace at front', () => {
        type Result = ParseSingleWhitespace<"foo">;
        type Expected = ParseFail;
    
        expectType<TypeEqual<Result, Expected>>(true);
    });
});
describe('ParseManyWhitespace', () => {
    it('parses empty string and consumes nothing if no whitespace at front', () => {
        type Result = ParseManyWhitespace<"foo ">;
        type Expected = ParseSuccess<"", "foo ">;
    
        expectType<TypeEqual<Result, Expected>>(true);
    });

    // it('parses and consumes all whitespace characters from start of string', () => {
    //     type Result = ParseManyWhitespace<" foo bar">;
    //     type Expected = ParseSuccess<" ", "foo bar">;
    
    //     expectType<TypeEqual<Result, Expected>>(true);
    // });
});

describe('ParseStringLiteral', () => {
    describe('single quotes', () => {
        it('parses empty string with no remainder', () => {
            type Result = ParseStringLiteral<"''">;
            type Expected = ParseSuccess<"", "">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses empty string with remainder', () => {
            type Result = ParseStringLiteral<"'' foo">;
            type Expected = ParseSuccess<"", " foo">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses simple string', () => {
            type Result = ParseStringLiteral<"'foo' bar">;
            type Expected = ParseSuccess<"foo", " bar">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses string with escaped quote', () => {
            type Result = ParseStringLiteral<"'foo\\'' bar">;
            type Expected = ParseSuccess<"foo'", " bar">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses string with escaped non-quote value', () => {
            type Result = ParseStringLiteral<"'fo\\o' bar">;
            type Expected = ParseSuccess<"foo", " bar">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });
    });

    describe('double quotes', () => {
        it('parses empty string with no remainder', () => {
            type Result = ParseStringLiteral<'""'>;
            type Expected = ParseSuccess<"", "">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses empty string with remainder', () => {
            type Result = ParseStringLiteral<'"" foo'>;
            type Expected = ParseSuccess<"", " foo">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses simple string', () => {
            type Result = ParseStringLiteral<'"foo" bar'>;
            type Expected = ParseSuccess<"foo", " bar">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses string with escaped quote', () => {
            type Result = ParseStringLiteral<'"foo\\"" bar'>;
            type Expected = ParseSuccess<"foo\"", " bar">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });

        it('parses string with escaped non-quote value', () => {
            type Result = ParseStringLiteral<'"fo\\o" bar'>;
            type Expected = ParseSuccess<"foo", " bar">;
        
            expectType<TypeEqual<Result, Expected>>(true);
        });
    });

    it('does not parse mixed quotes', () => {
        type Result = ParseStringLiteral<'"foo\' bar'>;
        type Expected = ParseFail;
    
        expectType<TypeEqual<Result, Expected>>(true);
    });
});