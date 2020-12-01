import { ParseSuccess, ParseFail, ParseSingleWhitespace, ParseManyWhitespace, ParseMany1Whitespace } from './parser-library';
import { expectType, TypeOf, TypeEqual } from "ts-expect";

describe('ParseSingleWhitespace', () => {
    it('parses a single space from the front', () => {
        type Result = ParseSingleWhitespace<"   ">;
        type Expected = ParseSuccess<string, " ", "  ">;
    
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
        type Expected = ParseSuccess<string, "", "foo ">;
    
        expectType<TypeEqual<Result, Expected>>(true);
    });

    // it('parses and consumes all whitespace characters from start of string', () => {
    //     type Result = ParseMany1Whitespace<"  foo bar">;
    //     type Expected = ParseSuccess<string, "  ", "foo bar">;
    
    //     expectType<TypeEqual<Result, Expected>>(true);
    // });
});